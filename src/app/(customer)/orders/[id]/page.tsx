import Link from "next/link";
import {
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  CreditCard,
  Banknote,
  Receipt,
} from "lucide-react";
import { getOrderById } from "@/modules/orders/queries";
import { getHeaderUser } from "@/lib/auth/header-user";
import { getSellerStatus } from "@/modules/accounts/queries";
import { OrderStatusBadge, PaymentBadge } from "@/components/seller/orders/StatusBadge";
import type { OrderStatus, PaymentStatus, PaymentMethod } from "@/modules/orders/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fil-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

const TIMELINE_STEPS: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "delivering",
  "completed",
];

const STEP_LABELS: Record<OrderStatus, string> = {
  pending: "Placed",
  accepted: "Accepted",
  preparing: "Preparing",
  delivering: "On the way",
  completed: "Delivered",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

function NoticeScreen({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <p className="text-xs text-muted-foreground">{text}</p>
      <Link
        href={href}
        className="inline-block px-5 py-2.5 rounded-full bg-primary text-xs font-bold text-primary-foreground shadow"
      >
        {cta}
      </Link>
    </div>
  );
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [user, order] = await Promise.all([
    getHeaderUser(),
    getOrderById(params.id),
  ]);

  if (!user) {
    return (
      <NoticeScreen
        title="Sign in required"
        text="Please sign in to view your order details."
        href="/login"
        cta="Sign In"
      />
    );
  }

  if (!order) {
    return (
      <NoticeScreen
        title="Order not found"
        text="We couldn't locate this order in our system."
        href="/orders"
        cta="Back to Orders"
      />
    );
  }

  // Access control: customer who placed order, seller who owns the store, or platform admin
  const isOwner = order.customer_id === user.id;
  let isStoreSeller = false;
  if (user.role === "seller") {
    const seller = await getSellerStatus();
    isStoreSeller = seller !== null && seller.id === order.seller_id;
  }

  if (!isOwner && user.role !== "admin" && !isStoreSeller) {
    return (
      <NoticeScreen
        title="Not authorized"
        text="You don't have permission to view this order."
        href="/orders"
        cta="Back to Orders"
      />
    );
  }

  const backHref =
    user.role === "seller" ? "/seller/orders" : user.role === "admin" ? "/admin/orders" : "/orders";

  const items = order.order_items ?? [];
  const subtotal = items.reduce((acc, i) => acc + Number(i.unit_price) * i.quantity, 0);
  const storeName = order.sellerStoreName || "Local Seller";
  const isMockpay = order.payment_method === "mockpay";

  const canPay =
    isMockpay && order.payment_status === "pending" && order.order_status === "pending";
  const currentStatus = order.order_status as OrderStatus;
  const isTerminal = currentStatus === "rejected" || currentStatus === "cancelled";
  const currentIndex = TIMELINE_STEPS.indexOf(currentStatus);

  // Big status text in the header
  let headline = "";
  let subline = "";
  switch (currentStatus) {
    case "pending":
      if (isMockpay && order.payment_status === "pending") {
        headline = "Waiting for your payment";
        subline = "Pay with MockPay so the seller can accept your order.";
      } else {
        headline = "Waiting for the seller";
        subline = `${storeName} will accept your order soon.`;
      }
      break;
    case "accepted":
      headline = "Order accepted";
      subline = `${storeName} will start preparing it shortly.`;
      break;
    case "preparing":
      headline = "Your order is being prepared";
      subline = `${storeName} is making your delicacies.`;
      break;
    case "delivering":
      headline = "Your order is on the way";
      subline = "Get ready to receive it at your address.";
      break;
    case "completed":
      headline = "Order delivered";
      subline = "Enjoy your San Pablo delicacies!";
      break;
    case "rejected":
      headline = "Order rejected";
      subline = "The seller could not take this order. Any stock has been restored.";
      break;
    default:
      headline = "Order cancelled";
      subline = "This order was cancelled. Any stock has been restored.";
  }

  const cardClass = "rounded-2xl border border-border bg-card p-4 shadow-sm";
  const cardTitle = "text-sm font-extrabold text-foreground";

  return (
    <div className="mx-auto max-w-3xl lg:px-8 lg:py-6">
      {/* Primary brand status header */}
      <section className="bg-primary px-4 pb-14 pt-4 text-primary-foreground sm:px-6 lg:rounded-3xl">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            aria-label="Back to orders"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-md transition active:scale-90"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <p className="text-sm font-bold text-white/90">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <h1 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">{headline}</h1>
        <p className="mt-1 text-sm text-white/90">{subline}</p>

        {/* Segmented progress bar */}
        {!isTerminal && (
          <div className="mt-5">
            <div
              className="flex gap-1.5"
              role="progressbar"
              aria-label="Order progress"
              aria-valuemin={1}
              aria-valuemax={TIMELINE_STEPS.length}
              aria-valuenow={currentIndex + 1}
              aria-valuetext={STEP_LABELS[currentStatus]}
            >
              {TIMELINE_STEPS.map((step, idx) => {
                const done = currentIndex > idx || currentStatus === "completed";
                const active = currentIndex === idx && currentStatus !== "completed";
                return (
                  <span
                    key={step}
                    className={`h-1.5 flex-1 rounded-full ${
                      done ? "bg-green-500" : active ? "animate-pulse bg-white" : "bg-white/25"
                    }`}
                  />
                );
              })}
            </div>
            <div className="mt-1.5 flex gap-1.5">
              {TIMELINE_STEPS.map((step, idx) => (
                <span
                  key={step}
                  className={`flex-1 text-center text-[10px] leading-tight ${
                    currentIndex === idx ? "font-extrabold text-white" : "text-white"
                  }`}
                >
                  {STEP_LABELS[step]}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* White sheet overlapping the header */}
      <section className="-mt-8 space-y-4 rounded-t-[2rem] bg-background px-4 pb-10 pt-5 sm:px-6 lg:rounded-b-3xl">
        {/* MockPay pending: pay now (desktop inline card) */}
        {canPay && (
          <div className="hidden sm:flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <h2 className={cardTitle}>Payment awaiting confirmation</h2>
              <p className="text-xs text-muted-foreground">
                Pay with MockPay (simulated) so the seller can start preparing your order.
              </p>
            </div>
            <Link
              href={`/orders/${order.id}/pay`}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-extrabold text-primary-foreground shadow-md shadow-primary/25 transition active:scale-95 hover:bg-primary/90"
            >
              Pay ₱{Number(order.total).toFixed(2)}
            </Link>
          </div>
        )}

        {/* Order summary */}
        <div className={cardClass}>
          <div className="flex items-center gap-3 border-b border-border pb-3">
            {order.sellerStoreImage ? (
              <img
                src={order.sellerStoreImage}
                alt={storeName}
                className="h-10 w-10 shrink-0 rounded-xl border border-border object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Store className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h2 className={`${cardTitle} truncate`}>{storeName}</h2>
              <p className="text-xs text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
              <OrderStatusBadge status={currentStatus} size="sm" />
            </div>
          </div>

          <ul className="divide-y divide-border/60">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                {item.products?.image_url ? (
                  <img
                    src={item.products.image_url}
                    alt={item.products.name}
                    className="h-12 w-12 shrink-0 rounded-xl border border-border object-cover"
                  />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/60 text-lg">
                    🥧
                  </span>
                )}
                <span className="flex h-6 min-w-[28px] shrink-0 items-center justify-center rounded-md border border-border px-1.5 text-xs font-extrabold text-foreground">
                  {item.quantity}x
                </span>
                <span className="min-w-0 flex-1 text-sm font-semibold text-foreground">
                  {item.products?.name ?? "Delicacy"}
                </span>
                <span className="shrink-0 text-sm font-bold text-foreground">
                  ₱{(Number(item.unit_price) * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment summary */}
        <div className={`${cardClass} space-y-3`}>
          <h2 className={`${cardTitle} flex items-center gap-2`}>
            <Receipt className="h-4 w-4 text-primary" aria-hidden="true" />
            Payment summary
          </h2>

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Flat delivery fee</span>
              <span>₱{Number(order.delivery_fee).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2.5 text-base font-black text-foreground">
              <span>Total</span>
              <span>₱{Number(order.total).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/60 px-3 py-2.5">
            <span className="flex items-center gap-2 text-xs font-bold text-foreground">
              {isMockpay ? (
                <CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />
              ) : (
                <Banknote className="h-4 w-4 text-primary" aria-hidden="true" />
              )}
              {isMockpay ? "MockPay (simulated)" : "Cash on delivery"}
            </span>
            <PaymentBadge
              status={order.payment_status as PaymentStatus}
              method={order.payment_method as PaymentMethod}
              size="sm"
            />
          </div>
        </div>

        {/* Delivery details */}
        <div className={`${cardClass} space-y-3`}>
          <h2 className={`${cardTitle} flex items-center gap-2`}>
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            Delivery details
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-[11px] text-muted-foreground">Recipient</dt>
              <dd className="font-bold text-foreground">{order.delivery_name}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">Contact number</dt>
              <dd>
                <a
                  href={`tel:${order.delivery_phone}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:underline"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {order.delivery_phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">Address</dt>
              <dd className="font-semibold leading-relaxed text-foreground">
                {order.delivery_address}
              </dd>
            </div>
          </dl>
        </div>

        {/* Spacer on mobile when pay button is sticky */}
        {canPay && <div className="h-20 sm:hidden" aria-hidden="true" />}
      </section>

      {/* Sticky bottom Pay bar — mobile only, positioned right above the mobile bottom nav bar */}
      {canPay && (
        <div className="fixed bottom-20 left-0 right-0 z-30 px-4 pointer-events-none sm:hidden animate-in slide-in-from-bottom-3 duration-200">
          <Link
            href={`/orders/${order.id}/pay`}
            className="pointer-events-auto flex h-13 w-full max-w-md mx-auto items-center justify-between rounded-full bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground shadow-xl shadow-primary/30 transition active:scale-[0.98] hover:bg-primary/90"
          >
            <span>Pay with MockPay</span>
            <span className="font-black text-base">₱{Number(order.total).toFixed(2)} →</span>
          </Link>
        </div>
      )}
    </div>
  );
}