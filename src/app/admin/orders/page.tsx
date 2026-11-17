import Link from "next/link";
import { getAdminOrders } from "@/modules/admin/queries";
import AdminNav from "@/components/admin/AdminNav";
import { OrderStatusBadge, PaymentBadge } from "@/components/seller/orders/StatusBadge";
import type { OrderStatus, PaymentStatus, PaymentMethod } from "@/modules/orders/types";
import {
  Package,
  Search,
  RotateCcw,
  Store,
  MapPin,
  CreditCard,
  User,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminOrdersPageProps {
  searchParams: {
    orderStatus?: string;
    paymentStatus?: string;
    search?: string;
  };
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { orderStatus, paymentStatus, search } = searchParams;
  const orders = await getAdminOrders({ orderStatus, paymentStatus, search });

  const orderStatuses = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "preparing", label: "Preparing" },
    { value: "delivering", label: "Delivering" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "rejected", label: "Rejected" },
  ];

  const paymentStatuses = [
    { value: "all", label: "All Payments" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "refunded", label: "Refunded" },
    { value: "failed", label: "Failed" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/25 bg-red-500/10 text-[11px] font-black uppercase tracking-wider text-red-600 mb-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Platform Audit</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Orders & Payment Governance
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Real-time oversight of customer purchases, delivery statuses, and financial settlement across San Pablo stores.
        </p>
      </div>

      <AdminNav />

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-5 rounded-3xl border border-border/70 bg-card shadow-xs">
        <form method="GET" className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search by customer, store name, phone, or order ID..."
              className="h-11 w-full rounded-2xl border border-transparent bg-muted/70 pl-11 pr-4 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15"
            />
          </div>

          <select
            name="orderStatus"
            defaultValue={orderStatus ?? "all"}
            className="h-11 rounded-2xl border border-transparent bg-muted/70 px-4 text-xs font-bold text-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
          >
            {orderStatuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            name="paymentStatus"
            defaultValue={paymentStatus ?? "all"}
            className="h-11 rounded-2xl border border-transparent bg-muted/70 px-4 text-xs font-bold text-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
          >
            {paymentStatuses.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="h-11 px-6 rounded-full bg-primary text-xs font-extrabold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            Filter
          </button>

          {(orderStatus || paymentStatus || search) && (
            <Link
              href="/admin/orders"
              className="h-11 flex items-center justify-center gap-1.5 px-4 rounded-full border border-border/70 bg-card text-xs font-bold text-muted-foreground hover:text-foreground transition-all shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Link>
          )}
        </form>
      </div>

      {/* Orders List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span className="font-bold">
            Showing {orders.length} order{orders.length === 1 ? "" : "s"}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 rounded-3xl border border-border/70 bg-card text-center space-y-2 shadow-xs">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-muted/60 text-muted-foreground">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No orders match criteria</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Try adjusting your filter options or searching for a different customer name or store.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const dateStr = new Date(order.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              });

              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-border/70 bg-card shadow-xs p-5 sm:p-6 space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-foreground bg-muted/70 px-2.5 py-0.5 rounded-full border border-border/60">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">{dateStr}</span>
                      <span className="text-xs font-semibold text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5 font-black text-xs text-foreground">
                        <Store className="w-3.5 h-3.5 text-primary" />
                        <span>{order.seller?.store_name ?? "Store"}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <OrderStatusBadge status={order.order_status as OrderStatus} size="sm" />
                      <PaymentBadge
                        status={order.payment_status as PaymentStatus}
                        method={order.payment_method as PaymentMethod}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Customer Delivery Details & Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1.5">
                      <p className="font-black text-muted-foreground text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>Delivery Destination</span>
                      </p>
                      <p className="font-bold text-foreground text-sm">{order.delivery_name}</p>
                      <p className="text-muted-foreground font-mono">{order.delivery_phone}</p>
                      <p className="text-muted-foreground leading-relaxed">{order.delivery_address}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1.5">
                      <p className="font-black text-muted-foreground text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-primary" />
                        <span>Financial Summary</span>
                      </p>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Items Subtotal:</span>
                        <span>₱{(Number(order.total) - Number(order.delivery_fee)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Delivery Fee (Flat):</span>
                        <span>₱{Number(order.delivery_fee).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-black text-foreground pt-1.5 border-t border-border/50 text-sm">
                        <span>Grand Total:</span>
                        <span className="text-primary font-black">₱{Number(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                      Ordered Delicacies ({order.order_items.length})
                    </p>
                    <div className="divide-y divide-border/50 border border-border/60 rounded-2xl overflow-hidden bg-background">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-foreground">
                              {item.product?.name ?? "Delicacy Item"}
                            </span>
                            <span className="text-muted-foreground">
                              × {item.quantity} @ ₱{Number(item.unit_price).toFixed(2)}
                            </span>
                          </div>
                          <span className="font-black text-foreground">
                            ₱{(Number(item.unit_price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
