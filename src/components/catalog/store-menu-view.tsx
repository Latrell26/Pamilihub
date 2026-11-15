"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { StoreDetail } from "@/modules/catalog/queries";
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

export function StoreMenuView({
  store,
  userRole,
  initialSearch = "",
  initialCategory,
}: {
  store: StoreDetail;
  userRole?: string | null;
  initialSearch?: string;
  initialCategory?: string;
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || "all");

  const isCustomer = userRole === "customer";
  const isGuest = !userRole;

  // Filter foods by name only (R6)
  const trimmedSearch = searchQuery.trim().toLowerCase();
  const filteredFoods = useMemo(() => {
    if (!trimmedSearch) return store.products;
    return store.products.filter((p) =>
      p.name.toLowerCase().includes(trimmedSearch)
    );
  }, [store.products, trimmedSearch]);

  // Group foods into sections by category
  const sections = useMemo(() => {
    return store.categories
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        items: filteredFoods.filter((f) => f.category_id === cat.id),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [store.categories, filteredFoods]);

  const showCategoryTabs = store.categories.length >= 2;

  // Scroll to initial category if specified on page load
  useEffect(() => {
    if (initialCategory && initialCategory !== "all") {
      const el = document.getElementById(`category-${initialCategory}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, [initialCategory]);

  // Scroll-spy observer to highlight active category while scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const catId = entry.target.getAttribute("data-category-id");
            if (catId) {
              setActiveCategory(catId);
            }
          }
        }
      },
      {
        rootMargin: "-120px 0px -65% 0px",
        threshold: 0,
      }
    );

    const elements = document.querySelectorAll("[data-category-id]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sections]);

  // Smooth in-page navigation without refreshing the page
  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    if (catId === "all") {
      const el = document.getElementById("menu-top");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      const el = document.getElementById(`category-${catId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const photos = store.products
    .filter((p) => p.image_url)
    .slice(0, 4)
    .map((p) => ({ id: p.id, name: p.name, url: p.image_url as string }));

  return (
    <div className="mx-auto max-w-5xl lg:px-8 lg:pt-6">
      {/* Photo header with top floating back button */}
      <div className="relative h-52 overflow-hidden sm:h-64 lg:rounded-t-3xl">
        <HeroCollage photos={photos} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
        <Link
          href="/products"
          aria-label="Back to all stores"
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-foreground shadow-md transition active:scale-90 hover:bg-white/90"
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

        {/* Target anchor for scrolling back to top of menu */}
        <div id="menu-top" className="scroll-mt-40" />

        {/*
          STICKY HEADER:
          - Top Row: Back button (on the left) + Search bar (on the right)
          - Bottom Row: Categories selector (down of back button and search bar)
          - Sticks to top-0 when user scrolls!
        */}
        <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-background/95 backdrop-blur-md border-b border-border shadow-xs transition-all mt-6">
          {/* Top Row: Back button on the left + Search bar */}
          <div className="flex items-center gap-2.5 pt-3 pb-2">
            <Link
              href="/products"
              aria-label="Back to all stores"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm hover:bg-muted active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu"
                aria-label="Search menu"
                maxLength={80}
                className="h-10 w-full rounded-full bg-muted pl-10 pr-9 text-xs sm:text-sm text-foreground shadow-inner placeholder:text-muted-foreground transition-colors focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Categories selector (down of back button and search bar) */}
          {showCategoryTabs && (
            <nav
              aria-label="Store menu categories"
              className="border-t border-border/50 py-1"
            >
              <ul className="no-scrollbar flex gap-5 overflow-x-auto py-1">
                <li className="shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("all")}
                    aria-current={activeCategory === "all" ? "page" : undefined}
                    className={`block border-b-[3px] pb-1.5 text-sm font-extrabold transition-colors cursor-pointer ${
                      activeCategory === "all"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All items
                  </button>
                </li>
                {store.categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <li key={cat.id} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(cat.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={`block border-b-[3px] pb-1.5 text-sm font-extrabold transition-colors cursor-pointer ${
                          isActive
                            ? "border-primary text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>

        {/* Active filter summary if searching */}
        {trimmedSearch && (
          <div className="mt-4 flex items-center justify-between gap-2 px-1">
            <span className="text-xs text-muted-foreground">
              {filteredFoods.length} {filteredFoods.length === 1 ? "delicacy" : "delicacies"} matching &ldquo;{searchQuery}&rdquo;
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Menu sections with Foodpanda-style divisors and in-page anchor IDs */}
        <div className="mt-4">
          {sections.map((section, idx) => (
            <div key={section.id}>
              {/* Foodpanda thick divisor between categories */}
              {idx > 0 && (
                <div className="my-8 -mx-4 sm:-mx-6 h-2.5 bg-muted/60 border-y border-border/40" />
              )}

              <section
                id={`category-${section.id}`}
                data-category-id={section.id}
                aria-label={section.name}
                className="pt-3 scroll-mt-32"
              >
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
                                userRole={userRole}
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
        {filteredFoods.length === 0 && (
          <div className="mx-auto max-w-sm space-y-3 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
              🍲
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-foreground">No delicacies found</h2>
              <p className="text-sm text-muted-foreground">
                No menu items match &ldquo;{searchQuery}&rdquo;. Try another keyword or clear the search.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition active:scale-95 hover:bg-primary/90"
            >
              Show all items
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
