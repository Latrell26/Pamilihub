import Link from "next/link";
import Image from "next/image";
import { getAdminProducts } from "@/modules/admin/queries";
import { getCategories } from "@/modules/catalog/queries";
import AdminNav from "@/components/admin/AdminNav";
import AdminProductDeleteButton from "@/components/admin/AdminProductDeleteButton";

export const dynamic = "force-dynamic";

interface AdminProductsPageProps {
  searchParams: {
    categoryId?: string;
    search?: string;
  };
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const { categoryId, search } = searchParams;
  const [products, categories] = await Promise.all([
    getAdminProducts({ categoryId, search }),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-[11px] font-bold text-primary mb-1">
          <span>🥧</span>
          <span>Catalog Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Product Moderation & Catalog Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Inspect food listings across all local San Pablo sellers, check inventory status, and moderate listings.
        </p>
      </div>

      <AdminNav />

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-3">
        <form method="GET" className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search by product name, category, or store name..."
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            name="categoryId"
            defaultValue={categoryId ?? "all"}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Categories</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
          >
            Filter
          </button>

          {(categoryId || search) && (
            <Link
              href="/admin/products"
              className="px-3 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground text-center"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>Showing {products.length} product listing{products.length === 1 ? "" : "s"}</span>
        </div>

        {products.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center space-y-2">
            <p className="text-sm font-bold text-foreground">No products match your filters</p>
            <p className="text-xs text-muted-foreground">Try clearing filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image / Placeholder */}
                  <div className="relative aspect-video w-full bg-muted border-b border-border overflow-hidden">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl text-muted-foreground/40 font-black">
                        🥧
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white uppercase">
                        {p.category?.name ?? "Delicacy"}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase backdrop-blur-sm ${
                          p.stock > 0
                            ? "bg-emerald-600/90 text-white"
                            : "bg-rose-600/90 text-white"
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-foreground text-sm leading-snug">
                        {p.name}
                      </h3>
                      <span className="font-black text-primary text-sm whitespace-nowrap">
                        ₱{Number(p.price).toFixed(2)}
                      </span>
                    </div>

                    {p.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {p.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate">
                        Store: <strong className="text-foreground">{p.seller?.store_name ?? "Seller"}</strong>
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          p.seller?.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-700"
                            : "bg-amber-500/10 text-amber-700"
                        }`}
                      >
                        {p.seller?.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Moderation Action */}
                <div className="p-4 pt-0 flex items-center justify-between gap-2">
                  <Link
                    href={`/products/${p.id}`}
                    target="_blank"
                    className="text-xs font-bold text-muted-foreground hover:text-foreground underline"
                  >
                    View in Catalog ↗
                  </Link>

                  <AdminProductDeleteButton productId={p.id} productName={p.name} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
