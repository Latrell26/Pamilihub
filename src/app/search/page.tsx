"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  X,
  Store,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { SearchPrediction } from "@/app/api/search/route";

const QUICK_SEARCHES = ["Buko Pie", "Espasol", "Kakanin", "Coffee", "Pastillas", "Ube"];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const storeId = searchParams.get("storeId") || searchParams.get("store") || "";
  const storeName = searchParams.get("storeName") || "";
  const fromParam = searchParams.get("from") || "";
  const isFromNav = fromParam === "nav";

  const [query, setQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState<"all" | "product" | "store">("all");
  const [predictions, setPredictions] = useState<SearchPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch predictions with debouncing
  useEffect(() => {
    const controller = new AbortController();
    const cleanQ = query.trim();

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const queryParams = new URLSearchParams();
        if (cleanQ) queryParams.set("q", cleanQ);
        if (storeId) queryParams.set("storeId", storeId);

        const res = await fetch(`/api/search?${queryParams.toString()}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setPredictions(data.results || []);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Prediction fetch failed", err);
        }
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, storeId]);

  // Filter predictions by selected pill (all / product / store)
  const filteredPredictions = predictions.filter((item) => {
    if (storeId) return item.type === "product";
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  return (
    <div className="mx-auto max-w-3xl min-h-screen bg-background pb-20">
      {/* Sticky Top Search Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-3">
          {!isFromNav && (
            <button
              type="button"
              onClick={() => {
                if (storeId) {
                  router.push(`/stores/${storeId}`);
                } else {
                  router.push("/products");
                }
              }}
              aria-label={storeId ? `Back to ${storeName || "store"}` : "Back to delicacies"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card text-foreground shadow-sm transition active:scale-90"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
            </button>
          )}

          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                storeName
                  ? `Search in ${storeName}...`
                  : storeId
                  ? "Search delicacies in this store..."
                  : "Search delicacies or food stores..."
              }
              aria-label="Search"
              maxLength={80}
              className="h-11 w-full rounded-full bg-muted/80 pl-10 pr-10 text-sm text-foreground shadow-inner placeholder:text-muted-foreground transition-colors focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills (only when searching globally across all stores and products) */}
        {!storeId && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 ${
                filterType === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-background hover:text-foreground"
              }`}
            >
              All Results
            </button>
            <button
              type="button"
              onClick={() => setFilterType("product")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 ${
                filterType === "product"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-background hover:text-foreground"
              }`}
            >
              Delicacies
            </button>
            <button
              type="button"
              onClick={() => setFilterType("store")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 ${
                filterType === "store"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-background hover:text-foreground"
              }`}
            >
              Food Stores
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="pt-4 space-y-4">
        {/* Quick Suggestion Chips if search query is empty */}
        {!query && (
          <div className="space-y-2.5 pb-2 px-4">
            <p className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-muted-background">
              {storeId ? `${storeName || "Store"} Specialties` : "Popular Delicacies"}
            </p>
            <div className="flex flex-wrap gap-2">
              {(storeId && predictions.length > 0
                ? predictions.slice(0, 6).map((p) => p.name)
                : QUICK_SEARCHES
              ).map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition active:scale-95 hover:border-primary/50 hover:bg-primary/5"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section Heading */}
        <div className="flex items-center justify-between px-4">
          <p className="text-sm font-bold uppercase tracking-wider text-muted-background">
            {query
              ? `Matches for "${query}" (${filteredPredictions.length})`
              : storeId
              ? `All Delicacies in ${storeName || "this store"}`
              : "Featured Stores & Delicacies"}
          </p>
          
        </div>

        {/* Predictions List */}
        {filteredPredictions.length > 0 ? (
          <div className=" rounded-3xl bg-card overflow-hidden shadow-sm px-2">
            {filteredPredictions.map((item) => {
              const isStore = item.type === "store";

              return (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.href}
                  className="group flex items-center gap-3.5 p-3.5 py-2 transition-colors hover:bg-muted/50 active:bg-muted"
                >
                  {/* Left Side: Image of it */}
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-muted/60 flex items-center justify-center shadow-sm">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover "
                      />
                    ) : isStore ? (
                      <Store className="h-6 w-6 text-primary" />
                    ) : (
                      <span className="text-2xl">🥧</span>
                    )}
                  </div>

                  {/* Right Side beside it: Name and details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-extrabold text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isStore
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {isStore ? "Store" : "Delicacy"}
                      </span>
                    </div>

                    
                  </div>

                </Link>
              );
            })}
          </div>
        ) : !loading ? (
          /* Empty Search State */
          <div className="py-16 px-4 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
              🔍
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                No matching results found
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                We couldn&#39;t find any stores or delicacies matching &ldquo;{query}&rdquo;.
                Try checking for typos or search for items like &ldquo;Buko Pie&rdquo; or &ldquo;Espasol&rdquo;.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <div className="animate-pulse text-sm text-muted-foreground">
            Opening search...
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
