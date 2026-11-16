import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export type SearchPrediction = {
  id: string;
  type: "store" | "product";
  name: string;
  subtitle: string;
  imageUrl: string | null;
  href: string;
  price?: number;
  score: number;
};

function calculateScore(text: string, query: string, baseBonus = 0): number {
  const t = text.toLowerCase().trim();
  const q = query.toLowerCase().trim();

  if (!q || !t) return 0;
  if (t === q) return 100 + baseBonus;
  if (t.startsWith(q)) return 80 + baseBonus;

  const words = t.split(/\s+/);
  if (words.some((w) => w.startsWith(q))) return 60 + baseBonus;
  if (t.includes(q)) return 40 + baseBonus;

  return baseBonus;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().slice(0, 80);
  const qLower = q.toLowerCase();
  const storeId = searchParams.get("storeId") || searchParams.get("store") || null;

  const supabase = createClient();

  try {
    // If scoped to a specific store, only return that store's products
    if (storeId) {
      let queryBuilder = supabase
        .from("products")
        .select(`
          id,
          name,
          price,
          image_url,
          description,
          stock,
          seller_id,
          sellers!inner ( id, store_name, status )
        `)
        .eq("seller_id", storeId)
        .eq("sellers.status", "approved");

      if (q) {
        queryBuilder = queryBuilder.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
      } else {
        queryBuilder = queryBuilder.order("name", { ascending: true });
      }

      const { data: products, error } = await queryBuilder.limit(50);
      if (error) {
        console.error("Store search error:", error);
        return NextResponse.json({ results: [], query: q, storeId });
      }

      const results: SearchPrediction[] = [];
      for (const p of products ?? []) {
        const sellerObj = Array.isArray(p.sellers) ? p.sellers[0] : p.sellers;
        let score = 1;
        if (q) {
          score = calculateScore(p.name, qLower, 20);
          if (p.description && calculateScore(p.description, qLower) > 0) {
            score = Math.max(score, 35);
          }
          if (p.stock > 0) score += 5;
        }

        const productHref = q
          ? `/products/${p.id}?from=search&store=${storeId}&q=${encodeURIComponent(q)}`
          : `/products/${p.id}?from=search&store=${storeId}`;

        results.push({
          id: p.id,
          type: "product",
          name: p.name,
          subtitle: `₱${Number(p.price).toFixed(2)} • ${sellerObj?.store_name ?? "Store Menu"}`,
          imageUrl: p.image_url ?? null,
          href: productHref,
          price: Number(p.price),
          score,
        });
      }

      if (q) {
        results.sort((a, b) => b.score - a.score);
      }

      return NextResponse.json({ results, query: q, storeId });
    }

    if (!q) {
      // Empty query: return featured stores and delicacies
      const [{ data: stores }, { data: products }] = await Promise.all([
        supabase
          .from("sellers")
          .select(`
            id,
            store_name,
            location,
            status,
            products ( id, image_url )
          `)
          .eq("status", "approved")
          .limit(5),
        supabase
          .from("products")
          .select(`
            id,
            name,
            price,
            image_url,
            stock,
            sellers!inner ( id, store_name, status )
          `)
          .eq("sellers.status", "approved")
          .limit(8),
      ]);

      const results: SearchPrediction[] = [];

      for (const s of stores ?? []) {
        const photo = s.products?.[0]?.image_url ?? null;
        results.push({
          id: s.id,
          type: "store",
          name: s.store_name,
          subtitle: s.location || "San Pablo City • Local Store",
          imageUrl: photo,
          href: `/stores/${s.id}?from=search`,
          score: 1,
        });
      }

      for (const p of products ?? []) {
        const sellerObj = Array.isArray(p.sellers) ? p.sellers[0] : p.sellers;
        results.push({
          id: p.id,
          type: "product",
          name: p.name,
          subtitle: `₱${Number(p.price).toFixed(2)} • ${sellerObj?.store_name ?? "Local Seller"}`,
          imageUrl: p.image_url ?? null,
          href: `/products/${p.id}?from=search`,
          price: Number(p.price),
          score: 1,
        });
      }

      return NextResponse.json({ results, query: "" });
    }

    // Active search: query stores and delicacies
    const [{ data: stores }, { data: products }] = await Promise.all([
      supabase
        .from("sellers")
        .select(`
          id,
          store_name,
          location,
          description,
          status,
          products ( id, name, image_url )
        `)
        .eq("status", "approved")
        .or(`store_name.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(10),
      supabase
        .from("products")
        .select(`
          id,
          name,
          price,
          image_url,
          description,
          stock,
          sellers!inner ( id, store_name, status )
        `)
        .eq("sellers.status", "approved")
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(20),
    ]);

    const results: SearchPrediction[] = [];

    // Map and score stores
    for (const s of stores ?? []) {
      const photo = s.products?.[0]?.image_url ?? null;
      let score = calculateScore(s.store_name, qLower, 10);
      if (s.description && calculateScore(s.description, qLower) > 0) {
        score = Math.max(score, 30);
      }

      results.push({
        id: s.id,
        type: "store",
        name: s.store_name,
        subtitle: s.location ? `${s.location} • Food Store` : "San Pablo City • Food Store",
        imageUrl: photo,
        href: `/stores/${s.id}?from=search&q=${encodeURIComponent(q)}`,
        score,
      });
    }

    // Map and score products
    for (const p of products ?? []) {
      const sellerObj = Array.isArray(p.sellers) ? p.sellers[0] : p.sellers;
      let score = calculateScore(p.name, qLower, 15);
      if (p.description && calculateScore(p.description, qLower) > 0) {
        score = Math.max(score, 35);
      }
      if (p.stock > 0) {
        score += 5;
      }

      results.push({
        id: p.id,
        type: "product",
        name: p.name,
        subtitle: `₱${Number(p.price).toFixed(2)} • ${sellerObj?.store_name ?? "Local Store"}`,
        imageUrl: p.image_url ?? null,
        href: `/products/${p.id}?from=search&q=${encodeURIComponent(q)}`,
        price: Number(p.price),
        score,
      });
    }

    // Sort predictions by relevance score descending
    results.sort((a, b) => b.score - a.score);

    return NextResponse.json({ results, query: q });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to perform search", results: [] },
      { status: 500 }
    );
  }
}
