import Link from "next/link";
import { getAdminOrders } from "@/modules/admin/queries";
import AdminNav from "@/components/admin/AdminNav";

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
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-[11px] font-bold text-primary mb-1">
          <span>📦</span>
          <span>Order Monitoring</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Platform Orders & Payment Audit
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Real-time oversight of all customer orders, delivery states, and payment flows.
        </p>
      </div>

      <AdminNav />

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-3">
        <form method="GET" className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search by customer name, store, phone, or order ID..."
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            name="orderStatus"
            defaultValue={orderStatus ?? "all"}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {orderStatuses.map((s) => (
              <option key={s.value} value={s.value}>
                Order: {s.label}
              </option>
            ))}
          </select>

          <select
            name="paymentStatus"
            defaultValue={paymentStatus ?? "all"}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {paymentStatuses.map((p) => (
              <option key={p.value} value={p.value}>
                Payment: {p.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
          >
            Filter
          </button>

          {(orderStatus || paymentStatus || search) && (
            <Link
              href="/admin/orders"
              className="px-3 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground text-center"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>Showing {orders.length} order{orders.length === 1 ? "" : "s"}</span>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center space-y-2">
            <p className="text-sm font-bold text-foreground">No orders match criteria</p>
            <p className="text-xs text-muted-foreground">Try clearing filters or search keywords.</p>
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
                  className="rounded-2xl border border-border bg-card shadow-sm p-4 sm:p-6 space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-xs text-muted-foreground">{dateStr}</span>
                      <span className="text-xs font-semibold text-muted-foreground">•</span>
                      <span className="text-xs font-extrabold text-foreground">
                        {order.seller?.store_name ?? "Store"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Payment Status Badge */}
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          order.payment_status === "paid"
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                            : order.payment_status === "refunded"
                            ? "bg-purple-500/10 text-purple-700 border-purple-500/20"
                            : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                        }`}
                      >
                        Payment: {order.payment_status} ({order.payment_method})
                      </span>

                      {/* Order Status Badge */}
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          order.order_status === "completed"
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                            : order.order_status === "cancelled" || order.order_status === "rejected"
                            ? "bg-rose-500/10 text-rose-700 border-rose-500/20"
                            : "bg-blue-500/10 text-blue-700 border-blue-500/20"
                        }`}
                      >
                        Order: {order.order_status}
                      </span>
                    </div>
                  </div>

                  {/* Customer Delivery Details & Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                      <p className="font-bold text-foreground text-[11px] uppercase tracking-wider text-muted-foreground">
                        Delivery Destination
                      </p>
                      <p className="font-bold text-foreground">{order.delivery_name}</p>
                      <p className="text-muted-foreground font-mono">{order.delivery_phone}</p>
                      <p className="text-muted-foreground">{order.delivery_address}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                      <p className="font-bold text-foreground text-[11px] uppercase tracking-wider text-muted-foreground">
                        Financial Breakdown
                      </p>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Items Subtotal:</span>
                        <span>₱{(Number(order.total) - Number(order.delivery_fee)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Delivery Fee (Flat):</span>
                        <span>₱{Number(order.delivery_fee).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-black text-foreground pt-1 border-t border-border">
                        <span>Grand Total:</span>
                        <span className="text-primary font-black">₱{Number(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Ordered Items ({order.order_items.length})
                    </p>
                    <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-background">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2.5 sm:p-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-foreground">
                              {item.product?.name ?? "Delicacy Item"}
                            </span>
                            <span className="text-muted-foreground">
                              × {item.quantity} @ ₱{Number(item.unit_price).toFixed(2)}
                            </span>
                          </div>
                          <span className="font-bold text-foreground">
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
