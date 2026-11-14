import Link from "next/link";
import { getOrderById } from "@/modules/orders/queries";
import { getHeaderUser } from "@/lib/auth/header-user";
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
  pending: "Order Placed",
  accepted: "Accepted",
  preparing: "Preparing",
  delivering: "Out for Delivery",
  completed: "Delivered",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getHeaderUser();
  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Sign in required</h1>
        <p className="text-xs text-muted-foreground">Please sign in to view your order details.</p>
        <Link href="/login" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          Sign In
        </Link>
      </div>
    );
  }

  const order = await getOrderById(params.id);

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Order not found</h1>
        <p className="text-xs text-muted-foreground">We couldn&#39;t locate this order in our system.</p>
        <Link href="/orders" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          Back to Orders
        </Link>
      </div>
    );
  }

  // Access control
  const isOwner = order.customer_id === user.id;
  const isSeller = user.role === "seller" && order.sellerStoreName !== null;
  if (!isOwner && user.role !== "admin" && !isSeller) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Not authorized</h1>
        <p className="text-xs text-muted-foreground">You don&#39;t have permission to view this order.</p>
        <Link href="/orders" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          Back to Orders
        </Link>
      </div>
    );
  }

  const items = order.order_items ?? [];
  const subtotal = items.reduce(
    (acc, i) => acc + Number(i.unit_price) * i.quantity,
    0
  );
  const canPay = order.payment_method === "mockpay" && order.payment_status === "pending";
  const currentStatus = order.order_status as OrderStatus;
  const isTerminal = currentStatus === "rejected" || currentStatus === "cancelled";
  const currentIndex = TIMELINE_STEPS.indexOf(currentStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/orders"
          className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <span>← Back to My Orders</span>
        </Link>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={currentStatus} size="md" />
          <PaymentBadge
            status={order.payment_status as PaymentStatus}
            method={order.payment_method as PaymentMethod}
            size="md"
          />
        </div>
      </div>

      {/* Main Order Header */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Seller:</span>
            <span className="font-semibold text-foreground px-2.5 py-1 rounded-md bg-muted">
              🏪 {order.sellerStoreName || "Local Seller"}
            </span>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Order Status Progress
          </h2>
          {isTerminal ? (
            <div
              className={`p-3 rounded-xl border text-xs font-medium text-center ${
                currentStatus === "rejected"
                  ? "bg-red-50 text-red-800 border-red-200"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              Order has been {currentStatus === "rejected" ? "rejected by the seller" : "cancelled"}. Any stock has been restored.
            </div>
          ) : (
            <div className="pt-2 pb-4">
              <div className="flex items-center justify-between relative">
                {TIMELINE_STEPS.map((step, idx) => {
                  const done = currentIndex > idx;
                  const active = currentIndex === idx;

                  return (
                    <div key={step} className="flex-1 flex flex-col items-center relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors ${
                          done
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : active
                            ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20"
                            : "bg-card border-border text-muted-foreground"
                        }`}
                      >
                        {done ? "✓" : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs text-center mt-2 font-medium max-w-[70px] ${
                          active ? "text-foreground font-bold" : "text-muted-foreground"
                        }`}
                      >
                        {STEP_LABELS[step]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pay Now Banner (MockPay Pending) */}
      {canPay && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-blue-900">Payment Awaiting Confirmation</h3>
            <p className="text-xs text-blue-700">
              This order is currently pending simulated payment. Click below to approve or cancel in MockPay.
            </p>
          </div>
          <Link
            href={`/orders/${order.id}/pay`}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-xs font-bold text-white shadow hover:bg-blue-700 transition-all text-center shrink-0"
          >
            Launch MockPay (₱{Number(order.total).toFixed(2)})
          </Link>
        </div>
      )}

      {/* Items & Delivery Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left (2 cols): Ordered Items */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border bg-muted/20">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ordered Delicacies ({items.length})
            </h2>
          </div>
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {item.products?.image_url ? (
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-14 h-14 rounded-xl object-cover border border-border"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-muted/60 border border-border flex items-center justify-center text-lg">
                      🥧
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm text-foreground">
                      {item.products?.name ?? "Delicacy"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Quantity: {item.quantity} × ₱{Number(item.unit_price).toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-sm text-foreground">
                  ₱{(Number(item.unit_price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="p-5 bg-muted/10 border-t border-border space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Items Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Flat Delivery Fee</span>
              <span>₱{Number(order.delivery_fee).toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between text-sm font-bold text-foreground">
              <span>Total</span>
              <span className="text-base font-extrabold">₱{Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right (1 col): Delivery Address & Customer Info */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
            Delivery Information
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Recipient</span>
              <span className="font-semibold text-foreground text-sm">{order.delivery_name}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Contact Number</span>
              <a href={`tel:${order.delivery_phone}`} className="font-medium text-foreground hover:underline">
                📞 {order.delivery_phone}
              </a>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Delivery Address</span>
              <span className="font-medium text-foreground leading-relaxed block mt-0.5">
                📍 {order.delivery_address}
              </span>
            </div>
            <div className="pt-2 border-t border-border">
              <span className="text-muted-foreground block text-[11px]">Payment Method</span>
              <span className="font-semibold text-foreground uppercase tracking-wide">
                {order.payment_method === "mockpay" ? "MockPay (Simulated)" : "Cash on Delivery"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
