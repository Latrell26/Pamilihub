import {
  getApprovedCategories,
  getApprovedStores,
  StoreListItem,
} from "@/modules/catalog/queries";
import Link from "next/link";
import { Search, Bike, MapPin, Store, UtensilsCrossed, X, ChevronRight } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  pies: "🥧",
  pastries: "🥐",
  kakanin: "🥥",
  coffee: "☕",
  snacks: "🍪",
  delicacies: "🍡",
  sweets: "🍬",
};

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "🍲";
}

const DELIVERY_FEE = 50;

export default async function StoresCatalogPage({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | string[] | undefined };
}>) {
  // R10: Safely handle query parameters and ignore unknown/invalid params
  const rawCategory =
    typeof searchParams.category === "string" ? searchParams.category.trim() : undefined;
  const categoryId = rawCategory && rawCategory.length > 0 ? rawCategory : undefined;

  // R2: Blank or whitespace-only search = no search. Max 80 chars after trim.
  const rawSearch =
    typeof searchParams.search === "string" ? searchParams.search.trim().slice(0, 80) : undefined;
  const search = rawSearch && rawSearch.length > 0 ? rawSearch : undefined;

  const [categoriesData, stores] = await Promise.all([
    getApprovedCategories(),
    getApprovedStores({ categoryId, search }),
  ]);

  // R4: "All" plus only categories that have at least one food in an approved store
  // (computed ignoring active filters). An active category from the URL stays visible
  // even if it has no stores.
  const approvedCatSet = new Set(categoriesData.approvedCategoryIds);
  const visibleCategories = categoriesData.allCategories.filter(
    (c) => approvedCatSet.has(c.id) || (categoryId && c.id === categoryId)
  );
  const activeCategory = categoriesData.allCategories.find((c) => c.id === categoryId);

  const allHref = search
    ? `/products?search=${encodeURIComponent(search)}`
    : "/products";
  const clearSearchHref = categoryId
    ? `/products?category=${encodeURIComponent(categoryId)}`
    : "/products";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Search Header */}
      <form method="GET" className="relative flex items-center">
        <Search
          className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <input
          name="search"
          defaultValue={search ?? ""}
          placeholder="Search stores or delicacies (e.g., Lola Mayas, buko pie, coffee)"
          aria-label="Search stores or delicacies"
          maxLength={80}
          className="w-full h-12 rounded-full bg-muted pl-12 pr-24 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-colors"
        />
        {categoryId && <input type="hidden" name="category" value={categoryId} />}
        <button
          type="submit"
          className="absolute right-1.5 h-9 px-4 rounded-full bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 active:scale-95 transition"
        >
          Search
        </button>
      </form>

      {/* Delivery promo strip */}
      <div className="flex items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Bike className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold leading-tight">
            Flat ₱{DELIVERY_FEE} delivery fee per store
          </p>
          <p className="text-xs text-primary-foreground/85 leading-tight mt-0.5">
            Discover verified San Pablo food makers and explore their specialty menus
          </p>
        </div>
      </div>

      {/* Category tiles (R4) */}
      <nav aria-label="Delicacy Categories">
        <ul
          className="
            flex gap-4 overflow-x-auto no-scrollbar pt-1 pb-1
            -mx-4 px-4 sm:mx-0 sm:px-0
            snap-x snap-proximity scroll-px-4 touch-pan-x overscroll-x-contain
            lg:[&>li:first-child]:ml-auto lg:[&>li:last-child]:mr-auto
          "
        >
          <li className="shrink-0 snap-start">
            <Link
              href={allHref}
              aria-current={!categoryId ? "page" : undefined}
              className="group flex w-16 flex-col items-center gap-1.5"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl transition ${
                  !categoryId
                    ? "bg-primary/15 ring-1 ring-primary"
                    : "bg-muted group-hover:bg-primary/10"
                }`}
              >
                🍽️
              </span>
              <span
                className={`text-[11px] leading-tight text-center ${
                  !categoryId ? "font-extrabold text-primary" : "font-medium text-foreground"
                }`}
              >
                All
              </span>
            </Link>
          </li>

          {visibleCategories.map((c) => {
            const isActive = categoryId === c.id;
            return (
              <li key={c.id} className="shrink-0 snap-start">
                <Link
                  href={`/products?category=${encodeURIComponent(c.id)}${
                    search ? `&search=${encodeURIComponent(search)}` : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  className="group flex w-16 flex-col items-center gap-1.5"
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl transition ${
                      isActive
                        ? "bg-primary/15 ring-1 ring-primary"
                        : "bg-muted group-hover:bg-primary/10"
                    }`}
                  >
                    {getCategoryIcon(c.name)}
                  </span>
                  <span
                    className={`text-[11px] leading-tight text-center line-clamp-2 ${
                      isActive ? "font-extrabold text-primary" : "font-medium text-foreground"
                    }`}
                  >
                    {c.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Heading + active filter chips */}
      <div className="space-y-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-lg sm:text-xl font-extrabold text-foreground">
            {activeCategory ? `${activeCategory.name} Stores` : "Local Food Stores"}
          </h1>
          <span className="text-xs text-muted-foreground shrink-0">
            {stores.length} {stores.length === 1 ? "store" : "stores"}
          </span>
        </div>

        {(search || activeCategory) && (
          <div className="flex flex-wrap items-center gap-2">
            {search && (
              <Link
                href={clearSearchHref}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 pl-3 pr-2 py-1 text-xs font-semibold text-primary hover:bg-primary/15 transition-colors"
              >
                <span className="truncate max-w-[180px]">&ldquo;{search}&rdquo;</span>
                <X className="h-3.5 w-3.5" aria-label="Clear search" />
              </Link>
            )}
            {activeCategory && (
              <Link
                href={allHref}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 pl-3 pr-2 py-1 text-xs font-semibold text-primary hover:bg-primary/15 transition-colors"
              >
                <span>{activeCategory.name}</span>
                <X className="h-3.5 w-3.5" aria-label="Clear category" />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Store Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stores.map((store: StoreListItem) => {
          // R3: Store card -> store page link:
          // ALWAYS carry `category` when set.
          // Carry `search` ONLY when the store matched through a food name (matches.length > 0).
          // A store that matched by its own name must open its FULL menu.
          const params = new URLSearchParams();
          if (categoryId) {
            params.set("category", categoryId);
          }
          if (search && !store.matchedByStoreName && store.matchingFoodNames.length > 0) {
            params.set("search", search);
          }
          const queryStr = params.toString();
          const storeHref = `/stores/${store.id}${queryStr ? `?${queryStr}` : ""}`;

          return (
            <Link
              key={store.id}
              href={storeHref}
              className="group block rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/50 hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Store className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h2 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors truncate">
                      {store.store_name}
                    </h2>
                    {store.location && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                        <span className="truncate">{store.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-extrabold text-primary">
                  ₱{DELIVERY_FEE} delivery
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2 mt-3 leading-relaxed">
                {store.description || "Freshly made local delicacies from San Pablo City."}
              </p>

              {/* Matching food badge if matched via food search */}
              {search && store.matchingFoodNames.length > 0 && !store.matchedByStoreName && (
                <div className="mt-3 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-[11px] text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1.5">
                  <span className="font-bold">Matching item:</span>
                  <span className="truncate">{store.matchingFoodNames.join(", ")}</span>
                </div>
              )}

              {/* Store sample delicacy previews */}
              {store.sampleProducts.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border/60">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
                    <span className="font-semibold flex items-center gap-1">
                      <UtensilsCrossed className="h-3.5 w-3.5 text-primary" />
                      Featured Menu
                    </span>
                    <span>{store.productCount} {store.productCount === 1 ? "delicacy" : "delicacies"}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {store.sampleProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="rounded-lg bg-muted/50 p-2 text-center flex flex-col items-center justify-center gap-1"
                      >
                        {prod.image_url ? (
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="h-10 w-full object-cover rounded"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-base">🥧</span>
                        )}
                        <span className="text-[10px] font-bold text-foreground line-clamp-1 w-full">
                          {prod.name}
                        </span>
                        <span className="text-[10px] font-semibold text-primary">
                          ₱{prod.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category pills + CTA */}
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5 min-w-0">
                  {store.categories.slice(0, 2).map((cat) => (
                    <span
                      key={cat.id}
                      className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground truncate"
                    >
                      {cat.name}
                    </span>
                  ))}
                  {store.categories.length > 2 && (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      +{store.categories.length - 2}
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform shrink-0">
                  View menu <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty State */}
      {stores.length === 0 && (
        <div className="mx-auto max-w-sm py-16 text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
            🏪
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-foreground">
              No local stores found
            </h2>
            <p className="text-sm text-muted-foreground">
              Try searching with another store or food keyword, or clear your filters to view all available stores.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90 active:scale-95 transition"
          >
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}
