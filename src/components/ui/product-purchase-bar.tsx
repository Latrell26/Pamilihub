"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { Minus, Plus, Check } from "lucide-react";

type ProductPurchaseBarProps = {
  productId: string;
  name: string;
  price: number;
  stock: number;
  sellerId: string;
  sellerName: string;
  imageUrl: string | null;
};

/**
 * Bottom bar fixed to the screen: [ - 1 + ] [ Add to cart ].
 * Customers only. The page decides whether to render it.
 */
export function ProductPurchaseBar({
  productId,
  name,
  price,
  stock,
  sellerId,
  sellerName,
  imageUrl,
}: ProductPurchaseBarProps) {
  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the pending timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const inCartQty = items.find((i) => i.productId === productId)?.quantity ?? 0;
  // Initialise quantity based on existing cart quantity for this product
  useEffect(() => {
    if (inCartQty > 0) setQty(inCartQty);
  }, [inCartQty]);
  const remaining = Math.max(0, stock - inCartQty);
  const soldOut = stock <= 0;
  const maxedOut = !soldOut && remaining === 0;
  const disabled = soldOut || maxedOut;
  const safeQty = Math.min(qty, Math.max(1, remaining));

  const stepBtn =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-40";

  function handleAdd() {
    if (disabled) return;
    addItem({
      productId,
      name,
      price,
      stock,
      sellerId,
      sellerName,
      imageUrl,
      quantity: safeQty,
    });
    setAdded(true);
    // Do not reset quantity to 1; keep current selection
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), 1500);
  }

  const label = soldOut
    ? "Sold out"
    : maxedOut
    ? "Max stock in cart"
    : added
    ? "Added to cart"
    : `Add to cart • ₱${(price * safeQty).toFixed(2)}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={disabled || safeQty <= 1}
            onClick={() => setQty(Math.max(1, safeQty - 1))}
            className={stepBtn}
          >
            <Minus className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <span
            aria-live="polite"
            className="w-6 text-center text-base font-black text-foreground"
          >
            {safeQty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={disabled || safeQty >= remaining}
            onClick={() => setQty(Math.min(remaining, safeQty + 1))}
            className={stepBtn}
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={handleAdd}
          className={`flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-extrabold transition active:scale-[0.98] disabled:cursor-not-allowed ${
            disabled
              ? "bg-muted text-muted-foreground"
              : added
              ? "bg-emerald-600 text-white"
              : "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90"
          }`}
        >
          {added && <Check className="h-4 w-4 shrink-0" strokeWidth={3} />}
          <span className="truncate">{label}</span>
        </button>
      </div>
    </div>
  );
}