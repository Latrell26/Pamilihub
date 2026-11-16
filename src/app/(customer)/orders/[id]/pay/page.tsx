import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Store,
  Receipt,
  Banknote,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { getOrderById } from "@/modules/orders/queries";
import { getHeaderUser } from "@/lib/auth/header-user";
import PayButton from "./PayButton";
import { OrderStatusBadge, PaymentBadge } from "@/components/seller/orders/StatusBadge";
import type { OrderStatus, PaymentStatus, PaymentMethod } from "@/modules/orders/types";

type StatusScreenProps = {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: React.ReactNode;
  href: string;
  cta: string;
  backHref?: string;
  orderId?: string;
};

function StatusScreen({
  variant,
  title,
  message,
  href,
  cta,
  backHref = "/orders",
  orderId,
}: StatusScreenProps) {
  const variantStyles = {
    success: {
      bg: "bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400",
      button: "bg-emerald-600 hover:bg-emerald-700 text-white",
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      icon: CheckCircle2,
    },
    error: {
      bg: "bg-red-500/10 border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400",
      button: "bg-red-600 hover:bg-red-700 text-white",
      badge: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
      icon: XCircle,
    },
    warning: {
      bg: "bg-amber-500/10 border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400",
      button: "bg-amber-600 hover:bg-amber-700 text-white",
      badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
      icon: Banknote,
    },
    info: {
      bg: "bg-primary/10 border-primary/20 text-primary",
      button: "bg-primary hover:bg-primary/90 text-primary-foreground",
      badge: "bg-primary/10 text-primary",
      icon: Lock,
    },
  }[variant];

  const IconComponent = variantStyles.icon;

  return (
    <div className="mx-auto max-w-3xl lg:px-8 lg:py-6 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <section className="bg-primary px-4 pb-14 pt-4 text-primary-foreground sm:px-6 lg:rounded-3xl">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            aria-label="Back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-md transition active:scale-90"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <p className="text-sm font-bold text-white/90">
            {orderId ? `Order #${orderId.slice(0, 8).toUpperCase()}` : "Pamilihub Payment"}
          </p>
        </div>

        <h1 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
          Transaction Status
        </h1>
        <p className="mt-1 text-sm text-white/90">
          Simulated MockPay Gateway verification
        </p>
      </section>

      {/* Overlapping Content Sheet */}
      <section className="-mt-8 space-y-4 rounded-t-[2rem] bg-background px-4 pb-12 pt-6 sm:px-6 lg:rounded-b-3xl">
        <div className="max-w-md mx-auto rounded-3xl border border-border/60 bg-card p-6 sm:p-8 text-center shadow-sm space-y-5">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border shadow-inner ${variantStyles.bg}`}
          >
            <IconComponent className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-foreground tracking-tight">
              {title}
            </h2>
            <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {message}
            </div>
          </div>

          <Link
            href={href}
            className={`flex h-12 w-full items-center justify-center rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition active:scale-[0.98] ${variantStyles.button}`}
          >
            {cta}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default async function OrderPayPage({
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
      <StatusScreen
        variant="info"
        title="Sign in required"
        message="Please sign in to proceed with simulated payment."
        href="/login"
        cta="Sign In to Continue"
      />
    );
  }

  if (!order) {
    return (
      <StatusScreen
        variant="error"
        title="Order not found"
        message="We could not find this order record in our database."
        href="/orders"
        cta="Back to Orders"
      />
    );
  }

  // Access control — only the customer who placed the order may submit payment
  const isOwner = order.customer_id === user.id;
  if (!isOwner) {
    return (
      <StatusScreen
        variant="error"
        title="Not authorized"
        message="You do not have permission to pay for this customer order."
        href="/orders"
        cta="Back to Orders"
        backHref="/orders"
        orderId={order.id}
      />
    );
  }

  // Cash on delivery handler
  if (order.payment_method !== "mockpay") {
    return (
      <StatusScreen
        variant="warning"
        title="Cash on Delivery order"
        message="This order was placed under Cash on Delivery. Payment is made directly to the seller upon delivery."
        href={`/orders/${order.id}`}
        cta="View Order Status"
        backHref={`/orders/${order.id}`}
        orderId={order.id}
      />
    );
  }

  // Block payment if the order is already terminal (rejected/cancelled/completed)
  const terminalStatuses = ["rejected", "cancelled", "completed"];
  if (terminalStatuses.includes(order.order_status)) {
    return (
      <StatusScreen
        variant="error"
        title="Order already closed"
        message={
          <>
            This order is currently{" "}
            <strong className="capitalize text-red-600 font-bold">
              {order.order_status}
            </strong>{" "}
            and cannot be paid anymore.
          </>
        }
        href={`/orders/${order.id}`}
        cta="View Order Status"
        backHref={`/orders/${order.id}`}
        orderId={order.id}
      />
    );
  }

  // Payment status already recorded
  if (order.payment_status !== "pending") {
    return (
      <StatusScreen
        variant="success"
        title="Payment already recorded"
        message={
          <>
            The payment for this order is already{" "}
            <strong className="capitalize text-emerald-600 font-bold">
              {order.payment_status}
            </strong>
            . The seller has been notified to proceed.
          </>
        }
        href={`/orders/${order.id}`}
        cta="View Order Status"
        backHref={`/orders/${order.id}`}
        orderId={order.id}
      />
    );
  }

  const items = order.order_items ?? [];
  const subtotal = items.reduce(
    (acc, i) => acc + Number(i.unit_price) * i.quantity,
    0
  );
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const cardClass = "rounded-3xl border border-border/60 bg-card p-5 shadow-sm";
  const cardTitle = "text-sm font-extrabold text-foreground";

  return (
    <div className="mx-auto max-w-3xl lg:px-8 lg:py-6 animate-in fade-in duration-300">
      {/* Brand Hero Header */}
      <section className="bg-primary px-4 pb-14 pt-4 text-primary-foreground sm:px-6 lg:rounded-3xl">
        <div className="flex items-center gap-3">
          <Link
            href={`/orders/${order.id}`}
            aria-label="Back to order details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-md transition active:scale-90"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white/90">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <h1 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
          Simulated Payment
        </h1>
        <p className="mt-1 text-sm text-white/90">
          Review and confirm your MockPay payment for this order.
        </p>
      </section>

      {/* Overlapping Content Sheet */}
      <section className="-mt-8 space-y-4 rounded-t-[2rem] bg-background px-4 pb-12 pt-5 sm:px-6 lg:rounded-b-3xl">
        {/* Merchant & Order Summary Card */}
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
                {order.sellerStoreImage ? (
                  <img
                    src={order.sellerStoreImage}
                    alt={order.sellerStoreName || "Store"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-extrabold text-foreground">
                  {order.sellerStoreName || "Local Delicacy Merchant"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {itemCount} {itemCount === 1 ? "delicacy item" : "delicacy items"}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-end gap-1">
              <OrderStatusBadge status={order.order_status as OrderStatus} />
              <PaymentBadge
                status={order.payment_status as PaymentStatus}
                method={order.payment_method as PaymentMethod}
              />
            </div>
          </div>

          <div className="pt-3 divide-y divide-border/30">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 text-xs">
                <span className="text-foreground">
                  {item.quantity}× {item.products?.name ?? "Delicacy Item"}
                </span>
                <span className="font-semibold text-muted-foreground">
                  ₱{(Number(item.unit_price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Card */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-3">
            <h2 className={cardTitle}>Payment Method</h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5" />
              Simulated Sandbox
            </span>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border-2 border-primary bg-primary/5 p-4 shadow-xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-foreground">MockPay Gateway</p>
              <p className="text-xs text-muted-foreground">
                Simulated zero-cost checkout for testing platform order flow
              </p>
            </div>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
          </div>
        </div>

        {/* Bill Details Card */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-3">
            <Receipt className="h-4 w-4 text-primary" />
            <h2 className={cardTitle}>Bill Details</h2>
          </div>

          <dl className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Subtotal</dt>
              <dd className="font-semibold text-foreground">₱{subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Delivery fee</dt>
              <dd className="font-semibold text-foreground">
                ₱{Number(order.delivery_fee).toFixed(2)}
              </dd>
            </div>
          </dl>

          <div className="mt-3 flex items-center justify-between border-t border-dashed border-border pt-3">
            <span className="text-sm font-bold text-foreground">Total to Pay</span>
            <span className="text-xl font-black text-primary">
              ₱{Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Card with Green Approve & Red Cancel */}
        <div className={cardClass}>
          <h2 className={`${cardTitle} mb-3`}>Confirm Simulated Transaction</h2>
          <PayButton orderId={order.id} amount={Number(order.total)} />
        </div>

        {/* Return Button */}
        <div className="pt-2 text-center">
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex items-center justify-center h-11 px-6 rounded-2xl border border-border/80 bg-card hover:bg-muted text-xs font-bold text-foreground transition active:scale-95 shadow-xs"
          >
            ← Return to Order Details
          </Link>
        </div>
      </section>
    </div>
  );
}
