"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { checkoutAction } from "@/modules/orders/actions";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, isLoaded, clear: clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [paymentMethod, setPaymentMethod] = useState<"mockpay" | "cod">("mockpay");

  const getFieldError = (name: string) => fieldErrors[name]?.[0];

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
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground animate-pulse">Loading checkout details...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-3xl">
          📦
        </div>
        <h1 className="text-lg font-bold tracking-tight text-foreground">Cart is empty</h1>
        <p className="text-xs text-muted-foreground">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-block px-5 py-2.5 rounded-2xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
        >
          Browse Catalog
        </Link>
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
      clearCart();
      router.push("/orders");
    } else {
      setError(result.message || "Checkout failed. Please check the fields.");
      setFieldErrors(result.errors ?? {});
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3 px-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Checkout</h1>
          <p className="text-xs text-muted-foreground">
            Confirm your delivery details and choose payment
          </p>
        </div>
        <Link
          href="/cart"
          className="text-xs font-bold text-primary hover:underline"
        >
          ← Edit Cart
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 flex items-start gap-2">
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
          {message}
        </div>
      )}

      <form action={handleCheckout} className="space-y-5">
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

        {/* Delivery Details Card */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <span className="text-base">📍</span>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
              Delivery Address
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Recipient Name <span className="text-red-500">*</span>
              </label>
              <input
                name="delivery_name"
                required
                placeholder="Juan Dela Cruz"
                className={`w-full rounded-xl border bg-background px-3 py-2.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  getFieldError("deliveryName") ? "border-red-400 bg-red-50/20" : "border-input"
                }`}
              />
              {getFieldError("deliveryName") && (
                <p className="text-[11px] text-red-600 mt-1">{getFieldError("deliveryName")}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="delivery_phone"
                type="tel"
                required
                placeholder="0912 345 6789"
                className={`w-full rounded-xl border bg-background px-3 py-2.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  getFieldError("deliveryPhone") ? "border-red-400 bg-red-50/20" : "border-input"
                }`}
              />
              {getFieldError("deliveryPhone") && (
                <p className="text-[11px] text-red-600 mt-1">{getFieldError("deliveryPhone")}</p>
              )}
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                San Pablo City Delivery Address <span className="text-red-500">*</span>
              </label>
              <input
                name="delivery_address"
                required
                placeholder="House/Unit #, Street, Barangay, San Pablo City, Laguna"
                className={`w-full rounded-xl border bg-background px-3 py-2.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  getFieldError("deliveryAddress") ? "border-red-400 bg-red-50/20" : "border-input"
                }`}
              />
              {getFieldError("deliveryAddress") && (
                <p className="text-[11px] text-red-600 mt-1">{getFieldError("deliveryAddress")}</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Options Card */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <span className="text-base">💳</span>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
              Payment Method
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 active:scale-[0.99] ${
                paymentMethod === "mockpay"
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs sm:text-sm text-foreground flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  MockPay (Simulated)
                </span>
                <input
                  type="radio"
                  name="payment_method"
                  value="mockpay"
                  checked={paymentMethod === "mockpay"}
                  onChange={() => setPaymentMethod("mockpay")}
                  className="accent-primary h-4 w-4"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Simulated online checkout demo. Allows testing approval/cancellation with immediate status update.
              </p>
            </label>

            <label
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 active:scale-[0.99] ${
                paymentMethod === "cod"
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs sm:text-sm text-foreground flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  Cash on Delivery
                </span>
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-primary h-4 w-4"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Pay directly in cash when the local food seller delivers your delicacies to your doorstep.
              </p>
            </label>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Order Total ({itemsBySeller.size} store{itemsBySeller.size !== 1 ? "s" : ""})
          </h2>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Food Items Subtotal</span>
              <span className="font-bold text-foreground">₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee (₱50 × {itemsBySeller.size})</span>
              <span className="font-bold text-foreground">₱{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between items-center text-sm font-black text-foreground">
              <span>Grand Total</span>
              <span className="text-lg font-black text-foreground">₱{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Sticky-feeling Place Order Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 disabled:opacity-60 transition-all active:scale-[0.99] cursor-pointer"
        >
          {loading ? (
            <span>Securing & Processing Order...</span>
          ) : (
            `Place Order • ₱${grandTotal.toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
}
