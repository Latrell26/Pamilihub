"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { checkoutAction } from "@/modules/orders/actions";

export default function CheckoutPage() {
  const { items, subtotal, isLoaded } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"mockpay" | "cod">("mockpay");

  // Group items by seller for per-seller delivery fee
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
        <div className="text-muted-foreground">Loading checkout...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some items before checking out.
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

  async function handleCheckout(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");
    const result = await checkoutAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      // Redirect to order success / orders page
      window.location.href = "/orders";
    } else {
      setError(result.message || "Checkout failed.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">
          Review your order and choose how to pay.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/50 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-md bg-success/10 border border-success/50 p-3 text-sm text-success">
          {message}
        </div>
      )}

      <form action={handleCheckout} className="space-y-6">
        <input
          type="hidden"
          name="cart"
          value={JSON.stringify(
            items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
            }))
          )}
        />

        {/* Delivery information */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Delivery information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full name
              </label>
              <input
                name="delivery_name"
                defaultValue=""
                required
                className="w-full rounded-md border input bg-background text-foreground"
                placeholder="Juan Dela Cruz"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone number
              </label>
              <input
                name="delivery_phone"
                type="tel"
                defaultValue=""
                required
                className="w-full rounded-md border input bg-background text-foreground"
                placeholder="0912 345 6789"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Delivery address
              </label>
              <input
                name="delivery_address"
                defaultValue=""
                required
                className="w-full rounded-md border input bg-background text-foreground"
                placeholder="123 Brgy. San Rafael, San Pablo City, Laguna"
              />
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Payment method</h2>
          <div className="space-y-3">
            <label>
              <input
                type="radio"
                name="payment_method"
                value="mockpay"
                defaultChecked
                onChange={() => setPaymentMethod("mockpay")}
                className="form-radio"
              />
              <span className="ml-2">
                MockPay (simulated){" "}
                <span className="text-xs text-muted-foreground font-normal">
                  — Pay now on a simulated payment page
                </span>
              </span>
            </label>
            <label>
              <input
                type="radio"
                name="payment_method"
                value="cod"
                onChange={() => setPaymentMethod("cod")}
                className="form-radio"
              />
              <span className="ml-2">
                Cash on delivery{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  — Pay the seller when your order is delivered
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Order summary */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Order summary</h2>
          <div className="space-y-4">
            {Array.from(itemsBySeller.entries()).map(([sellerId, seller]) => (
              <div key={sellerId} className="border-b pb-2 last:border-0">
                <div className="flex justify-between text-sm font-medium">
                  <span>{seller.name}</span>
                  <span>₱50.00 delivery</span>
                </div>
                <div className="space-y-1 text-sm">
                  {seller.items.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {item.quantity} × {item.name}
                      </span>
                      <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-between font-semibold border-t pt-2 text-base">
              <span>Total</span>
              <span>₱{grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            One order is created per seller. Each order has its own status that
            the seller will update.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md border border-transparent bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-70"
        >
          {loading ? "Placing order..." : "Place order"}
        </button>
      </form>
    </div>
  );
}
