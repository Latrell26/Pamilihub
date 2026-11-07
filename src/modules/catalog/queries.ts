"use server";

import { createClient } from "@/lib/supabase/server";

export type Category = {
  id: string;
  name: string;
  created_at: string;
};

export type ProductWithSeller = {
  id: string;
  seller_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  sellers: {
    store_name: string;
    location: string | null;
    status: string;
  } | null;
};

export type Product = Omit<ProductWithSeller, "sellers">;

/** List all categories (public read). */
export async function getCategories(): Promise<Category[] | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, created_at")
    .order("name", { ascending: true });

  if (error) return null;
  return data ?? [];
}

/**
 * List products with optional filters.
 * RLS enforces: customers see only approved sellers' products;
 * sellers see their own products; admins see all.
 */
export async function getProducts({
  categoryId,
  search,
  sellerId,
}: {
  categoryId?: string;
  search?: string;
  sellerId?: string;
}): Promise<ProductWithSeller[] | null> {
  const supabase = createClient();

  let query = supabase
    .from("products")
    .select(
      `
      id, seller_id, category_id, name, description, price, stock, image_url,
      created_at, updated_at,
      sellers ( store_name, location, status )
    `
    )
    .order("created_at", { ascending: false });

  if (categoryId) query = query.eq("category_id", categoryId);
  if (search) query = query.ilike("name", `%${search}%`);
  if (sellerId) query = query.eq("seller_id", sellerId);

  const { data, error } = await query;

  if (error) return null;
  return (data ?? []).map((item: any) => ({
    ...item,
    sellers: item.sellers?.[0] ?? null,
  })) as ProductWithSeller[];
}

/** Get a single product with seller info (public read, subject to RLS). */
export async function getProductDetail(
  productId: string
): Promise<ProductWithSeller | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, seller_id, category_id, name, description, price, stock, image_url,
      created_at, updated_at,
      sellers ( store_name, location, status )
    `
    )
    .eq("id", productId)
    .single();

  if (error) return null;
  if (!data) return null;
  return {
    ...data,
    sellers: data.sellers?.[0] ?? null,
  } as ProductWithSeller;
}

/** Get products owned by the current seller (for seller product management). */
export async function getSellerProducts(): Promise<ProductWithSeller[] | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!seller) return null;

  return getProducts({ sellerId: seller.id });
}
