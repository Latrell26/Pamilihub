import Link from "next/link";
import { getAdminProducts } from "@/modules/admin/queries";
import { getCategories } from "@/modules/catalog/queries";
import AdminNav from "@/components/admin/AdminNav";
import AdminProductDeleteButton from "@/components/admin/AdminProductDeleteButton";
import {
  ShieldCheck,
  Search,
  RotateCcw,
  Store,
  ExternalLink,
  Package,
} from "lucide-react";

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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/25 bg-red-500/10 text-[11px] font-black uppercase tracking-wider text-red-600 mb-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Catalog Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Product Listings & Moderation
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Review, moderate, or remove food listings across all local San Pablo stores to ensure authentic culinary standards.
        </p>
      </div>

      <AdminNav />

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-5 rounded-3xl border border-border/70 bg-card shadow-xs">
        <form method="GET" className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search by delicacy name, category, or store name..."
              className="h-11 w-full rounded-2xl border border-transparent bg-muted/70 pl-11 pr-4 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15"
            />
          </div>

          <select
            name="categoryId"
            defaultValue={categoryId ?? "all"}
            className="h-11 rounded-2xl border border-transparent bg-muted/70 px-4 text-xs font-bold text-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
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
            className="h-11 px-6 rounded-full bg-primary text-xs font-extrabold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            Filter
          </button>

          {(categoryId || search) && (
            <Link
              href="/admin/products"
              className="h-11 flex items-center justify-center gap-1.5 px-4 rounded-full border border-border/70 bg-card text-xs font-bold text-muted-foreground hover:text-foreground transition-all shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Link>
          )}
        </form>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span className="font-bold">
            Showing {products.length} product listing{products.length === 1 ? "" : "s"}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="p-12 rounded-3xl border border-border/70 bg-card text-center space-y-2 shadow-xs">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-muted/60 text-muted-foreground">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No products match your filters</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Try clearing filters or searching with different terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl border border-border/70 bg-card shadow-xs overflow-hidden flex flex-col justify-between hover:border-border transition-all"
              >
                <div>
                  {/* Image / Placeholder */}
                  <div className="relative aspect-[16/10] w-full bg-muted border-b border-border/60 overflow-hidden">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl bg-muted/50">
                        🥧
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black uppercase text-white shadow-xs">
                        {p.category?.name ?? "Delicacy"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${
                          p.stock > 0
                            ? "bg-emerald-600/90 text-white"
                            : "bg-red-600/90 text-white"
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : "Sold out"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-foreground text-sm leading-snug">
                        {p.name}
                      </h3>
                      <span className="font-black text-primary text-base whitespace-nowrap">
                        ₱{Number(p.price).toFixed(2)}
                      </span>
                    </div>

                    {p.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    )}

                    <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 truncate">
                        <Store className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">
                          Store: <strong className="text-foreground">{p.seller?.store_name ?? "Seller"}</strong>
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                          p.seller?.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        {p.seller?.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Moderation Action */}
                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-border/40 mt-2 pt-3">
                  <Link
                    href={`/products/${p.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground hover:underline"
                  >
                    <span>View in Catalog</span>
                    <ExternalLink className="w-3 h-3" />
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
