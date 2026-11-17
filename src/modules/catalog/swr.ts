"use client";

import useSWR from "swr";
import type { Key } from "swr";
import { createBrowserClient } from "@/lib/swr/supabase";
import type { Category, ProductWithSeller, StoreListItem, StoreDetail } from "@/modules/catalog/queries";

/* ─── Categories ─── */

export type UseCategoriesReturn = {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
};

const CATEGORIES_KEY: Key = "pamilihub:categories";

async function fetchCategories(): Promise<Category[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, created_at")
    .order("name", { ascending: true });
  if (error) throw error;
  if (!data) return [];
  return data;
}

export function useCategories(): UseCategoriesReturn {
  const { data, error, isLoading } = useSWR<Category[], Error>(
    CATEGORIES_KEY,
    fetchCategories,
    { dedupingInterval: 60_000, revalidateOnFocus: false, fallbackData: [] }
  );
  return {
    categories: data ?? [],
    isLoading,
    error: error ?? null,
  };
}

/* ─── Products ─── */

export type UseProductsParams = {
  categoryId?: string;
  search?: string;
  sellerId?: string;
};

export type UseProductsReturn = {
  products: ProductWithSeller[];
  isLoading: boolean;
  error: Error | null;
};

function productsKey(params: UseProductsParams): Key {
  return [
    "pamilihub:products",
    params.categoryId ?? null,
    params.search ?? null,
    params.sellerId ?? null,
  ];
}

async function fetchProducts(params: UseProductsParams): Promise<ProductWithSeller[]> {
  const supabase = createBrowserClient();

  let query = supabase
    .from("products")
    .select(`
      id, seller_id, category_id, name, description, price, stock, image_url,
      created_at, updated_at,
      sellers ( store_name, location, status )
    `)
    .order("created_at", { ascending: false });

  if (params.categoryId) query = query.eq("category_id", params.categoryId);
  if (params.search) query = query.ilike("name", `%${params.search}%`);
  if (params.sellerId) query = query.eq("seller_id", params.sellerId);

  const { data, error } = await query;
  if (error) throw error;

  const normalizeSeller = (value: unknown) =>
    Array.isArray(value) ? (value[0] ?? null) : (value ?? null);

  return (data ?? []).map((item: any) => ({
    ...item,
    sellers: normalizeSeller(item.sellers),
  })) as ProductWithSeller[];
}

export function useProducts(params: UseProductsParams = {}): UseProductsReturn {
  const key = productsKey(params);
  const { data, error, isLoading } = useSWR<ProductWithSeller[], Error>(
    key,
    () => fetchProducts(params),
    { dedupingInterval: 30_000, revalidateOnFocus: false, fallbackData: [] }
  );
  return {
    products: data ?? [],
    isLoading,
    error: error ?? null,
  };
}

/* ─── Single Product ─── */

export type UseProductReturn = {
  product: ProductWithSeller | null;
  isLoading: boolean;
  error: Error | null;
};

const PRODUCT_KEY_PREFIX: string[] = ["pamilihub", "product"];

async function fetchProduct(productId: string): Promise<ProductWithSeller | null> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, seller_id, category_id, name, description, price, stock, image_url,
      created_at, updated_at,
      sellers ( store_name, location, status )
    `)
    .eq("id", productId)
    .single();

  if (error) throw error;
  if (!data) return null;

  const normalizeSeller = (value: unknown) =>
    Array.isArray(value) ? (value[0] ?? null) : (value ?? null);

  return {
    ...data,
    sellers: normalizeSeller(data.sellers),
  } as ProductWithSeller;
}

export function useProduct(productId: string | null): UseProductReturn {
  const key = productId ? [...PRODUCT_KEY_PREFIX, productId] : null;
  const { data, error, isLoading } = useSWR<ProductWithSeller | null, Error>(
    key,
    key ? () => fetchProduct(productId as string) : null,
    { dedupingInterval: 30_000, revalidateOnFocus: false, fallbackData: null }
  );
  return {
    product: data ?? null,
    isLoading,
    error: error ?? null,
  };
}

/* ─── Stores ─── */

export type UseStoresParams = {
  categoryId?: string;
  search?: string;
};

export type UseStoresReturn = {
  stores: StoreListItem[];
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
};

const STORES_KEY_PREFIX: Key = "pamilihub:stores";

async function fetchStores(params: UseStoresParams): Promise<{
  stores: StoreListItem[];
  categories: Category[];
}> {
  const supabase = createBrowserClient();

  const [catResult, sellersResult] = await Promise.all([
    supabase.from("categories").select("id, name, created_at").order("name", { ascending: true }),
    supabase
      .from("sellers")
      .select(`
        id, store_name, description, location, status,
        products ( id, name, price, stock, image_url, category_id )
      `)
      .eq("status", "approved")
      .order("store_name", { ascending: true }),
  ]);

  if (catResult.error) throw catResult.error;
  if (sellersResult.error) throw sellersResult.error;

  const categories: Category[] = catResult.data ?? [];
  const sellers = sellersResult.data ?? [];

  const catMap = new Map(categories.map((c) => [c.id, c.name]));
  const cleanSearch = typeof params.search === "string" ? params.search.trim().slice(0, 80) : "";
  const hasSearch = cleanSearch.length > 0;
  const searchLower = cleanSearch.toLowerCase();

  const result: StoreListItem[] = [];

  for (const seller of sellers) {
    if (seller.status !== "approved") continue;

    const allProducts = (seller.products ?? []) as {
      id: string; name: string; price: number; stock: number;
      image_url: string | null; category_id: string;
    }[];

    if (allProducts.length === 0) continue;

    const productsInCat = params.categoryId
      ? allProducts.filter((p) => p.category_id === params.categoryId)
      : allProducts;

    const matchedByStoreName = hasSearch
      ? seller.store_name.toLowerCase().includes(searchLower)
      : false;

    const matchingFoods = hasSearch
      ? productsInCat.filter((p) => p.name.toLowerCase().includes(searchLower))
      : [];
    const matchingFoodNames = matchingFoods.map((p) => p.name);

    let matchesActiveFilters = false;

    if (!hasSearch && !params.categoryId) {
      matchesActiveFilters = allProducts.length > 0;
    } else if (hasSearch && !params.categoryId) {
      matchesActiveFilters = (matchedByStoreName && allProducts.length > 0) || matchingFoods.length > 0;
    } else if (!hasSearch && params.categoryId) {
      matchesActiveFilters = productsInCat.length > 0;
    } else {
      matchesActiveFilters = (matchedByStoreName && productsInCat.length > 0) || matchingFoods.length > 0;
    }

    if (!matchesActiveFilters) continue;

    const storeCatIds = Array.from(new Set(allProducts.map((p) => p.category_id)));
    const storeCategories = storeCatIds
      .map((id) => ({ id, name: catMap.get(id) ?? "Other" }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const sampleProducts = [...allProducts]
      .sort((a, b) => (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0))
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image_url: p.image_url,
      }));

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
      sampleProducts,
    });
  }

  return { stores: result, categories };
}

export function useStores(params: UseStoresParams = {}): UseStoresReturn {
  const key: Key = [
    STORES_KEY_PREFIX,
    params.categoryId ?? null,
    params.search ?? null,
  ];
  const { data, error, isLoading } = useSWR<{ stores: StoreListItem[]; categories: Category[] }, Error>(
    key,
    () => fetchStores(params),
    { dedupingInterval: 60_000, revalidateOnFocus: false, fallbackData: { stores: [], categories: [] } }
  );
  return {
    stores: data?.stores ?? [],
    categories: data?.categories ?? [],
    isLoading,
    error: error ?? null,
  };
}

/* ─── Store Detail (menu) ─── */

export type UseStoreMenuReturn = {
  menu: StoreDetail | null;
  isLoading: boolean;
  error: Error | null;
};

async function fetchStoreMenu(storeId: string): Promise<StoreDetail | null> {
  const supabase = createBrowserClient();

  const [catResult, storeResult] = await Promise.all([
    supabase.from("categories").select("id, name, created_at").order("name", { ascending: true }),
    supabase
      .from("sellers")
      .select(`
        id, store_name, description, location, status,
        products ( id, seller_id, category_id, name, description, price, stock, image_url, created_at, updated_at )
      `)
      .eq("id", storeId)
      .eq("status", "approved")
      .maybeSingle(),
  ]);

  if (catResult.error) throw catResult.error;
  if (storeResult.error) throw storeResult.error;
  if (!storeResult.data) return null;

  const categories: Category[] = catResult.data ?? [];
  const store = storeResult.data;
  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  const products = ((store.products ?? []) as any[]).map((p) => ({
    ...p,
    category_name: catMap.get(p.category_id) ?? "Delicacies",
    sellers: {
      store_name: store.store_name,
      location: store.location,
      status: store.status,
    },
  })) as any[];

  products.sort(
    (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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
  } as StoreDetail;
}

export function useStoreMenu(storeId: string | null): UseStoreMenuReturn {
  const key = storeId ? ["pamilihub:store-menu", storeId] : null;
  const { data, error, isLoading } = useSWR<StoreDetail | null, Error>(
    key,
    key ? () => fetchStoreMenu(storeId as string) : null,
    { dedupingInterval: 60_000, revalidateOnFocus: false, fallbackData: null }
  );
  return {
    menu: data ?? null,
    isLoading,
    error: error ?? null,
  };
}
