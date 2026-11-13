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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-muted-foreground">Loading cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Browse the catalog and add some local treats.
          </p>
          <Link
            href="/products"
            className="rounded-md border border-transparent bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Browse catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Your cart</h1>
        <p className="text-muted-foreground">
          {itemCount} item{itemCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Cart items */}
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold mb-4">Items</h2>
        <div className="space-y-4">
          {Array.from(itemsBySeller.entries()).map(([sellerId, seller]) => (
            <div key={sellerId} className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span>From {seller.name}</span>
                <span className="ml-auto font-normal">Delivery fee: ₱50.00</span>
              </div>
              <div className="space-y-2">
                {seller.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 border-b pb-2 last:border-0"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded object-cover border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.name}</span>
                        <span className="font-medium">₱{item.price.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Stock: {item.stock}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="rounded-md border border-transparent bg-muted px-2 py-1 text-xs text-muted-foreground disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        className="rounded-md border border-transparent bg-muted px-2 py-1 text-xs text-muted-foreground disabled:opacity-50"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-destructive hover:underline ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold mb-4">Order summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          {itemsBySeller.size > 1 && (
            <div className="flex justify-between">
              <span>
                Delivery fee (₱50 × {itemsBySeller.size} sellers)
              </span>
              <span>₱{(deliveryFee).toFixed(2)}</span>
            </div>
          )}
          {itemsBySeller.size === 1 && (
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span>₱{deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>₱{grandTotal.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-6">
          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Continue shopping
          </Link>
        </div>
      </div>

      {/* Checkout button */}
      <Link
        href="/checkout"
        className="block w-full rounded-md bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
