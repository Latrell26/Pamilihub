"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { checkoutAction } from "@/modules/orders/actions";
import { AddressPicker } from "@/components/ui/address-picker";
import { Banknote, CreditCard, MapPin, ArrowLeft } from "lucide-react";
import CheckoutLoading from "./loading";

const DELIVERY_FEE = 50;

const inputClass = (hasError: boolean) =>
  `h-12 w-full rounded-2xl border bg-background px-4 text-sm placeholder:text-muted-foreground transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary ${
    hasError ? "border-red-400 bg-red-50/20" : "border-input"
  }`;

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeParam = searchParams.get("store");
  const isReorder =
    searchParams.get("reorder") === "1" || searchParams.has("reorder");

  const { items, isLoaded, clear: clearCart, removeItem } = useCart();
  const [reorderItems, setReorderItems] = useState<typeof items>([]);
  const [reorderLoaded, setReorderLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [paymentMethod, setPaymentMethod] = useState<"mockpay" | "cod">("mockpay");
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Load re-order items from sessionStorage when in reorder mode
  useEffect(() => {
    if (!isReorder) return;
    try {
      const raw = sessionStorage.getItem("pamilihub_reorder");
      if (!raw) {
        // Session was cleared (back nav after completing or abandoning re-order)
        // Redirect to orders silently
        router.replace("/orders");
        return;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.length === 0) {
        router.replace("/orders");
        return;
      }
      setReorderItems(parsed);
    } catch {
      router.replace("/orders");
      return;
    }
    setReorderLoaded(true);
  }, [isReorder, router]);

  // Autofill delivery information from user profile / DB
  useEffect(() => {
    let isMounted = true;
    async function loadCustomerProfile() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const profile = await res.json();
          if (profile && isMounted) {
            if (profile.full_name) setDeliveryName(profile.full_name);
            if (profile.phone) setDeliveryPhone(profile.phone);
            if (profile.address) setDeliveryAddress(profile.address);
          }
        }
      } catch (err) {
        console.error("Failed to autofill customer details from DB:", err);
      }
    }
    loadCustomerProfile();
    return () => { isMounted = false; };
  }, []);

  const getFieldError = (name: string) => fieldErrors[name]?.[0];

  // Filter items: reorder takes precedence over regular cart
  const checkoutItems = isReorder
    ? reorderItems
    : storeParam
    ? items.filter((i) => i.sellerId === storeParam)
    : items;

  // Group items by seller for per-seller delivery fee
  const itemsBySeller = new Map<string, { name: string; items: typeof checkoutItems }>();
  for (const item of checkoutItems) {
    if (!itemsBySeller.has(item.sellerId)) {
      itemsBySeller.set(item.sellerId, { name: item.sellerName, items: [] });
    }
    itemsBySeller.get(item.sellerId)!.items.push(item);
  }

  const subtotal = checkoutItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const storeCount = itemsBySeller.size;
  const deliveryFee = DELIVERY_FEE * storeCount;
  const grandTotal = subtotal + deliveryFee;

  const targetSellerName =
    (storeParam || isReorder) && checkoutItems.length > 0
      ? checkoutItems[0].sellerName
      : null;

  const editCartHref = isReorder
    ? "/cart?reorder=1"
    : storeParam
    ? `/cart?store=${storeParam}`
    : "/cart";

  const isDataReady = isReorder ? reorderLoaded : isLoaded;

  if (!isDataReady) {
    return <CheckoutLoading />;
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
          📦
        </div>
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          {isReorder
            ? "Re-order is empty"
            : storeParam
            ? "No items from this store in your cart"
            : "Cart is empty"}
        </h1>
        <p className="text-xs text-muted-foreground">
          {isReorder
            ? "Your re-order items were removed or already processed."
            : storeParam
            ? "Your items for this store may have already been ordered or removed."
            : "Please add items to your cart before proceeding to checkout."}
        </p>
        <Link
          href={editCartHref}
          className="inline-block rounded-full bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
        >
          {isReorder ? "Return to Re-order" : "Return to Basket"}
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

      if (isReorder) {
        // Clear re-order session; existing cart is completely untouched
        sessionStorage.removeItem("pamilihub_reorder");
      } else if (storeParam) {
        // If checkout was for a specific store, remove only those items
        for (const item of checkoutItems) {
          removeItem(item.productId);
        }
      } else {
        clearCart();
      }

      router.push("/orders");
    } else {
      let rawMsg = result.message || "Checkout failed. Please check the fields.";
      for (const item of checkoutItems) {
        rawMsg = rawMsg.replaceAll(item.productId, `"${item.name}"`);
      }
      rawMsg = rawMsg.replace(
        /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi,
        "selected food"
      );
      setError(rawMsg);
      setFieldErrors(result.errors ?? {});
    }
    setLoading(false);
  }

  const paymentOptions = [
    {
      value: "mockpay" as const,
      title: "MockPay (Simulated)",
      desc: "Simulated online checkout demo. Allows testing approval/cancellation with immediate status update.",
      Icon: CreditCard,
    },
    {
      value: "cod" as const,
      title: "Cash on Delivery",
      desc: "Pay directly in cash when the local food seller delivers your delicacies to your doorstep.",
      Icon: Banknote,
    },
  ];

  return (
    <form action={handleCheckout} className="mx-auto max-w-3xl pb-32">
      <input
        type="hidden"
        name="cart"
        value={JSON.stringify(
          checkoutItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          }))
        )}
      />

      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60">
        <div className="mx-auto max-w-3xl flex items-center gap-3 px-4 py-3">
          <Link
            href={editCartHref}
            aria-label="Back to cart"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card text-foreground shadow-sm transition active:scale-90"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-black leading-tight text-foreground">
              Checkout
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {targetSellerName
                ? targetSellerName
                : `${storeCount} store${storeCount !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-4 pt-5">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
            {message}
          </div>
        )}

        {/* Delivery address */}
        <section className="space-y-4 rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-black text-foreground">
            <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
            Delivery address
          </h2>

          <div className="space-y-1">
            <label
              htmlFor="delivery_name"
              className="block text-xs font-bold text-muted-foreground"
            >
              Recipient name 
            </label>
            <input
              id="delivery_name"
              name="delivery_name"
              required
              placeholder="Juan Dela Cruz"
              value={deliveryName}
              onChange={(e) => setDeliveryName(e.target.value)}
              className={inputClass(Boolean(getFieldError("deliveryName")))}
            />
            {getFieldError("deliveryName") && (
              <p className="text-[11px] text-red-600">{getFieldError("deliveryName")}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="delivery_phone"
              className="block text-xs font-bold text-muted-foreground"
            >
              Phone number 
            </label>
            <input
              id="delivery_phone"
              name="delivery_phone"
              type="tel"
              required
              placeholder="0912 345 6789"
              value={deliveryPhone}
              onChange={(e) => setDeliveryPhone(e.target.value)}
              className={inputClass(Boolean(getFieldError("deliveryPhone")))}
            />
            {getFieldError("deliveryPhone") && (
              <p className="text-[11px] text-red-600">{getFieldError("deliveryPhone")}</p>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="hidden"
              name="delivery_address"
              value={deliveryAddress}
            />
            <AddressPicker
              value={deliveryAddress}
              onChange={setDeliveryAddress}
              disabled={loading}
              hasError={Boolean(getFieldError("deliveryAddress"))}
            />
            {getFieldError("deliveryAddress") && (
              <p className="text-[11px] text-red-600">{getFieldError("deliveryAddress")}</p>
            )}
          </div>
        </section>

        {/* Payment method */}
        <section className="space-y-3 rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm">
          <h2 className="text-xl font-black text-foreground">Payment method</h2>

          <div className="space-y-3">
            {paymentOptions.map(({ value, title, desc, Icon }) => {
              const selected = paymentMethod === value;
              return (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all active:scale-[0.99] ${
                    selected
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "border-border bg-card hover:bg-muted/40"
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold text-foreground">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      {desc}
                    </span>
                  </span>
                  <input
                    type="radio"
                    name="payment_method"
                    value={value}
                    checked={selected}
                    onChange={() => setPaymentMethod(value)}
                    className="mt-1 h-5 w-5 shrink-0 accent-primary"
                  />
                </label>
              );
            })}
          </div>
        </section>

        {/* Summary lines */}
        <section id="order-summary" className="scroll-mt-24 space-y-4 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-foreground">Subtotal</h2>
            <span className="text-base font-bold text-foreground">
              ₱{subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-base text-foreground">
            <span>
              Delivery fee (₱{DELIVERY_FEE} × {storeCount} store
              {storeCount !== 1 ? "s" : ""})
            </span>
            <span className="font-bold">₱{deliveryFee.toFixed(2)}</span>
          </div>
        </section>
      </div>

      {/*
        Fixed total card ABOVE the bottom navbar.
        Set the navbar's height with --bottom-nav-h (default 4rem).
      */}
      <div className="fixed inset-x-0 bottom-[var(--bottom-nav-h,1rem)] z-30">
        <div className="mx-auto max-w-3xl px-3 pb-1">
          <div className="rounded-[2rem] border border-border/60 bg-card/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md">
            <div className="flex items-start justify-between px-2 pt-1">
              <div>
                <p className="text-lg font-black text-foreground">
                  Total{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (incl. delivery)
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("order-summary")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-sm font-bold text-foreground underline underline-offset-4"
                >
                  See summary
                </button>
              </div>
              <span className="text-lg font-black text-foreground">
                ₱{grandTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-primary text-base font-extrabold text-primary-foreground shadow-md shadow-primary/25 transition active:scale-[0.98] hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? "Securing & processing order..." : "Place order"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}   