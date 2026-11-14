import { getCategories, getProducts } from "@/modules/catalog/queries";
import Link from "next/link";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";

const CATEGORY_ICONS: Record<string, string> = {
  "pies": "🥧",
  "pastries": "🥐",
  "kakanin": "🥥",
  "coffee": "☕",
  "snacks": "🍪",
  "delicacies": "🍡",
  "sweets": "🍬",
};

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "🍲";
}

export default async function CatalogPage({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | string[] | undefined };
}>) {
  const categoryId = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categoryId, search }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
      {/* Search Input Bar (Food Delivery Search Header) */}
      <div className="relative">
        <form method="GET" className="relative flex items-center">
          <input
            name="search"
            defaultValue={search ?? ""}
            placeholder="Search buko pie, espasol, kakanin, coffee..."
            className="w-full rounded-2xl border border-border bg-card pl-11 pr-24 py-3 sm:py-3.5 text-xs sm:text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {categoryId && (
            <input type="hidden" name="category" value={categoryId} />
          )}
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground"
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
          <button
            type="submit"
            className="absolute right-2 px-3.5 py-1.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95"
          >
            Search
          </button>
        </form>
      </div>

      {/* Horizontal Swipeable Category Carousel (Foodpanda style) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
            Categories
          </h2>
          {categoryId && (
            <Link
              href={search ? `/products?search=${encodeURIComponent(search)}` : "/products"}
              className="text-xs font-bold text-primary hover:underline"
            >
              Reset Category
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-2 sm:mx-0">
          <Link
            href={search ? `/products?search=${encodeURIComponent(search)}` : "/products"}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold whitespace-nowrap shrink-0 transition-all active:scale-95 shadow-sm ${
              !categoryId
                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                : "border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            <span>🍽️</span>
            <span>All Delicacies</span>
          </Link>

          {categories?.map((c) => {
            const isActive = categoryId === c.id;
            const icon = getCategoryIcon(c.name);

            return (
              <Link
                key={c.id}
                href={`/products?category=${c.id}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold whitespace-nowrap shrink-0 transition-all active:scale-95 shadow-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                <span>{icon}</span>
                <span>{c.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Products Count & Status Bar */}
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground border-b border-border pb-3">
        <span>
          Showing <strong className="text-foreground">{products?.length ?? 0}</strong> local delicacy items
        </span>
        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          ● Verified San Pablo Sellers
        </span>
      </div>

      {/* Responsive Food Card Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {(products ?? []).map((product) => {
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
                    className="h-32 sm:h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-32 sm:h-44 w-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
                    <span className="text-3xl sm:text-4xl">🥧</span>
                    <span className="text-[10px]">No image</span>
                  </div>
                )}

                {/* Stock Tag on image */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold shadow-sm backdrop-blur-md ${
                      inStock
                        ? "bg-emerald-600/90 text-white"
                        : "bg-red-600/90 text-white"
                    }`}
                  >
                    {inStock ? `${product.stock} left` : "Out of stock"}
                  </span>
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold text-primary block truncate">
                    🏪 {product.sellers?.store_name ?? "San Pablo Seller"}
                  </span>

                  <Link href={`/products/${product.id}`} className="block">
                    <h3 className="font-extrabold text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-[11px] text-muted-foreground line-clamp-1 hidden sm:block">
                    {product.description || "Freshly made local food."}
                  </p>
                </div>

                {/* Price and Add button */}
                <div className="pt-1.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="leading-tight">
                    <span className="text-sm sm:text-base font-black text-foreground">
                      ₱{Number(product.price).toFixed(2)}
                    </span>
                  </div>

                  <AddToCartButton
                    productId={product.id}
                    name={product.name}
                    price={Number(product.price)}
                    stock={product.stock}
                    sellerId={product.seller_id}
                    sellerName={product.sellers?.store_name ?? "Local Seller"}
                    imageUrl={product.image_url}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {(products ?? []).length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center space-y-3 max-w-sm mx-auto">
          <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center text-2xl">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-foreground text-sm">No Delicacies Found</h3>
            <p className="text-xs text-muted-foreground">
              Try searching with another food keyword or clear your filters.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-block px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
          >
            Clear Filter
          </Link>
        </div>
      )}
    </div>
  );
}
