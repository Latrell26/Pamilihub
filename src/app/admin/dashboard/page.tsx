import Link from "next/link";
import { getAdminDashboardMetrics } from "@/modules/admin/queries";
import AdminNav from "@/components/admin/AdminNav";
import {
  ShieldCheck,
  TrendingUp,
  Package,
  Store,
  UtensilsCrossed,
  ArrowRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const metrics = await getAdminDashboardMetrics();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-[11px] font-bold text-primary mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Pamilihub Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Platform metrics, merchant governance, and live food delivery transactions across San Pablo City.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {metrics.sellersCount.pending > 0 && (
            <Link
              href="/admin/sellers"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-bold animate-pulse"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{metrics.sellersCount.pending} Pending Application{metrics.sellersCount.pending > 1 ? "s" : ""}</span>
            </Link>
          )}
        </div>
      </div>

      <AdminNav />

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* GMV */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Sales (GMV)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            ₱{metrics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-muted-foreground">From paid & completed deliveries</p>
        </div>

        {/* Total Orders */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Platform Orders</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {metrics.ordersCount.total}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="text-emerald-600 font-bold">{metrics.ordersCount.completed} completed</span>
            <span>•</span>
            <span className="text-amber-600 font-semibold">{metrics.ordersCount.pending + metrics.ordersCount.accepted + metrics.ordersCount.preparing + metrics.ordersCount.delivering} active</span>
          </div>
        </div>

        {/* Merchants */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Local Merchants</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {metrics.sellersCount.approved}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {metrics.sellersCount.pending} pending review • {metrics.sellersCount.total} registered
          </p>
        </div>

        {/* Catalog Items */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Food Catalog</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {metrics.productsCount.total}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {metrics.productsCount.inStock} ready for order • {metrics.productsCount.outOfStock} out of stock
          </p>
        </div>
      </div>

      {/* Secondary Status Breakdown Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Order Fulfillment Status Pipeline</span>
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="block text-xs font-semibold text-amber-700">Pending</span>
            <span className="text-lg font-black text-amber-900">{metrics.ordersCount.pending}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
            <span className="block text-xs font-semibold text-blue-700">Accepted</span>
            <span className="text-lg font-black text-blue-900">{metrics.ordersCount.accepted}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <span className="block text-xs font-semibold text-indigo-700">Preparing</span>
            <span className="text-lg font-black text-indigo-900">{metrics.ordersCount.preparing}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <span className="block text-xs font-semibold text-purple-700">Delivering</span>
            <span className="text-lg font-black text-purple-900">{metrics.ordersCount.delivering}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="block text-xs font-semibold text-emerald-700">Completed</span>
            <span className="text-lg font-black text-emerald-900">{metrics.ordersCount.completed}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <span className="block text-xs font-semibold text-rose-700">Cancelled / Rej</span>
            <span className="text-lg font-black text-rose-900">{metrics.ordersCount.cancelled + metrics.ordersCount.rejected}</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Orders & Pending Merchant Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-foreground text-sm sm:text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <span>Recent Orders</span>
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all orders</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {metrics.recentOrders.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">No orders placed yet.</p>
          ) : (
            <div className="space-y-2.5">
              {metrics.recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 text-xs"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {ord.seller?.store_name ?? "Store"}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-muted border border-border">
                        {ord.payment_method}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      To: {ord.delivery_name} • {new Date(ord.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className="font-black text-foreground">₱{Number(ord.total).toFixed(2)}</span>
                    <span className="block text-[10px] capitalize font-semibold text-muted-foreground">
                      {ord.order_status} ({ord.payment_status})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Seller Approvals */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-foreground text-sm sm:text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Pending Seller Applications</span>
            </h2>
            <Link
              href="/admin/sellers"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Review all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {metrics.pendingSellers.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-border text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-foreground">All caught up!</p>
              <p className="text-[11px] text-muted-foreground">No pending merchant applications to review.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {metrics.pendingSellers.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <p className="font-bold text-foreground truncate">{s.store_name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Owner: {s.profile?.full_name ?? "Unnamed"} • {s.location ?? "San Pablo City"}
                    </p>
                  </div>
                  <Link
                    href="/admin/sellers"
                    className="px-2.5 py-1 rounded-lg bg-primary text-[11px] font-bold text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
