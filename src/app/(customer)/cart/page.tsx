"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Minus,
  MoreHorizontal,
  Plus,
  RotateCcw,
  ShoppingBag,
  Store,
  Trash2,
  X,
} from "lucide-react";
import CartLoading from "./loading";

const DELIVERY_FEE = 50;
const MAX_THUMBS = 4;
const REORDER_SESSION_KEY = "pamilihub_reorder";

type CartLine = ReturnType<typeof useCart>["items"][number];
type SellerGroup = { name: string; items: CartLine[] };

const peso = (n: number) => `₱${n.toFixed(2)}`;
const sumQty = (lines: CartLine[]) => lines.reduce((a, i) => a + i.quantity, 0);
const sumPrice = (lines: CartLine[]) =>
  lines.reduce((a, i) => a + i.price * i.quantity, 0);

/* ─── Re-order standalone cart ──────────────────────────────────────────── */

function ReorderCartView() {
  const router = useRouter();
  const [items, setItems] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(REORDER_SESSION_KEY);
      const parsed = raw ? (JSON.parse(raw) as CartLine[]) : [];
      if (!raw || parsed.length === 0) {
        // Nothing to re-order — session was cleared or never set.
        // Redirect straight to orders so the user doesn't see an error screen.
        router.replace("/orders");
        return;
      }
      setItems(parsed);
    } catch {
      router.replace("/orders");
      return;
    }
    setLoaded(true);
  }, [router]);

  function updateQty(productId: string, qty: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i
      )
    );
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function proceedToCheckout() {
    sessionStorage.setItem(REORDER_SESSION_KEY, JSON.stringify(items));
    router.push("/checkout?reorder=1");
  }

  function handleBack() {
    sessionStorage.removeItem(REORDER_SESSION_KEY);
    router.back();
  }

  const subtotal = sumPrice(items);
  const qty = sumQty(items);
  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);
  const sellerName = items[0]?.sellerName ?? "Merchant";

  if (!loaded) {
    return <CartLoading />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
          🛍️
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Re-order is empty
        </h1>
        <p className="text-xs text-muted-foreground">
          All items were removed.
        </p>
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-md transition active:scale-95 hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl pb-80">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60">
        <div className="mx-auto max-w-3xl flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card text-foreground shadow-sm transition active:scale-90 hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black leading-tight text-foreground truncate">
                Re-order
              </h1>
            </div>
            <p className="text-xs text-muted-foreground truncate">{sellerName}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-4 space-y-3 px-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-14 w-14 shrink-0 rounded-full border border-border/60 object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted text-xl shadow-sm">
                🥧
              </div>
            )}
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <p className="text-sm font-bold leading-tight text-foreground line-clamp-2">
                {item.name}
              </p>
              <p className="text-xs font-semibold text-primary">
                {peso(item.price)} each
              </p>
              {/* Qty controls */}
              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQty(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition active:scale-90 disabled:opacity-40"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center text-sm font-extrabold text-foreground">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQty(item.productId, item.quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition active:scale-90"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <span className="ml-auto text-sm font-extrabold text-foreground">
                  {peso(item.price * item.quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  aria-label="Remove"
                  className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:text-destructive active:scale-90"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bill summary + CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-3xl space-y-3 bg-background/95 px-4 pb-6 pt-3 backdrop-blur-md">
        <section className="space-y-2.5 rounded-[2rem] border border-border/60 bg-card p-5 text-sm shadow-sm">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Bill summary
          </h2>
          <div className="flex justify-between text-muted-foreground">
            <span>
              Items total ({qty} item{qty !== 1 ? "s" : ""})
            </span>
            <span className="font-bold text-foreground">{peso(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery fee</span>
            <span className="font-bold text-foreground">
              {peso(DELIVERY_FEE)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-extrabold text-foreground">Total payable</span>
            <span className="text-lg font-black text-foreground">
              {peso(total)}
            </span>
          </div>
        </section>

        <button
          type="button"
          onClick={proceedToCheckout}
          className="flex w-full items-center justify-between rounded-full bg-primary px-6 py-4 text-primary-foreground shadow-lg shadow-primary/25 transition active:scale-[0.99] hover:bg-primary/90"
        >
          <span className="text-sm font-black">Proceed to checkout</span>
          <span className="flex items-center gap-2 text-base font-black">
            {peso(total)}
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </div>
    </div>
  );
}

function RoundBackButton({
  onClick,
  label,
  icon = "arrow",
}: {
  onClick: () => void;
  label: string;
  icon?: "arrow" | "x";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card text-foreground shadow-sm transition active:scale-90"
    >
      {icon === "x" ? (
        <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
      ) : (
        <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
      )}
    </button>
  );
}

function Thumb({ item }: { item: CartLine }) {
  return item.imageUrl ? (
    <img
      src={item.imageUrl}
      alt={item.name}
      className="h-14 w-14 shrink-0 rounded-full border border-border/60 object-cover shadow-sm"
    />
  ) : (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted text-xl shadow-sm">
      🥧
    </div>
  );
}

function UndoBanner({
  name,
  onUndo,
  onDismiss,
}: {
  name: string | null;
  onUndo: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-primary/10 px-4 py-2.5 text-xs text-foreground shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-center gap-2 min-w-0">
        <span className="truncate">
          Removed <strong className="text-foreground">{name ? `"${name}"` : "item"}</strong> from cart
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onUndo}
          className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground shadow-sm transition active:scale-95 hover:bg-primary/90"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Undo
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss undo"
          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition active:scale-90"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function CartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStore = searchParams.get("store");
  const isReorder = searchParams.get("reorder") === "1" || searchParams.has("reorder");
  const isMerge = searchParams.get("merge") === "1";

  const { items, itemCount, addItem, removeItem, updateQuantity, isLoaded, canUndo, undoRemove, dismissUndo, lastRemovedName } = useCart();

  // ALL hooks must be declared before any conditional return ↓

  const itemsBySeller = useMemo(() => {
    const map = new Map<string, SellerGroup>();
    for (const item of items) {
      if (!map.has(item.sellerId)) {
        map.set(item.sellerId, { name: item.sellerName, items: [] });
      }
      map.get(item.sellerId)!.items.push(item);
    }
    return map;
  }, [items]);

  // null = "All carts" overview, otherwise the single store's cart
  const [selectedStore, setSelectedStore] = useState<string | null>(initialStore);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  // Handle merge: pull pending re-order items into main cart then clear
  useEffect(() => {
    if (!isMerge) return;
    try {
      const raw = sessionStorage.getItem(REORDER_SESSION_KEY + "_merge");
      if (raw) {
        const pending = JSON.parse(raw) as CartLine[];
        for (const item of pending) addItem(item);
        sessionStorage.removeItem(REORDER_SESSION_KEY + "_merge");
      }
    } catch { /* ignore */ }
    router.replace("/cart", { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMerge]);

  // Sync selectedStore when the URL query param changes
  useEffect(() => {
    if (initialStore) {
      setSelectedStore(initialStore);
    }
  }, [initialStore]);

  // If the selected store has no items anymore, go back to the overview
  useEffect(() => {
    if (selectedStore && itemsBySeller.size > 0 && !itemsBySeller.has(selectedStore)) {
      setSelectedStore(null);
      router.replace("/cart", { scroll: false });
    }
  }, [selectedStore, itemsBySeller, router]);

  // ── Conditional renders (after all hooks) ──────────────────────────────

  // Show re-order view when ?reorder=1
  if (isReorder) return <ReorderCartView />;

  if (!isLoaded) {
    return <CartLoading />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
          🛍️
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Your basket is empty
          </h1>
          <p className="text-xs text-muted-foreground">
            Explore our San Pablo food catalog and add fresh local delicacies!
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-md transition active:scale-95 hover:bg-primary/90"
        >
          Find Local Food
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  function openStore(sellerId: string) {
    setMenuOpenFor(null);
    setSelectedStore(sellerId);
    router.replace(`/cart?store=${sellerId}`, { scroll: false });
    window.scrollTo({ top: 0 });
  }

  function closeStore() {
    setMenuOpenFor(null);
    setSelectedStore(null);
    router.replace("/cart", { scroll: false });
  }

  function handleBack() {
    if (selectedStore && itemsBySeller.size > 1) {
      closeStore();
      return;
    }

    // Always exit cart back to the delicacies page (/products)
    router.push("/products");
  }

  function clearStore(sellerId: string, name: string) {
    setMenuOpenFor(null);
    if (!window.confirm(`Remove all items from ${name}?`)) return;
    for (const line of itemsBySeller.get(sellerId)?.items ?? []) {
      removeItem(line.productId);
    }
  }

  /* Store switcher tabs: horizontal scroll row (scrollbar hidden, still swipeable) */
  const storeTabs =
    itemsBySeller.size > 1 ? (
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={closeStore}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
            !selectedStore
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>All Stores ({itemCount})</span>
        </button>

        {Array.from(itemsBySeller.entries()).map(([sellerId, seller]) => {
          const count = sumQty(seller.items);
          const isSelected = selectedStore === sellerId;
          return (
            <button
              key={sellerId}
              type="button"
              onClick={() => openStore(sellerId)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              <span className="max-w-[120px] truncate">{seller.name}</span>
              <span className="opacity-80">({count})</span>
            </button>
          );
        })}
      </div>
    ) : null;

  /* ------------------------------------------------------------------ */
  /*  STORE CART (one store)                                             */
  /* ------------------------------------------------------------------ */
  const activeSeller = selectedStore ? itemsBySeller.get(selectedStore) : null;

  if (selectedStore && activeSeller) {
    const subtotal = sumPrice(activeSeller.items);
    const total = subtotal + DELIVERY_FEE;
    const qty = sumQty(activeSeller.items);

    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 pb-44 pt-0">
        <header className="sticky top-0 z-30 -mx-4 bg-background/95 backdrop-blur-md border-b border-border/60 px-4 py-3 flex items-center gap-3">
          <RoundBackButton
            label={itemsBySeller.size > 1 ? "Back to all carts" : "Back to delicacies"}
            icon="arrow"
            onClick={itemsBySeller.size > 1 ? closeStore : handleBack}
          />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black leading-tight text-foreground">
              {activeSeller.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {qty} item{qty !== 1 ? "s" : ""}
            </p>
          </div>
        </header>

        {storeTabs}

        {/* DSA: Stack Undo Banner — pops and restores last removed item */}
        {canUndo && (
          <UndoBanner
            name={lastRemovedName}
            onUndo={undoRemove}
            onDismiss={dismissUndo}
          />
        )}

        <section className="overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-sm">
          <ul className="divide-y divide-border/60">
            {activeSeller.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3 p-4">
                <Link
                  href={`/products/${item.productId}?from=cart&store=${item.sellerId}`}
                  className="flex min-w-0 flex-1 items-center gap-3 transition-opacity hover:opacity-85"
                >
                  <Thumb item={item} />

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h3 className="truncate text-sm font-extrabold text-foreground transition-colors hover:text-primary">
                      {item.name}
                    </h3>
                    <p className="text-sm font-black text-foreground">
                      {peso(item.price)}
                    </p>
                  </div>
                </Link>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-sm transition active:scale-90 disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                  <span className="w-6 text-center text-sm font-black text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={item.quantity >= item.stock}
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-sm transition active:scale-90 disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeItem(item.productId)}
                    className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2.5 rounded-[2rem] border border-border/60 bg-card p-5 text-sm shadow-sm">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Bill summary
          </h2>
          <div className="flex justify-between text-muted-foreground">
            <span>
              Items total ({qty} item{qty !== 1 ? "s" : ""})
            </span>
            <span className="font-bold text-foreground">{peso(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery fee</span>
            <span className="font-bold text-foreground">
              {peso(DELIVERY_FEE)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-extrabold text-foreground">Total payable</span>
            <span className="text-lg font-black text-foreground">
              {peso(total)}
            </span>
          </div>
        </section>

        {/*
          Fixed checkout bar that sits ABOVE the bottom navbar.
          Set the navbar's height with --bottom-nav-h (default 4rem = 64px).
          z-30 keeps it under the navbar so it can never cover it.
        */}
        <div className="fixed inset-x-0 bottom-[var(--bottom-nav-h,4rem)] z-30  bg-background/95 backdrop-blur-md">
          <div className="mx-auto max-w-3xl px-4 py-3">
            <Link
              href={`/checkout?store=${selectedStore}`}
              className="flex w-full items-center justify-between rounded-full bg-primary px-6 py-4 text-primary-foreground shadow-lg shadow-primary/25 transition active:scale-[0.99] hover:bg-primary/90"
            >
              <span className="text-sm font-black">Proceed to checkout</span>
              <span className="flex items-center gap-2 text-base font-black">
                {peso(total)}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  ALL CARTS (overview, one card per store)                           */
  /* ------------------------------------------------------------------ */
  const storeCount = itemsBySeller.size;
  const allDelivery = DELIVERY_FEE * storeCount;
  const allTotal = sumPrice(items) + allDelivery;

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 pb-44 pt-0">
      <header className="sticky top-0 z-30 -mx-4 bg-background/95 backdrop-blur-md border-b border-border/60 px-4 py-3 flex items-center gap-3">
        <RoundBackButton
          label="Back to delicacies"
          icon="arrow"
          onClick={handleBack}
        />
        <div>
          <h1 className="text-lg font-black leading-tight text-foreground">
            My Cart
          </h1>
        </div>
      </header>

      {storeTabs}

      {/* DSA: Stack Undo Banner — pops and restores last removed item */}
      {canUndo && (
        <UndoBanner
          name={lastRemovedName}
          onUndo={undoRemove}
          onDismiss={dismissUndo}
        />
      )}

      {/* Click-away layer for the ••• menu */}
      {menuOpenFor && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpenFor(null)}
          className="fixed inset-0 z-10 cursor-default"
        />
      )}

      {Array.from(itemsBySeller.entries()).map(([sellerId, seller]) => {
        const subtotal = sumPrice(seller.items);
        const logo = seller.items.find((i) => i.imageUrl)?.imageUrl ?? null;
        const shown = seller.items.slice(0, MAX_THUMBS);
        const extra = seller.items.length - shown.length;

        return (
          <section
            key={sellerId}
            className="rounded-[2rem] border border-border/60 bg-card p-4 shadow-sm"
          >
            {/* Store header */}
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-primary/10 text-primary">
                {logo ? (
                  <img src={logo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Store className="h-6 w-6" aria-hidden="true" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-black leading-tight text-foreground">
                  {seller.name}
                </h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-primary">
                  <Bike className="h-4 w-4" aria-hidden="true" />
                  {peso(DELIVERY_FEE)} delivery
                </p>
              </div>

              <div className="relative z-20">
                <button
                  type="button"
                  aria-label={`Options for ${seller.name}`}
                  onClick={() =>
                    setMenuOpenFor(menuOpenFor === sellerId ? null : sellerId)
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border/50 bg-card text-foreground shadow-sm transition active:scale-90"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                {menuOpenFor === sellerId && (
                  <div className="absolute right-0 top-12 w-44 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
                    <button
                      type="button"
                      onClick={() => clearStore(sellerId, seller.name)}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-muted"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear cart
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Item thumbnails + add more */}
            <div className="mt-4 flex items-center gap-2.5">
              {shown.map((item) => (
                <Link
                  key={item.productId}
                  href={`/products/${item.productId}?from=cart&store=${sellerId}`}
                  title={item.name}
                  className="transition-transform active:scale-95 hover:opacity-85"
                >
                  <Thumb item={item} />
                </Link>
              ))}
              {extra > 0 && (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-black text-muted-foreground">
                  +{extra}
                </span>
              )}
              <Link
                href={`/stores/${sellerId}`}
                aria-label={`Add more from ${seller.name}`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card text-foreground shadow-sm transition active:scale-90"
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} />
              </Link>
            </div>

            {/* Subtotal */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-extrabold text-foreground">
                Subtotal
              </span>
              <span className="text-sm font-black text-foreground">
                {peso(subtotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => openStore(sellerId)}
              className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-muted text-sm font-extrabold text-foreground transition active:scale-[0.98] hover:bg-muted/80"
            >
              View your cart
            </button>
          </section>
        );
      })}

      {/* Keep the old "checkout everything" option */}
      {storeCount > 1 && (
        <Link
          href="/checkout"
          className="flex w-full items-center justify-between rounded-full bg-primary px-6 py-4 text-primary-foreground shadow-lg shadow-primary/25 transition active:scale-[0.99] hover:bg-primary/90"
        >
          <span className="flex flex-col text-left">
            <span className="text-sm font-black">Checkout all stores</span>
            <span className="text-[11px] text-primary-foreground/80">
              {itemCount} item{itemCount !== 1 ? "s" : ""} • {storeCount} stores
              • incl. {peso(allDelivery)} delivery
            </span>
          </span>
          <span className="flex items-center gap-2 text-base font-black">
            {peso(allTotal)}
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartLoading />}>
      <CartContent />
    </Suspense>
  );
}