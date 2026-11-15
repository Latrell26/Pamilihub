import { notFound } from "next/navigation";
import Link from "next/link";
import { getStoreMenu } from "@/modules/catalog/queries";
import { getHeaderUser } from "@/lib/auth/header-user";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import {
  Store,
  MapPin,
  Bike,
  Search,
  X,
  ArrowLeft,
  BadgeCheck,
  LogIn,
} from "lucide-react";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const DELIVERY_FEE = 50;
const LOW_STOCK_THRESHOLD = 5;

/** Photo collage for the top of the page (up to 4 menu photos). */
function HeroCollage({ photos }: { photos: { id: string; name: string; url: string }[] }) {
  if (photos.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/25 via-accent to-primary/10 text-6xl">
        🥧
      </div>
    );
  }
  if (photos.length === 1) {
    return <img src={photos[0].url} alt={photos[0].name} className="h-full w-full object-cover" />;
  }
  if (photos.length === 2) {
    return (
      <div className="grid h-full w-full grid-cols-2 gap-0.5">
        {photos.map((p) => (
          <img key={p.id} src={p.url} alt={p.name} className="h-full w-full object-cover" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5">
      <img
        src={photos[0].url}
        alt={photos[0].name}
        className={`h-full w-full object-cover ${photos.length === 3 ? "row-span-2" : ""}`}
      />
      {photos.slice(1, 4).map((p) => (
        <img key={p.id} src={p.url} alt={p.name} className="h-full w-full object-cover" />
      ))}
    </div>
  );
}

export default async function StoreMenuPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const storeId = params?.id;

  // R5: /stores/[id] with a non-UUID id, unknown id, or non-approved store shows a real 404 via notFound().
  // No DB query when the id is not a UUID.
  if (!storeId || !UUID_REGEX.test(storeId)) {
    notFound();
  }

  // R10: Invalid or unknown query params never crash a page. Ignore them.
  const rawSearch =
    typeof searchParams.search === "string" ? searchParams.search.trim().slice(0, 80) : undefined;
  const search = rawSearch && rawSearch.length > 0 ? rawSearch : undefined;

  const rawCategory =
    typeof searchParams.category === "string" ? searchParams.category.trim() : undefined;
  const categoryId = rawCategory && rawCategory.length > 0 ? rawCategory : undefined;

  const [store, user] = await Promise.all([getStoreMenu(storeId), getHeaderUser()]);

  if (!store || store.status !== "approved") {
    notFound();
  }

  // R6: Store-page search filters foods by name only.
  // Category tabs list only categories present in that store and show only when there are 2 or more.
  const showCategoryTabs = store.categories.length >= 2;
  const activeCategory = store.categories.find((c) => c.id === categoryId);

  let foods = store.products;
  if (categoryId) {
    foods = foods.filter((p) => p.category_id === categoryId);
  }
  if (search) {
    const sLower = search.toLowerCase();
    foods = foods.filter((p) => p.name.toLowerCase().includes(sLower));
  }

  // Menu sections: one per category (like the reference), or one when a category is selected.
  const sections = categoryId
    ? [{ id: categoryId, name: activeCategory?.name ?? "Menu", items: foods }]
    : store.categories
        .map((c) => ({ id: c.id, name: c.name, items: foods.filter((f) => f.category_id === c.id) }))
        .filter((s) => s.items.length > 0);

  // R7: Guests: no Add to Cart; show ONE sign-in prompt on the store page (link /login).
  // Seller/admin: no cart UI and no prompt.
  const isCustomer = user?.role === "customer";
  const isGuest = !user;

  const allCategoryHref = search
    ? `/stores/${store.id}?search=${encodeURIComponent(search)}`
    : `/stores/${store.id}`;
  const clearSearchHref = categoryId
    ? `/stores/${store.id}?category=${encodeURIComponent(categoryId)}`
    : `/stores/${store.id}`;

  const photos = store.products
    .filter((p) => p.image_url)
    .slice(0, 4)
    .map((p) => ({ id: p.id, name: p.name, url: p.image_url as string }));

  return (
    <div className="mx-auto max-w-5xl lg:px-8 lg:pt-6">
      {/* Photo header */}
      <div className="relative h-52 overflow-hidden sm:h-64 lg:rounded-t-3xl">
        <HeroCollage photos={photos} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
        <Link
          href="/products"
          aria-label="Back to all stores"
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-foreground shadow-md transition active:scale-90"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      {/* Sheet with curved top, overlapping the photos */}
      <div className="relative -mt-6 rounded-t-[2rem] bg-background px-4 pb-12 pt-12 sm:px-6 lg:rounded-none">
        {/* Round logo: first menu photo, or a store icon */}
        <div className="absolute -top-9 left-1/2 flex h-[4.5rem] w-[4.5rem] -translate-x-1/2 items-center justify-center overflow-hidden rounded-2xl border-4 border-background bg-primary/10 text-primary shadow-md">
          {photos[0] ? (
            <img src={photos[0].url} alt="" className="h-full w-full object-cover" />
          ) : (
            <Store className="h-7 w-7" aria-hidden="true" />
          )}
        </div>

        {/* Name and info (centered) */}
        <header className="space-y-1.5 text-center">
          <h1 className="text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl">
            {store.store_name}
          </h1>
          <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span>{store.location || "San Pablo City, Laguna"}</span>
          </p>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-foreground/75">
            {store.description ||
              "Handcrafted authentic local delicacies proudly made in San Pablo City, Laguna."}
          </p>
          <p className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            Verified local maker
            <span className="text-muted-foreground">•</span>
            <span className="font-semibold text-muted-foreground">
              {store.products.length} {store.products.length === 1 ? "item" : "items"}
            </span>
          </p>
        </header>

        {/* Delivery card */}
        <section
          aria-label="Delivery info"
          className="mx-auto mt-5 max-w-xl rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-foreground">
              <Bike className="h-5 w-5 text-primary" aria-hidden="true" />
              Delivery
            </h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">
              ₱{DELIVERY_FEE} flat fee
            </span>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            This store delivers its own order. Pay with MockPay or cash on delivery.
          </p>
        </section>

        {/* R7: ONE sign-in prompt for Guests (link /login), ticket-style card */}
        {isGuest && (
          <section
            aria-label="Sign in to order"
            className="mx-auto mt-3 max-w-xl overflow-hidden rounded-2xl border border-primary/25 bg-primary/5"
          >
            <div className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <LogIn className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="min-w-0 flex-1 text-sm font-extrabold text-foreground">
                Sign in to order from {store.store_name}
              </p>
              <Link
                href="/login"
                className="inline-flex h-9 shrink-0 items-center rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm transition active:scale-95 hover:bg-primary/90"
              >
                Sign in
              </Link>
            </div>
            <p className="border-t border-dashed border-primary/30 px-4 py-2 text-xs text-muted-foreground">
              Customers can add items to the cart and check out.
            </p>
          </section>
        )}

        {/* Menu search (R6: filters foods by name only) */}
        <form method="GET" className="relative mt-6 flex items-center">
          <Search
            className="pointer-events-none absolute left-4 h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            name="search"
            defaultValue={search ?? ""}
            placeholder="Search menu"
            aria-label="Search menu"
            maxLength={80}
            className="h-12 w-full rounded-full bg-muted pl-12 pr-24 text-sm text-foreground shadow-inner placeholder:text-muted-foreground transition-colors focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {categoryId && <input type="hidden" name="category" value={categoryId} />}
          <button
            type="submit"
            className="absolute right-1.5 h-9 rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground transition active:scale-95 hover:bg-primary/90"
          >
            Search
          </button>
        </form>

        {/* R6: Sticky Category tabs with top-0 stickiness */}
        {showCategoryTabs && (
          <nav
            aria-label="Store menu categories"
            className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-background/95 backdrop-blur-md border-b border-border py-2 mt-4 transition-all"
          >
            <ul className="no-scrollbar flex gap-6 overflow-x-auto py-0.5">
              <li className="shrink-0">
                <Link
                  href={allCategoryHref}
                  aria-current={!categoryId ? "page" : undefined}
                  className={`block border-b-[3px] pb-2 text-sm font-extrabold transition-colors ${
                    !categoryId
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All items
                </Link>
              </li>
              {store.categories.map((cat) => {
                const isActive = categoryId === cat.id;
                const catHref = `/stores/${store.id}?category=${encodeURIComponent(cat.id)}${
                  search ? `&search=${encodeURIComponent(search)}` : ""
                }`;
                return (
                  <li key={cat.id} className="shrink-0">
                    <Link
                      href={catHref}
                      aria-current={isActive ? "page" : undefined}
                      className={`block border-b-[3px] pb-2 text-sm font-extrabold transition-colors ${
                        isActive
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Active filter chips */}
        {(search || activeCategory) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {foods.length} {foods.length === 1 ? "item" : "items"} found
            </span>
            {search && (
              <Link
                href={clearSearchHref}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <span>&ldquo;{search}&rdquo;</span>
                <X className="h-3.5 w-3.5" aria-label="Clear search" />
              </Link>
            )}
            {activeCategory && (
              <Link
                href={allCategoryHref}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <span>{activeCategory.name}</span>
                <X className="h-3.5 w-3.5" aria-label="Clear category" />
              </Link>
            )}
          </div>
        )}

        {/* Menu sections with Foodpanda-style divisors */}
        <div className="mt-2">
          {sections.map((section, idx) => (
            <div key={section.id}>
              {/* Foodpanda thick divisor between categories */}
              {idx > 0 && (
                <div className="my-8 -mx-4 sm:-mx-6 h-2.5 bg-muted/60 border-y border-border/40" />
              )}

              <section aria-label={section.name} className="pt-4">
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="text-xl font-black tracking-tight text-foreground">
                    {section.name}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {section.items.length} {section.items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                  {section.items.map((food) => {
                    const inStock = food.stock > 0;
                    const lowStock = inStock && food.stock <= LOW_STOCK_THRESHOLD;

                    return (
                      <li
                        key={food.id}
                        className="flex items-start justify-between gap-4 border-b border-border/70 py-4"
                      >
                        {/* Text */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <Link href={`/products/${food.id}`} className="block">
                            <h3
                              className={`text-base font-extrabold leading-snug transition-colors hover:text-primary ${
                                inStock ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {food.name}
                            </h3>
                          </Link>
                          <p className="text-base font-bold text-foreground">
                            ₱{Number(food.price).toFixed(2)}
                          </p>
                          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {food.description || "Authentic freshly prepared local delicacy."}
                          </p>
                          {!inStock ? (
                            <p className="text-xs font-extrabold text-muted-foreground">Sold out</p>
                          ) : lowStock ? (
                            <p className="text-xs font-extrabold text-amber-600">
                              Only {food.stock} left
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">{food.stock} in stock</p>
                          )}
                        </div>

                        {/* Photo with round + button */}
                        <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                          <Link
                            href={`/products/${food.id}`}
                            aria-label={`View ${food.name}`}
                            className="block h-full w-full overflow-hidden rounded-2xl bg-muted"
                          >
                            {food.image_url ? (
                              <img
                                src={food.image_url}
                                alt={food.name}
                                loading="lazy"
                                className={`h-full w-full object-cover ${
                                  inStock ? "" : "opacity-60 grayscale"
                                }`}
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-4xl">
                                🥥
                              </span>
                            )}
                          </Link>

                          {/* R7: Only Customer gets the add button. Guests, sellers, admins get none. */}
                          {isCustomer && (
                            <div className="absolute bottom-2 right-2">
                              <AddToCartButton
                                productId={food.id}
                                name={food.name}
                                price={Number(food.price)}
                                stock={food.stock}
                                sellerId={store.id}
                                sellerName={store.store_name}
                                imageUrl={food.image_url}
                                variant="fab"
                                userRole={user?.role}
                              />
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
          ))}
        </div>

        {/* Empty menu state */}
        {foods.length === 0 && (
          <div className="mx-auto max-w-sm space-y-3 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
              🍲
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-foreground">No menu items found</h2>
              <p className="text-sm text-muted-foreground">
                Nothing in this store matches your filter. Clear the search or pick all items.
              </p>
            </div>
            <Link
              href={`/stores/${store.id}`}
              className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition active:scale-95 hover:bg-primary/90"
            >
              Show full menu
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
