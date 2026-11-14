"use server";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
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

export type StoreListItem = {
  id: string;
  store_name: string;
  description: string | null;
  location: string | null;
  status: string;
  productCount: number;
  matchingFoodNames: string[];
  matchedByStoreName: boolean;
  categories: { id: string; name: string }[];
  sampleProducts: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  }[];
};

export type StoreDetail = {
  id: string;
  store_name: string;
  description: string | null;
  location: string | null;
  status: string;
  categories: { id: string; name: string }[];
  products: (ProductWithSeller & { category_name?: string })[];
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalizeSeller = (value: unknown) =>
  Array.isArray(value) ? (value[0] ?? null) : (value ?? null);

const getCachedCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, created_at")
      .order("name", { ascending: true });

    if (error || !data) return [];
    return data;
  },
  ["catalog-categories"],
  { revalidate: 3600, tags: ["categories"] }
);

/** List all categories (public read, cached across requests and deduplicated). */
export const getCategories = cache(async (): Promise<Category[] | null> => {
  try {
    return await getCachedCategories();
  } catch {
    return [];
  }
});

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
} = {}): Promise<ProductWithSeller[] | null> {
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
    sellers: normalizeSeller(item.sellers),
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
    sellers: normalizeSeller(data.sellers),
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

/** Get categories that have at least one food in an approved store (for R4). */
export async function getApprovedCategories(): Promise<{
  allCategories: Category[];
  approvedCategoryIds: string[];
}> {
  const supabase = createClient();
  const [categories, { data: prods }] = await Promise.all([
    getCategories(),
    supabase.from("products").select("category_id"),
  ]);

  const approvedIds = Array.from(
    new Set((prods ?? []).map((p: any) => p.category_id as string).filter(Boolean))
  );

  return {
    allCategories: categories ?? [],
    approvedCategoryIds: approvedIds,
  };
}

/**
 * List approved stores matching active filters (R1 - R4).
 */
export async function getApprovedStores({
  categoryId,
  search,
}: {
  categoryId?: string;
  search?: string;
} = {}): Promise<StoreListItem[]> {
  const supabase = createClient();

  const cleanSearch = typeof search === "string" ? search.trim().slice(0, 80) : "";
  const hasSearch = cleanSearch.length > 0;
  const searchLower = cleanSearch.toLowerCase();

  const [categories, { data: sellersData, error }] = await Promise.all([
    getCategories(),
    supabase
      .from("sellers")
      .select(
        `
        id,
        store_name,
        description,
        location,
        status,
        products (
          id,
          name,
          price,
          stock,
          image_url,
          category_id
        )
      `
      )
      .eq("status", "approved")
      .order("store_name", { ascending: true }),
  ]);

  if (error || !sellersData) {
    return [];
  }

  const catMap = new Map((categories ?? []).map((c) => [c.id, c.name]));

  const result: StoreListItem[] = [];

  for (const seller of sellersData) {
    if (seller.status !== "approved") continue;

    const allProducts = (seller.products ?? []) as {
      id: string;
      name: string;
      price: number;
      stock: number;
      image_url: string | null;
      category_id: string;
    }[];

    // If store has 0 products overall, it cannot appear (R1)
    if (allProducts.length === 0) continue;

    // Filter products by category if categoryId is provided
    const productsInCat = categoryId
      ? allProducts.filter((p) => p.category_id === categoryId)
      : allProducts;

    // Check if store name matches search (R2)
    const matchedByStoreName = hasSearch
      ? seller.store_name.toLowerCase().includes(searchLower)
      : false;

    // Check which foods in this store match search
    const matchingFoods = hasSearch
      ? productsInCat.filter((p) => p.name.toLowerCase().includes(searchLower))
      : [];
    const matchingFoodNames = matchingFoods.map((p) => p.name);

    // Apply R1:
    let matchesActiveFilters = false;

    if (!hasSearch && !categoryId) {
      matchesActiveFilters = allProducts.length > 0;
    } else if (hasSearch && !categoryId) {
      matchesActiveFilters =
        (matchedByStoreName && allProducts.length > 0) || matchingFoods.length > 0;
    } else if (!hasSearch && categoryId) {
      matchesActiveFilters = productsInCat.length > 0;
    } else {
      matchesActiveFilters =
        (matchedByStoreName && productsInCat.length > 0) || matchingFoods.length > 0;
    }

    if (!matchesActiveFilters) continue;

    // Extract categories present in this store
    const storeCatIds = Array.from(new Set(allProducts.map((p) => p.category_id)));
    const storeCategories = storeCatIds
      .map((id) => ({ id, name: catMap.get(id) ?? "Other" }))
      .sort((a, b) => a.name.localeCompare(b.name));

    result.push({
      id: seller.id,
      store_name: seller.store_name,
      description: seller.description,
      location: seller.location,
      status: seller.status,
      productCount: allProducts.length,
      matchingFoodNames,
      matchedByStoreName,
      categories: storeCategories,
      sampleProducts: allProducts.slice(0, 3).map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image_url: p.image_url,
      })),
    });
  }

  return result;
}

/**
 * Get one approved store's menu (R5).
 * Validates UUID before making any DB query.
 */
export async function getStoreMenu(storeId: string): Promise<StoreDetail | null> {
  if (!storeId || !UUID_REGEX.test(storeId)) {
    return null;
  }

  const supabase = createClient();

  const [categories, { data: store, error }] = await Promise.all([
    getCategories(),
    supabase
      .from("sellers")
      .select(
        `
        id,
        store_name,
        description,
        location,
        status,
        products (
          id,
          seller_id,
          category_id,
          name,
          description,
          price,
          stock,
          image_url,
          created_at,
          updated_at
        )
      `
      )
      .eq("id", storeId)
      .eq("status", "approved")
      .maybeSingle(),
  ]);

  if (error || !store) return null;

  const catMap = new Map((categories ?? []).map((c) => [c.id, c.name]));
  const products = ((store.products ?? []) as any[]).map((p) => ({
    ...p,
    category_name: catMap.get(p.category_id) ?? "Delicacies",
    sellers: {
      store_name: store.store_name,
      location: store.location,
      status: store.status,
    },
  })) as (ProductWithSeller & { category_name?: string })[];

  products.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const storeCatIds = Array.from(new Set(products.map((p) => p.category_id)));
  const storeCategories = storeCatIds
    .map((id) => ({ id, name: catMap.get(id) ?? "Other" }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    id: store.id,
    store_name: store.store_name,
    description: store.description,
    location: store.location,
    status: store.status,
    categories: storeCategories,
    products,
  };
}
