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
  UtensilsCrossed,
  LogIn,
} from "lucide-react";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const DELIVERY_FEE = 50;
const LOW_STOCK_THRESHOLD = 5;

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

  const [store, user] = await Promise.all([
    getStoreMenu(storeId),
    getHeaderUser(),
  ]);

  if (!store || store.status !== "approved") {
    notFound();
  }

  // R6: Store-page search filters foods by name only.
  // Category chips list only categories present in that store and show only when there are 2 or more.
  const showCategoryChips = store.categories.length >= 2;
  const activeCategory = store.categories.find((c) => c.id === categoryId);

  let foods = store.products;
  if (categoryId) {
    foods = foods.filter((p) => p.category_id === categoryId);
  }
  if (search) {
    const sLower = search.toLowerCase();
    foods = foods.filter((p) => p.name.toLowerCase().includes(sLower));
  }

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Top Bar: Back to all stores */}
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-bold text-foreground hover:bg-muted transition-colors active:scale-95"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Stores</span>
        </Link>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          San Pablo Merchant
        </span>
      </div>

      {/* Store Header Banner Card */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl shrink-0">
              <Store className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden="true" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {store.store_name}
                </h1>
                <span className="rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold">
                  Verified Local Maker
                </span>
              </div>

              {store.location && (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{store.location}</span>
                </p>
              )}

              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pt-1">
                {store.description ||
                  "Handcrafted authentic local delicacies proudly made in San Pablo City, Laguna."}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground shadow-sm">
              <Bike className="h-3.5 w-3.5" />
              ₱{DELIVERY_FEE} Delivery
            </span>
            <span className="text-xs text-muted-foreground">
              {store.products.length} {store.products.length === 1 ? "delicacy" : "delicacies"}
            </span>
          </div>
        </div>
      </div>

      {/* R7: ONE sign-in prompt for Guests (link /login) */}
      {isGuest && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <LogIn className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-extrabold text-foreground">
                Sign in to order from {store.store_name}
              </p>
              <p className="text-xs text-muted-foreground">
                Log in with your customer account to add delicacies to your cart and checkout with MockPay or Cash on Delivery.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-xs font-bold text-primary-foreground hover:bg-primary/90 active:scale-95 transition shadow-sm"
          >
            Sign in
          </Link>
        </div>
      )}

      {/* Store Search Input (filters foods by name only per R6) */}
      <form method="GET" className="relative flex items-center">
        <Search
          className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <input
          name="search"
          defaultValue={search ?? ""}
          placeholder={`Search ${store.store_name}'s menu by food name...`}
          aria-label="Search menu"
          maxLength={80}
          className="w-full h-11 rounded-full bg-muted pl-11 pr-24 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-colors"
        />
        {categoryId && <input type="hidden" name="category" value={categoryId} />}
        <button
          type="submit"
          className="absolute right-1.5 h-8 px-3.5 rounded-full bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 active:scale-95 transition"
        >
          Search
        </button>
      </form>

      {/* R6: Category chips list only categories present in that store and show only when there are 2 or more */}
      {showCategoryChips && (
        <nav aria-label="Store menu categories" className="pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={allCategoryHref}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                !categoryId
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-foreground hover:bg-primary/10"
              }`}
            >
              All Items
            </Link>

            {store.categories.map((cat) => {
              const isActive = categoryId === cat.id;
              const catHref = `/stores/${store.id}?category=${encodeURIComponent(cat.id)}${
                search ? `&search=${encodeURIComponent(search)}` : ""
              }`;
              return (
                <Link
                  key={cat.id}
                  href={catHref}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-foreground hover:bg-primary/10"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Active filters heading + clear chips */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1 border-t border-border/40">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4 text-primary" />
          <h2 className="text-base sm:text-lg font-extrabold text-foreground">
            {activeCategory ? activeCategory.name : "Store Menu"}
          </h2>
          <span className="text-xs text-muted-foreground">
            ({foods.length} {foods.length === 1 ? "item" : "items"})
          </span>
        </div>

        {(search || activeCategory) && (
          <div className="flex flex-wrap items-center gap-2">
            {search && (
              <Link
                href={clearSearchHref}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 pl-3 pr-2 py-1 text-xs font-semibold text-primary hover:bg-primary/15 transition-colors"
              >
                <span>&ldquo;{search}&rdquo;</span>
                <X className="h-3.5 w-3.5" aria-label="Clear search" />
              </Link>
            )}
            {activeCategory && (
              <Link
                href={allCategoryHref}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 pl-3 pr-2 py-1 text-xs font-semibold text-primary hover:bg-primary/15 transition-colors"
              >
                <span>{activeCategory.name}</span>
                <X className="h-3.5 w-3.5" aria-label="Clear category" />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {foods.map((food) => {
          const inStock = food.stock > 0;
          const lowStock = inStock && food.stock <= LOW_STOCK_THRESHOLD;

          return (
            <article
              key={food.id}
              className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Food Image */}
                <div className="relative overflow-hidden bg-muted aspect-16/10">
                  <Link
                    href={`/products/${food.id}`}
                    className="block h-full w-full"
                    aria-label={`View ${food.name}`}
                  >
                    {food.image_url ? (
                      <img
                        src={food.image_url}
                        alt={food.name}
                        loading="lazy"
                        className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                          inStock ? "" : "grayscale opacity-70"
                        }`}
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
                        <span className="text-4xl">🥥</span>
                        <span className="text-[10px]">No photo</span>
                      </div>
                    )}
                  </Link>

                  {/* Stock tag */}
                  <div className="absolute top-2.5 right-2.5">
                    {!inStock ? (
                      <span className="rounded-full bg-foreground/90 px-2.5 py-0.5 text-[10px] font-bold text-background shadow">
                        Sold Out
                      </span>
                    ) : lowStock ? (
                      <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-950 shadow">
                        Only {food.stock} left
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-600/90 text-white px-2 py-0.5 text-[10px] font-bold shadow">
                        {food.stock} in stock
                      </span>
                    )}
                  </div>

                  {food.category_name && (
                    <span className="absolute bottom-2.5 left-2.5 rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-white">
                      {food.category_name}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-3.5 space-y-1.5">
                  <Link href={`/products/${food.id}`} className="block">
                    <h3 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {food.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {food.description || "Authentic freshly prepared local delicacy."}
                  </p>
                </div>
              </div>

              {/* Price & Action Section */}
              <div className="p-3.5 pt-0 space-y-2">
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-base font-black text-foreground">
                    ₱{Number(food.price).toFixed(2)}
                  </span>
                  <Link
                    href={`/products/${food.id}`}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Details →
                  </Link>
                </div>

                {/* R7: Only Customer gets AddToCartButton. Guests and Seller/Admin get no cart button. */}
                {isCustomer && (
                  <AddToCartButton
                    productId={food.id}
                    name={food.name}
                    price={Number(food.price)}
                    stock={food.stock}
                    sellerId={store.id}
                    sellerName={store.store_name}
                    imageUrl={food.image_url}
                    size="sm"
                    userRole={user?.role}
                  />
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Empty Menu State */}
      {foods.length === 0 && (
        <div className="mx-auto max-w-sm py-16 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
            🍲
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-foreground">
              No menu items found
            </h3>
            <p className="text-xs text-muted-foreground">
              No delicacies match your filter in this store. Try clearing search or selecting all items.
            </p>
          </div>
          <Link
            href={`/stores/${store.id}`}
            className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground hover:bg-primary/90 active:scale-95 transition"
          >
            Reset store menu
          </Link>
        </div>
      )}
    </div>
  );
}
