"use server";

import { createClient } from "@/lib/supabase/server";

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

/** List orders for the current customer (RLS: customer reads own). */
export async function getCustomerOrders(): Promise<OrderWithItems[] | null> {
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
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return null;
  return (data ?? []).map((o: any) => ({
    ...o,
    sellerStoreName: o.sellers?.store_name ?? null,
  })) as unknown as OrderWithItems[];
}

/** List orders for the current seller's store (RLS: seller reads own store). */
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
  return (data ?? []).map((o: any) => ({
    ...o,
    sellerStoreName: o.sellers?.store_name ?? null,
  })) as unknown as OrderWithItems[];
}
