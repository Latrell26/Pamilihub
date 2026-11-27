"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { checkoutSchema, type CheckoutInput, cartItemSchema } from "./schemas";
import { orderStatusUpdateSchema, type OrderStatusUpdateInput } from "./schemas";
import { Order, createPaymentProcessor, type PaymentMethod, type PaymentStatus } from "@/lib/oop";
import type { OrderStatus } from "./status-machine";

type ActionState = {
  success: boolean;
  message: string;
  orderIds?: string[];
  errors?: Record<string, string[]>;
};

/** Checkout: validate cart, create one order per seller, deduct stock — all
 *  inside a single database transaction via the checkout_cart RPC.
 *
 *  The RPC (SECURITY DEFINER) validates stock cumulatively, locks product rows,
 *  requires approved sellers, creates one order per seller with correct totals,
 *  and deducts stock atomically. The client never sets prices, totals, or
 *  payment_status.
 */
export async function checkoutAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return { success: false, message: "Not authenticated." };
  }
  if (user.role !== "customer") {
    return { success: false, message: "Only customers can place orders." };
  }

  // Parse and validate delivery info + payment method
  const parsed = checkoutSchema.safeParse({
    deliveryName: formData.get("delivery_name"),
    deliveryPhone: formData.get("delivery_phone"),
    deliveryAddress: formData.get("delivery_address"),
    paymentMethod: formData.get("payment_method"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Cart payload sent as JSON in a hidden form field
  const cartJson = formData.get("cart") as string | null;
  if (!cartJson) {
    return { success: false, message: "Cart is empty." };
  }

  let cartItemsRaw: unknown;
  try {
    cartItemsRaw = JSON.parse(cartJson);
  } catch {
    return { success: false, message: "Invalid cart data." };
  }

  const cartItemsParsed = z.array(cartItemSchema).safeParse(cartItemsRaw);
  if (!cartItemsParsed.success) {
    return {
      success: false,
      message: "Invalid cart items.",
      errors: cartItemsParsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }
  const cartItems: Array<{ productId: string; quantity: number }> =
    cartItemsParsed.data;

  if (cartItems.length === 0) {
    return { success: false, message: "Cart is empty." };
  }

  // Build items payload for checkout_cart RPC
  const p_items = cartItems.map((i) => ({
    product_id: i.productId,
    quantity: i.quantity,
  }));

  const p_delivery_info = {
    name: parsed.data.deliveryName,
    phone: parsed.data.deliveryPhone,
    address: parsed.data.deliveryAddress,
  };

  // Call checkout_cart RPC: validates stock, creates one order per seller,
  // deducts stock — all in a single database transaction.
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "checkout_cart",
    {
      p_items,
      p_delivery_info,
      p_payment_method: parsed.data.paymentMethod,
    }
  );

  if (rpcError) {
    console.error("checkout: checkout_cart failed:", rpcError);
    let msg = rpcError.message;

    // R9: A checkout stock error names the food and never shows a UUID.
    const uuidMatches = msg.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi
    );
    if (uuidMatches && uuidMatches.length > 0) {
      const { data: prods } = await supabase
        .from("products")
        .select("id, name")
        .in("id", uuidMatches);
      const prodMap = new Map((prods ?? []).map((p) => [p.id, p.name]));
      for (const uid of uuidMatches) {
        const foodName = prodMap.get(uid);
        msg = msg.replaceAll(uid, foodName ? `"${foodName}"` : "the selected food");
      }
    }

    return {
      success: false,
      message: msg.includes("Insufficient stock")
        ? msg
        : msg.includes("Product not found")
          ? msg
          : msg.includes("not available for ordering")
            ? msg
            : msg.includes("Cart is empty")
              ? msg
              : msg.includes("Missing delivery information")
                ? msg
                : msg.includes("Only customers can checkout")
                  ? msg
                  : msg.includes("Invalid payment method")
                    ? msg
                    : msg.includes("Invalid quantity")
                      ? msg
                      : "Checkout failed. Please try again.",
    };
  }

  const orderIds: string[] = Array.isArray(rpcData) ? (rpcData as string[]) : [];

  return {
    success: true,
    message: "Order(s) placed successfully.",
    orderIds,
  };
}

/** Seller/admin: update an order's status (accept, reject, prepare, deliver, complete, cancel). */
export async function updateOrderStatusAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return { success: false, message: "Not authenticated." };
  }
  if (user.role !== "seller" && user.role !== "admin") {
    return { success: false, message: "Only sellers or admins can update order status." };
  }

  const parsed = orderStatusUpdateSchema.safeParse({
    order_id: formData.get("order_id"),
    new_status: formData.get("new_status"),
  });

  if (!parsed.success) {
    return { success: false, message: "Validation failed." };
  }

  const { order_id, new_status } = parsed.data;

  // Enforce OOP Order domain rules (status machine + payment-gated accept) before RPC
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id, customer_id, seller_id, payment_method, payment_status, order_status, delivery_fee, total")
    .eq("id", order_id)
    .maybeSingle();

  if (existingOrder && existingOrder.order_status !== new_status) {
    try {
      const orderEntity = new Order({
        id: existingOrder.id,
        customerId: existingOrder.customer_id,
        sellerId: existingOrder.seller_id,
        paymentMethod: existingOrder.payment_method as PaymentMethod,
        deliveryFee: Number(existingOrder.delivery_fee),
        paymentStatus: existingOrder.payment_status as PaymentStatus,
        orderStatus: existingOrder.order_status as OrderStatus,
      });
      orderEntity.transitionTo(new_status as OrderStatus);

      if (new_status === "completed" && existingOrder.payment_method === "cod") {
        const codProcessor = createPaymentProcessor(
          "cod",
          existingOrder.id,
          Number(existingOrder.total)
        );
        codProcessor.process("collect_on_delivery");
      }
    } catch (domainErr) {
      return {
        success: false,
        message: domainErr instanceof Error ? domainErr.message : "Invalid order transition.",
      };
    }
  }

  const { error } = await supabase.rpc("update_order_status", {
    p_order_id: order_id,
    p_new_status: new_status,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/seller/orders");
  revalidatePath("/orders");

  return {
    success: true,
    message: `Order status updated to ${new_status}.`,
  };
}
