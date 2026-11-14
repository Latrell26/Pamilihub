"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";

export default function CartPage() {
  const { items, itemCount, subtotal, removeItem, updateQuantity, isLoaded } =
    useCart();

  // Group items by seller to show per-seller delivery fee
  const itemsBySeller = new Map<string, { name: string; items: typeof items }>();
  for (const item of items) {
    if (!itemsBySeller.has(item.sellerId)) {
      itemsBySeller.set(item.sellerId, { name: item.sellerName, items: [] });
    }
    itemsBySeller.get(item.sellerId)!.items.push(item);
  }

  const deliveryFee = 50 * itemsBySeller.size;
  const grandTotal = subtotal + deliveryFee;

  if (!isLoaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground animate-pulse">Loading shopping cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-3xl">
          🛍️
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Your basket is empty</h1>
          <p className="text-xs text-muted-foreground">
            Explore our San Pablo food catalog and add fresh local delicacies!
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-primary text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all active:scale-95"
        >
          <span>Find Local Food</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3 px-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Food Basket</h1>
          <p className="text-xs text-muted-foreground">
            {itemCount} item{itemCount !== 1 ? "s" : ""} • {itemsBySeller.size} store{itemsBySeller.size !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-primary hover:underline"
        >
          + Add more items
        </Link>
      </div>

      <div className="space-y-4">
        {/* Cart Items grouped by seller */}
        {Array.from(itemsBySeller.entries()).map(([sellerId, seller]) => {
          const sellerSubtotal = seller.items.reduce(
            (acc, i) => acc + i.price * i.quantity,
            0
          );

          return (
            <div
              key={sellerId}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
            >
              {/* Seller Header */}
              <div className="bg-primary/5 px-4 py-2.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🏪</span>
                  <span className="font-bold text-xs text-foreground uppercase tracking-wider">
                    {seller.name}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  Delivery: ₱50.00
                </span>
              </div>

              {/* Items in this seller */}
              <div className="divide-y divide-border/60">
                {seller.items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-muted/60 border border-border flex items-center justify-center shrink-0 text-2xl">
                        🥧
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-extrabold text-xs sm:text-sm text-foreground truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-black text-foreground">
                        ₱{item.price.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Stock: {item.stock}
                      </p>
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold text-foreground hover:bg-muted active:bg-muted/80 disabled:opacity-30 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-7 sm:w-8 text-center text-xs font-black text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold text-foreground hover:bg-muted active:bg-muted/80 disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Seller Subtotal */}
              <div className="bg-muted/10 px-4 py-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Merchant subtotal</span>
                <span className="font-bold text-foreground">
                  ₱{sellerSubtotal.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Pricing Summary Card */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Bill Summary
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Items Total</span>
              <span className="font-bold text-foreground">₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee (₱50 × {itemsBySeller.size} store{itemsBySeller.size !== 1 ? "s" : ""})</span>
              <span className="font-bold text-foreground">₱{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="pt-2.5 border-t border-border flex justify-between items-center text-sm">
              <span className="font-extrabold text-foreground">Total Payable</span>
              <span className="text-lg font-black text-foreground">₱{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button (Full width on mobile, thumb-friendly) */}
        <div className="pt-1">
          <Link
            href="/checkout"
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-[0.99]"
          >
            <div className="flex flex-col text-left">
              <span className="font-black text-sm">Proceed to Checkout</span>
              <span className="text-[11px] text-white/80">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black">₱{grandTotal.toFixed(2)}</span>
              <span>→</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
