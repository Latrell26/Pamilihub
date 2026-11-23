"use server";

import { createClient } from "@/lib/supabase/server";
import { Queue } from "@/lib/data-structures";
import type { OrderSummary, OrderDetail } from "./types";

// ─── Legacy types (kept for backward-compat with existing customer pages) ─────

export type OrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products: {
    name: string;
    image_url: string | null;
  } | null;
};

export type OrderWithItems = {
  id: string;
  customer_id: string;
  seller_id: string;
  sellerStoreName: string | null;
  sellerStoreImage: string | null;
  delivery_name: string;
  delivery_phone: string;
  delivery_address: string;
  delivery_fee: number;
  total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
};

// ─── Customer queries ─────────────────────────────────────────────────────────

/** List orders for the current customer (RLS: customer reads own). */
export async function getCustomerOrders(): Promise<OrderWithItems[] | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Check role so admins and sellers testing or viewing customer orders can see them
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  let query = supabase
    .from("orders")
    .select(
      `
      id, customer_id, seller_id,
      sellers ( store_name ),
      delivery_name, delivery_phone,
      delivery_address, delivery_fee, total, payment_method,
      payment_status, order_status, created_at, updated_at,
      order_items ( id, product_id, quantity, unit_price,
        products ( name, image_url ) )
      `
    )
    .order("created_at", { ascending: false });

  if (profile?.role === "seller") {
    // If logged in as seller, show orders placed by this user OR orders for their store
    const { data: seller } = await supabase
      .from("sellers")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (seller?.id) {
      query = query.or(`customer_id.eq.${user.id},seller_id.eq.${seller.id}`);
    } else {
      query = query.eq("customer_id", user.id);
    }
  } else if (profile?.role === "admin") {
    // Admin can view all orders
  } else {
    // Customer reads own orders
    query = query.eq("customer_id", user.id);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getCustomerOrders error:", error);
    return null;
  }

  return (data ?? []).map((o: any) => {
    const items = o.order_items ?? [];
    const storeImage =
      items.find((i: any) => i.products?.image_url)?.products?.image_url ?? null;
    const storeName = Array.isArray(o.sellers)
      ? o.sellers[0]?.store_name ?? null
      : o.sellers?.store_name ?? null;

    return {
      ...o,
      sellerStoreName: storeName,
      sellerStoreImage: storeImage,
    };
  }) as unknown as OrderWithItems[];
}

/** Get a single order with items (RLS: customer reads own, seller reads own store,
 *  admin reads all). */
export async function getOrderById(
  orderId: string
): Promise<OrderWithItems | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id, customer_id, seller_id,
      sellers ( store_name ),
      delivery_name, delivery_phone,
      delivery_address, delivery_fee, total, payment_method,
      payment_status, order_status, created_at, updated_at,
      order_items ( id, product_id, quantity, unit_price,
        products ( name, image_url ) )
      `
    )
    .eq("id", orderId)
    .single();

  if (error || !data) return null;
  const o = data as any;
  const items = o.order_items ?? [];
  const storeImage =
    items.find((i: any) => i.products?.image_url)?.products?.image_url ?? null;
  const storeName = Array.isArray(o.sellers)
    ? o.sellers[0]?.store_name ?? null
    : o.sellers?.store_name ?? null;

  return {
    ...o,
    sellerStoreName: storeName,
    sellerStoreImage: storeImage,
  } as unknown as OrderWithItems;
}

/** List orders for the current seller's store (RLS: seller reads own store).
 *  @deprecated Use getSellerOrdersListOnly for the new order management UI. */
export async function getSellerOrders(): Promise<OrderWithItems[] | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (!seller) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id, customer_id, seller_id,
      sellers ( store_name ),
      delivery_name, delivery_phone,
      delivery_address, delivery_fee, total, payment_method,
      payment_status, order_status, created_at, updated_at,
      order_items ( id, product_id, quantity, unit_price,
        products ( name, image_url ) )
      `
    )
    .eq("seller_id", seller.id)
    .order("created_at", { ascending: false });

  if (error) return null;
  return (data ?? []).map((o: any) => {
    const items = o.order_items ?? [];
    const storeImage =
      items.find((i: any) => i.products?.image_url)?.products?.image_url ?? null;
    const storeName = Array.isArray(o.sellers)
      ? o.sellers[0]?.store_name ?? null
      : o.sellers?.store_name ?? null;

    return {
      ...o,
      sellerStoreName: storeName,
      sellerStoreImage: storeImage,
    };
  }) as unknown as OrderWithItems[];
}

// ─── Seller order management UI ───────────────────────────────────────────────

/**
 * Returns a lightweight list of orders for the current seller's store.
 * Does NOT include order_items so the list loads fast.
 * Each row includes a generated item_preview and item_count
 * built from a small sub-select of order_items + products.
 */
export async function getSellerOrdersListOnly(): Promise<OrderSummary[] | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (!seller) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id, customer_id, seller_id,
      delivery_name, delivery_phone, delivery_address,
      delivery_fee, total, payment_method,
      payment_status, order_status, created_at, updated_at,
      order_items (
        id,
        quantity,
        products ( name )
      )
      `
    )
    .eq("seller_id", seller.id)
    .order("created_at", { ascending: false });

  if (error) return null;

  // Build a Queue of pending orders (oldest first = front of queue)
  const pendingOrders = (data ?? []).filter(
    (o: any) => o.order_status === "pending"
  );
  const queue = new Queue<OrderSummary>();
  for (let i = pendingOrders.length - 1; i >= 0; i--) {
    queue.enqueue(pendingOrders[i] as unknown as OrderSummary);
  }

  // Assign queue positions while maintaining original order
  let queuePos = 1;
  const result = (data ?? []).map((o: any) => {
    const items: Array<{ quantity: number; products: { name: string } | null }> =
      o.order_items ?? [];
    const item_count = items.reduce(
      (acc: number, i: { quantity: number }) => acc + i.quantity,
      0
    );
    const names = items
      .map((i) => i.products?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");
    const item_preview =
      item_count > 0
        ? `${item_count} item${item_count !== 1 ? "s" : ""}: ${names}${
            items.length > 3 ? ", …" : ""
          }`
        : "";

    const summary: OrderSummary = {
      id: o.id,
      customer_id: o.customer_id,
      seller_id: o.seller_id,
      delivery_name: o.delivery_name,
      delivery_phone: o.delivery_phone,
      delivery_address: o.delivery_address,
      delivery_fee: Number(o.delivery_fee),
      total: Number(o.total),
      payment_method: o.payment_method,
      payment_status: o.payment_status,
      order_status: o.order_status,
      created_at: o.created_at,
      updated_at: o.updated_at,
      item_preview,
      item_count,
    };

    // Assign queue position to pending orders (FIFO: oldest pending = position 1)
    if (o.order_status === "pending" && queue.size > 0) {
      summary.queuePosition = queuePos;
      queuePos++;
      queue.dequeue();
    }

    return summary;
  });

  return result;
}

/**
 * Fetches full order detail (with order_items + product names) for a single order.
 * Called lazily when the seller clicks a row.
 * RLS ensures the seller can only read their own store's orders.
 */
export async function getSellerOrderById(
  orderId: string
): Promise<OrderDetail | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id, customer_id, seller_id,
      delivery_name, delivery_phone, delivery_address,
      delivery_fee, total, payment_method,
      payment_status, order_status, created_at, updated_at,
      order_items (
        id, product_id, quantity, unit_price,
        products ( name, image_url )
      )
      `
    )
    .eq("id", orderId)
    .single();

  if (error || !data) return null;

  const o = data as any;
  return {
    id: o.id,
    customer_id: o.customer_id,
    seller_id: o.seller_id,
    delivery_name: o.delivery_name,
    delivery_phone: o.delivery_phone,
    delivery_address: o.delivery_address,
    delivery_fee: Number(o.delivery_fee),
    total: Number(o.total),
    payment_method: o.payment_method,
    payment_status: o.payment_status,
    order_status: o.order_status,
    created_at: o.created_at,
    updated_at: o.updated_at,
    order_items: (o.order_items ?? []).map((i: any) => ({
      id: i.id,
      product_id: i.product_id,
      quantity: i.quantity,
      unit_price: Number(i.unit_price),
      products: i.products ?? null,
    })),
  } as OrderDetail;
}
