import Link from "next/link";
import { redirect } from "next/navigation";
import { getHeaderUser } from "@/lib/auth/header-user";
import { getCategories, getProducts } from "@/modules/catalog/queries";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";

const CATEGORY_META: Record<string, { icon: string; desc: string }> = {
  "pies": { icon: "🥧", desc: "Famous San Pablo Buko Pie & pastries" },
  "pastries": { icon: "🥐", desc: "Fresh baked pies and tarts" },
  "kakanin": { icon: "🥥", desc: "Espasol, Kalamay & Bibingka" },
  "coffee": { icon: "☕", desc: "Locally roasted Barako beans" },
  "snacks": { icon: "🛍️", desc: "Sweet preserves & native snacks" },
};

function getCategoryMeta(name: string) {
  const lower = name.toLowerCase();
  for (const [key, meta] of Object.entries(CATEGORY_META)) {
    if (lower.includes(key)) return meta;
  }
  return { icon: "🍲", desc: "Authentic San Pablo delicacies" };
}

const FALLBACK_CATEGORIES = [
  { id: "", name: "Pies & Tarts", icon: "🥧", desc: "Famous San Pablo Buko Pie" },
  { id: "", name: "Native Kakanin", icon: "🥥", desc: "Espasol, Kalamay & Bibingka" },
  { id: "", name: "Laguna Coffee", icon: "☕", desc: "Locally roasted beans" },
  { id: "", name: "Pasalubong", icon: "🛍️", desc: "Sweet preserves & snacks" },
];

export default async function HomePage() {
  const user = await getHeaderUser();

  if (user?.role === "admin") {
    redirect("/admin/dashboard");
  }

  if (user?.role === "seller") {
    redirect("/seller/orders");
  }

  const [featuredProducts, categories] = await Promise.all([
    getProducts({}),
    getCategories(),
  ]);

  const displayCategories =
    categories && categories.length > 0
      ? categories.slice(0, 4).map((c) => ({
          id: c.id,
          name: c.name,
          ...getCategoryMeta(c.name),
        }))
      : FALLBACK_CATEGORIES;

  const recentProducts = (featuredProducts ?? []).slice(0, 4);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-8">
      {/* PWA Mobile Search Header (Foodpanda style) */}
      <div className="relative">
        <Link
          href="/search"
          className="group relative flex w-full cursor-pointer items-center"
        >
          <div className="flex w-full items-center rounded-2xl border border-border bg-card py-3 pl-11 pr-24 text-xs text-muted-foreground shadow-sm transition-all group-hover:bg-muted/40 sm:py-3.5 sm:text-sm">
            <span>Search local delicacies, buko pie, espasol...</span>
          </div>
          <svg
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-primary sm:h-5 sm:w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.65 10.65Z"
            />
          </svg>
          <span
            className="absolute right-2 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition-all active:scale-95 group-hover:bg-primary/90"
          >
            Find Food
          </span>
        </Link>
      </div>

      {/* Hero Food App Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary to-rose-600 text-primary-foreground p-6 sm:p-10 shadow-xl shadow-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-lg text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-white">
            <span>📍 San Pablo City, Laguna</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Authentic Delicacies, <br className="hidden sm:inline" />
            Direct from Local Makers
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Fresh hot buko pie, traditional espasol, and artisanal Laguna coffee prepared by verified merchants across the 7 Lakes City.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
            <Link
              href="/products"
              className="px-6 py-2.5 rounded-xl bg-white text-primary text-xs font-black shadow-md hover:bg-white/90 transition-all active:scale-95"
            >
              Order Delicacies Now →
            </Link>
            {!user && (
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white text-xs font-bold transition-all"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>

        {/* Hero Visual Icons */}
        <div className="flex items-center justify-center gap-3 text-5xl sm:text-6xl select-none">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md animate-bounce duration-1000">
            🥧
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md animate-pulse">
            🥥
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md">
            ☕
          </div>
        </div>
      </div>

      {/* Horizontal Food Categories Carousel (Foodpanda style) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-foreground">
            Browse by Category
          </h2>
          <Link href="/products" className="text-xs font-bold text-primary hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {displayCategories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.id ? `/products?category=${cat.id}` : "/products"}
              className="p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between active:scale-[0.98]"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Delicacies Section */}
      {recentProducts.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-sm sm:text-base font-black text-foreground">
                Popular Local Delicacies
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Prepared by verified San Pablo producers
              </p>
            </div>
            <Link href="/products" className="text-xs font-bold text-primary hover:underline">
              See Menu ({featuredProducts?.length ?? 0}) →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {recentProducts.map((product) => {
              const inStock = product.stock > 0;

              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between group active:scale-[0.99]"
                >
                  <Link href={`/products/${product.id}`} className="block relative overflow-hidden bg-muted/30">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-32 sm:h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-32 sm:h-40 w-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
                        <span className="text-3xl">🥧</span>
                        <span className="text-[10px]">No image</span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold shadow-sm backdrop-blur-md ${
                          inStock
                            ? "bg-emerald-600/90 text-white"
                            : "bg-red-600/90 text-white"
                        }`}
                      >
                        {inStock ? `${product.stock} left` : "Sold Out"}
                      </span>
                    </div>
                  </Link>

                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-primary block truncate">
                        🏪 {product.sellers?.store_name ?? "San Pablo Seller"}
                      </span>
                      <Link href={`/products/${product.id}`} className="block">
                        <h3 className="font-extrabold text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="pt-1.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-sm font-black text-foreground">
                        ₱{Number(product.price).toFixed(2)}
                      </span>
                      <AddToCartButton
                        productId={product.id}
                        name={product.name}
                        price={Number(product.price)}
                        stock={product.stock}
                        sellerId={product.seller_id}
                        sellerName={product.sellers?.store_name ?? "Local Seller"}
                        imageUrl={product.image_url}
                        size="sm"
                        userRole={user?.role}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PWA Trust & Value Badges */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="flex items-center sm:flex-col gap-3 sm:gap-1 text-left sm:text-center">
          <span className="text-2xl">🏪</span>
          <div>
            <h4 className="text-xs font-bold text-foreground">Local Food Artisans</h4>
            <p className="text-[11px] text-muted-foreground">Admin-approved San Pablo makers</p>
          </div>
        </div>
        <div className="flex items-center sm:flex-col gap-3 sm:gap-1 text-left sm:text-center">
          <span className="text-2xl">🛵</span>
          <div>
            <h4 className="text-xs font-bold text-foreground">Flat ₱50 Local Fee</h4>
            <p className="text-[11px] text-muted-foreground">Simple flat fee per seller order</p>
          </div>
        </div>
        <div className="flex items-center sm:flex-col gap-3 sm:gap-1 text-left sm:text-center">
          <span className="text-2xl">💳</span>
          <div>
            <h4 className="text-xs font-bold text-foreground">MockPay & COD</h4>
            <p className="text-[11px] text-muted-foreground">Simulated card or cash on delivery</p>
          </div>
        </div>
      </div>
    </main>
  );
}
