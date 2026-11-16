import {
  getApprovedCategories,
  getApprovedStores,
  StoreListItem,
} from "@/modules/catalog/queries";
import Link from "next/link";
import {
  Search,
  Bike,
  MapPin,
  UtensilsCrossed,
  X,
  BadgeCheck,
  Clock,
} from "lucide-react";

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

/** Hero image area: single photo symbolizing the store. */
function StoreHero({ store }: { store: StoreListItem }) {
  const photo = store.sampleProducts.find((p) => p.image_url);

  return (
    <div className="relative aspect-[12/6] w-full overflow-hidden rounded-2xl bg-muted">
      <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]">
        {photo?.image_url ? (
          <img
            src={photo.image_url}
            alt={`${store.store_name} - ${photo.name}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-primary/15 via-accent/30 to-primary/5 p-4 text-center">
            <span className="text-5xl">
              {getCategoryIcon(store.categories[0]?.name ?? "")}
            </span>
            <span className="text-xs font-bold text-foreground/85 line-clamp-1">
              {store.store_name}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">
              San Pablo Maker
            </span>
          </div>
        )}
      </div>

      {/* Verified badge (bottom-right) */}
      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm shadow-sm">
        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Verified
      </span>
    </div>
  );
}

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

  const chipBase =
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition active:scale-95";
  const chipIdle =
    "border-border bg-card text-foreground hover:bg-muted";
  const chipActive =
    "border-primary bg-primary/10 text-primary";

  return (
    <div className="mx-auto max-w-7xl lg:px-8 lg:py-6 mb-8">
      {/* Pink search header */}
      <section className="bg-primary px-4 pb-14 pt-4 sm:px-6 lg:rounded-3xl">
        <Link
          href={search ? `/search?from=delicacies&q=${encodeURIComponent(search)}` : "/search?from=delicacies"}
          className="group relative flex w-full cursor-pointer items-center"
        >
          <Search
            className="pointer-events-none absolute left-4 h-5 w-5 text-white/90"
            aria-hidden="true"
          />
          <div
            className="flex h-12 w-full items-center rounded-full bg-black/20 pl-12 pr-24 text-sm text-white/90 shadow-inner transition-colors group-hover:bg-black/25"
          >
            {search ? (
              <span className="truncate font-medium text-white">{search}</span>
            ) : (
              <span className="truncate text-white/85">
                Search for stores and delicacies
              </span>
            )}
          </div>
          <span
            className="absolute right-1.5 flex h-9 items-center justify-center rounded-full bg-white px-4 text-xs font-extrabold text-primary shadow-sm transition active:scale-95 group-hover:bg-white/90"
          >
            Search
          </span>
        </Link>

        <p className="mt-3 flex items-center gap-2 px-1 text-xs font-medium text-white/90">
          <Bike className="h-4 w-4 shrink-0" aria-hidden="true" />
          Flat ₱{DELIVERY_FEE} delivery fee per store, from verified San Pablo food makers
        </p>
      </section>

      {/* White sheet overlapping the header */}
      <section className="-mt-8 bg-background px-4 pb-8 pt-4 sm:px-6 lg:rounded-b-3xl">
        {/* Category chips (R4) */}
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
        <div className="mt-2 space-y-2.5">
          <div className="flex items-baseline justify-between gap-3">
            <h1 className="text-lg font-extrabold text-foreground sm:text-xl">
              {activeCategory ? `${activeCategory.name} Stores` : "Local Food Stores"}
            </h1>
            <span className="shrink-0 text-xs text-muted-foreground">
              {stores.length} {stores.length === 1 ? "store" : "stores"}
            </span>
          </div>

          {(search || activeCategory) && (
            <div className="flex flex-wrap items-center gap-2">
              {search && (
                <Link
                  href={clearSearchHref}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                >
                  <span className="max-w-[180px] truncate">&ldquo;{search}&rdquo;</span>
                  <X className="h-3.5 w-3.5" aria-label="Clear search" />
                </Link>
              )}
              {activeCategory && (
                <Link
                  href={allHref}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                >
                  <span>{activeCategory.name}</span>
                  <X className="h-3.5 w-3.5" aria-label="Clear category" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Store cards */}
        <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
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

            const showMatch =
              !!search && store.matchingFoodNames.length > 0 && !store.matchedByStoreName;

            return (
              <Link
                key={store.id}
                href={storeHref}
                className="group block space-y-2.5 active:scale-[0.99] transition-transform"
              >
                <StoreHero store={store} />

                {/* Name + item count (item count sits where the rating sits) */}
                <div className="flex items-start justify-between gap-3 px-0.5">
                  <h2 className="min-w-0 text-base font-extrabold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
                    <span className="line-clamp-2">{store.store_name}</span>
                  </h2>
                  <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-sm font-bold text-foreground">
                    <UtensilsCrossed className="h-4 w-4 text-primary" aria-hidden="true" />
                    {store.productCount}
                    <span className="font-medium text-muted-foreground">
                      {store.productCount === 1 ? "item" : "items"}
                    </span>
                  </span>
                </div>

                {/* Meta line: location and categories */}
                <p className="flex min-w-0 items-center gap-1.5 px-0.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden="true" />
                  <span className="truncate">
                    {store.location || "San Pablo City"}
                    {store.categories.length > 0 &&
                      ` • ${store.categories
                        .slice(0, 2)
                        .map((c) => c.name)
                        .join(", ")}${store.categories.length > 2 ? ` +${store.categories.length - 2}` : ""}`}
                  </span>
                </p>

                {/* Delivery line */}
                <p className="flex items-center gap-1.5 px-0.5 text-sm font-semibold text-foreground">
                  <Bike className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  ₱{DELIVERY_FEE}
                  <span className="mx-0.5 text-muted-foreground">•</span>
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  <span className="font-medium text-muted-foreground">Made fresh to order</span>
                </p>

                {/* Pink pills, like the promo pills in the reference */}
                <div className="flex flex-wrap gap-2 px-0.5">
                  {showMatch && (
                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">
                      <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{store.matchingFoodNames.join(", ")}</span>
                    </span>
                  )}
                  {store.sampleProducts.slice(0, showMatch ? 1 : 2).map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary"
                    >
                      {p.name}
                      <span className="font-bold text-primary/80">₱{p.price.toFixed(0)}</span>
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {stores.length === 0 && (
          <div className="mx-auto max-w-sm space-y-3 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
              🏪
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-foreground">
                No local stores found
              </h2>
              <p className="text-sm text-muted-foreground">
                Try another store or food keyword, or clear your filters to see all stores.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition active:scale-95 hover:bg-primary/90"
            >
              Clear filters
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}