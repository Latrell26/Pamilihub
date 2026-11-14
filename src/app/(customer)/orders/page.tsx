import Link from "next/link";
import { getCustomerOrders } from "@/modules/orders/queries";
import { getHeaderUser } from "@/lib/auth/header-user";
import { OrderStatusBadge, PaymentBadge } from "@/components/seller/orders/StatusBadge";
import type { OrderStatus, PaymentStatus, PaymentMethod } from "@/modules/orders/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fil-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export default async function OrdersPage() {
  const [user, orders] = await Promise.all([
    getHeaderUser(),
    getCustomerOrders(),
  ]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Sign in to view orders</h1>
        <p className="text-xs text-muted-foreground">
          Please sign in to access your order history and live delivery statuses.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 rounded-2xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3 px-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">My Orders</h1>
          <p className="text-xs text-muted-foreground">
            Track preparation and delivery of your food orders
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-primary hover:underline"
        >
          + Order Again
        </Link>
      </div>

      {(orders ?? []).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4 max-w-sm mx-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-3xl">
            📦
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-foreground text-sm">No orders yet</h3>
            <p className="text-xs text-muted-foreground">
              When you order delicacies from San Pablo sellers, your order status will appear here.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 rounded-2xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all active:scale-95"
          >
            Explore Delicacies
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {(orders ?? []).map((order) => {
            const shortId = `#${order.id.slice(0, 8).toUpperCase()}`;
            const items = order.order_items ?? [];
            const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
            const canPay = order.payment_method === "mockpay" && order.payment_status === "pending";

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all space-y-3"
              >
                {/* Store Header & Date */}
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">🏪</span>
                    <span className="font-black text-xs sm:text-sm text-foreground truncate">
                      {order.sellerStoreName || "San Pablo Merchant"}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">
                    {formatDate(order.created_at)}
                  </span>
                </div>

                {/* Items preview & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-muted-foreground">{shortId}</span>
                      <span className="text-[11px] text-muted-foreground">• {itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                    </div>

                    <p className="text-xs text-foreground font-medium truncate">
                      {items.map((i) => `${i.quantity}x ${i.products?.name ?? "Item"}`).join(", ")}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <OrderStatusBadge status={order.order_status as OrderStatus} size="sm" />
                      <PaymentBadge
                        status={order.payment_status as PaymentStatus}
                        method={order.payment_method as PaymentMethod}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    <div className="sm:text-right">
                      <span className="text-[10px] text-muted-foreground block">Total Amount</span>
                      <span className="text-base font-black text-foreground">
                        ₱{Number(order.total).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {canPay && (
                        <Link
                          href={`/orders/${order.id}/pay`}
                          className="px-3.5 py-1.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all active:scale-95"
                        >
                          Pay Now
                        </Link>
                      )}
                      <Link
                        href={`/orders/${order.id}`}
                        className="px-3.5 py-1.5 rounded-xl border border-border bg-background text-xs font-bold text-foreground hover:bg-muted transition-colors active:scale-95"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
