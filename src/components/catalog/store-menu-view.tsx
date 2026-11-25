"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { StoreDetail } from "@/modules/catalog/queries";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { BinarySearchTree } from "@/lib/data-structures/binary-search-tree";
import {
  Store,
  MapPin,
  Bike,
  Search,
  X,
  ArrowLeft,
  BadgeCheck,
  LogIn,
  ArrowUpDown,
} from "lucide-react";

const DELIVERY_FEE = 50;

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
  fromSearch = false,
  searchQueryParam,
}: {
  store: StoreDetail;
  userRole?: string | null;
  initialSearch?: string;
  initialCategory?: string;
  fromSearch?: boolean;
  searchQueryParam?: string;
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || "all");
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const isCustomer = userRole === "customer";
  const isGuest = !userRole;

  // Persist current active store details for reference
  useEffect(() => {
    localStorage.setItem("pamilihub_active_store", store.id);
    localStorage.setItem("pamilihub_active_store_name", store.store_name);
  }, [store.id, store.store_name]);

  const [sortByPrice, setSortByPrice] = useState(false);

  // Filter foods by name only (R6)
  const trimmedSearch = searchQuery.trim().toLowerCase();
  const filteredFoods = useMemo(() => {
    let foods = store.products;
    if (trimmedSearch) {
      foods = foods.filter((p) =>
        p.name.toLowerCase().includes(trimmedSearch)
      );
    }

    // ── DSA: BinarySearchTree — sort menu items by price when the toggle is active.
    // Products are inserted into a BST keyed by price; in-order traversal yields
    // them in ascending price order (cheapest delicacy first). ──
    if (sortByPrice && foods.length > 0) {
      type FoodItem = StoreDetail["products"][number];
      const priceBST = new BinarySearchTree<number, FoodItem[]>((a, b) => a - b);
      for (const food of foods) {
        const price = Number(food.price);
        const bucket = priceBST.search(price);
        if (bucket) {
          bucket.push(food);
        } else {
          priceBST.insert(price, [food]);
        }
      }
      // In-order traversal gives products sorted by price (ascending)
      foods = priceBST.inOrder().flatMap((entry) => entry.value);
    }

    return foods;
  }, [store.products, trimmedSearch, sortByPrice]);

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

  // Detect when search bar reaches the top of the viewport
  useEffect(() => {
    const handleScroll = () => {
      if (sentinelRef.current) {
        const rect = sentinelRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 14);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="mx-auto max-w-5xl lg:px-8 lg:pt-6 relative">
      {/*
        The single, original fixed Back button.
        Stays fixed in top-left position over the hero image, and when the user scrolls down,
        it docks directly on the left side of the sticky search bar.
      */}
      <div className="fixed top-3 left-0 right-0 z-40 pointer-events-none">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href={
              fromSearch
                ? searchQueryParam
                  ? `/search?q=${encodeURIComponent(searchQueryParam)}`
                  : "/search"
                : "/products"
            }
            aria-label={fromSearch ? "Back to search" : "Back to all stores"}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md border border-border/40 backdrop-blur-sm transition active:scale-90 hover:bg-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Photo header (NO duplicate back button here) */}
      <div className="relative h-52 overflow-hidden sm:h-64 lg:rounded-t-3xl">
        <HeroCollage photos={photos} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
      </div>

      {/* Sheet with curved top, overlapping the photos */}
      <div className="relative -mt-6 rounded-t-[2rem] bg-background px-4 pb-6 pt-12 sm:px-6 lg:rounded-none">
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

        {/* Scroll sentinel to detect when search reaches the top */}
        <div ref={sentinelRef} className="h-0 w-full" />

        {/*
          STICKY HEADER:
          - Top Row: Space for the fixed Back button on the left (when sticky) + Search bar (with curve and top shadow)
          - Bottom Row: Categories selector (down of back button and search bar)
          - Sticks to top-0 when user scrolls!
        */}
        <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-background/95 backdrop-blur-md mt-6">
          {/* Top Row: Search bar with space for the fixed back button when sticky */}
          <div className="flex items-center gap-3 pt-3.5 pb-2 transition-all">
            {/* When sticky, leaves room for the fixed back button to sit seamlessly on the left */}
            {isSticky && (
              <div
                className="w-11 h-11 shrink-0 transition-all animate-in fade-in duration-200"
                aria-hidden="true"
              />
            )}

            <Link
              href={`/search?from=store&storeId=${store.id}&storeName=${encodeURIComponent(store.store_name)}`}
              className="group relative flex-1 flex items-center cursor-pointer"
              aria-label={`Search delicacies in ${store.store_name}`}
            >
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                aria-hidden="true"
              />
              <div className="h-11 w-full rounded-full bg-muted/80 pl-10 pr-10 text-sm text-muted-foreground flex items-center shadow-inner transition-colors group-hover:bg-muted group-hover:text-foreground">
                Search in {store.store_name}...
              </div>
            </Link>

            {/* DSA: BST price sort toggle */}
            <button
              type="button"
              onClick={() => setSortByPrice(!sortByPrice)}
              aria-label={sortByPrice ? "Sort by default order" : "Sort by price (cheapest first)"}
              title={sortByPrice ? "Sorted: cheapest first" : "Sort by price"}
              className={`flex h-11 items-center gap-1.5 px-3.5 rounded-full border text-xs font-extrabold transition-all active:scale-95 cursor-pointer shrink-0 ${
                sortByPrice
                  ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "border-border/60 bg-muted/80 text-foreground hover:bg-muted"
              }`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>{sortByPrice ? "Cheapest First" : "Sort Price"}</span>
            </button>
          </div>

          {/* Bottom Row: Categories selector (no line below search bar; bottom line aligns with tab underline) */}
          {showCategoryTabs && (
            <nav
              aria-label="Store menu categories"
              className="pt-0.5 pb-0"
            >
              <ul className="flex gap-6 overflow-x-auto border-b border-border py-0 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <li className="shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("all")}
                    aria-current={activeCategory === "all" ? "page" : undefined}
                    className={`block border-b-[3px] pb-2 text-sm font-extrabold transition-colors cursor-pointer -mb-px ${
                      activeCategory === "all"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-background "
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
                        className={`block border-b-[3px] pb-2 text-sm font-extrabold transition-colors cursor-pointer -mb-px ${
                          isActive
                            ? "border-primary text-foreground"
                            : "border-transparent text-muted-background"
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
                <div className="mb-3">
                  <h2 className="text-xl font-black tracking-tight text-foreground">
                    {section.name}
                  </h2>
                </div>

                <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                  {section.items.map((food) => {
                    return (
                      <li
                        key={food.id}
                        className="flex items-start justify-between gap-4 border-b border-border/70 py-4"
                      >
                        {/* Text */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <Link href={`/products/${food.id}`} className="block">
                            <h3
                              className="text-base font-extrabold leading-snug transition-colors hover:text-primary text-foreground"
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
                                className="h-full w-full object-cover"
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
