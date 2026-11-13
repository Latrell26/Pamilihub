"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/roles";
import { checkoutSchema, type CheckoutInput } from "./schemas";

type ActionState = {
  success: boolean;
  message: string;
  orderIds?: string[];
  errors?: Record<string, string[]>;
};

const DELIVERY_FEE = 50; // flat per seller order (₱)

interface CartItemInput {
  productId: string;
  quantity: number;
}

interface ProductRow {
  id: string;
  seller_id: string;
  name: string;
  price: number;
  stock: number;
}

/** Checkout: validate stock, create one order per seller, deduct stock.
 *
 *  Cart items are expected to include product info (id, name, price, stock,
 *  seller_id, image_url, quantity). The server recomputes totals and never
 *  trusts client-sent prices.
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

  let cartItems: CartItemInput[];
  try {
    cartItems = JSON.parse(cartJson);
  } catch {
    return { success: false, message: "Invalid cart data." };
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, message: "Cart is empty." };
  }

  // Fetch current product data from the database (never trust client prices/stock)
  const productIds = Array.from(new Set(cartItems.map((i) => i.productId)));
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("id, seller_id, name, price, stock")
    .in("id", productIds);

  if (prodError || !products) {
    return { success: false, message: "Failed to load products." };
  }

  const productMap = new Map<string, ProductRow>();
  for (const p of products) {
    productMap.set(p.id, p as ProductRow);
  }

  // Validate stock and recompute per-seller totals
  const itemsBySeller = new Map<string, Array<{ productId: string; quantity: number; name: string; price: number; sellerId: string }>>();
  for (const item of cartItems) {
    const product = productMap.get(item.productId);
    if (!product) {
      return { success: false, message: `Product not found: ${item.productId}` };
    }
    if (product.stock < item.quantity) {
      return {
        success: false,
        message: `Not enough stock for "${product.name}" (${product.stock} left).`,
      };
    }
    if (!itemsBySeller.has(product.seller_id)) {
      itemsBySeller.set(product.seller_id, []);
    }
    itemsBySeller.get(product.seller_id)!.push({
      productId: item.productId,
      quantity: item.quantity,
      name: product.name,
      price: Number(product.price),
      sellerId: product.seller_id,
    });
  }

  // Deduct stock atomically via the database function (single transaction)
  const deductItems = cartItems.map((i) => ({
    product_id: i.productId,
    quantity: i.quantity,
  }));
  const { error: deductError } = await supabase.rpc("deduct_stock", {
    p_order_items: deductItems,
  });
  if (deductError) {
    return {
      success: false,
      message: deductError.message.includes("Insufficient stock")
        ? deductError.message
        : "Stock check failed. Please try again.",
    };
  }

  // Create one order per seller
  const orderIds: string[] = [];
  const sellerEntries = Array.from(itemsBySeller.entries());
  for (const [sellerId, items] of sellerEntries) {
    const subtotal = items.reduce(
      (acc: number, i) => acc + i.price * i.quantity,
      0
    );
    const total = subtotal + DELIVERY_FEE;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: user.id,
        seller_id: sellerId,
        delivery_name: parsed.data.deliveryName,
        delivery_phone: parsed.data.deliveryPhone,
        delivery_address: parsed.data.deliveryAddress,
        delivery_fee: DELIVERY_FEE,
        total,
        payment_method: parsed.data.paymentMethod,
        payment_status: "pending",
        order_status: "pending",
      })
      .select("id")
      .single();

    if (orderError) {
      // Rollback: restore stock for all items already deducted
      await supabase.rpc("restore_stock", { p_order_items: deductItems });
      return { success: false, message: "Failed to create order." };
    }

    orderIds.push(order.id);

    // Create order items
    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      quantity: i.quantity,
      unit_price: i.price,
    }));
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);
    if (itemsError) {
      // Rollback: restore stock and delete the order
      await supabase.rpc("restore_stock", { p_order_items: deductItems });
      await supabase.from("orders").delete().eq("id", order.id);
      return { success: false, message: "Failed to create order items." };
    }

    // Create a payments record
    await supabase.from("payments").insert({
      order_id: order.id,
      method: parsed.data.paymentMethod,
      status: "pending",
    });
  }

  return {
    success: true,
    message: "Order(s) placed successfully.",
    orderIds,
  };
}
