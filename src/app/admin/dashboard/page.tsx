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
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const metrics = await getAdminDashboardMetrics();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/25 bg-red-500/10 text-[11px] font-black uppercase tracking-wider text-red-600 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Control Panel & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Platform governance, merchant approvals, and real-time food delivery telemetry in San Pablo City.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {metrics.sellersCount.pending > 0 && (
            <Link
              href="/admin/sellers"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-extrabold shadow-sm transition-all hover:bg-amber-500/20 active:scale-95 animate-pulse"
            >
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>
                {metrics.sellersCount.pending} Pending Review{metrics.sellersCount.pending > 1 ? "s" : ""}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      <AdminNav />

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="p-5 sm:p-6 rounded-3xl border border-border/70 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Gross Merchandise Value
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            ₱{metrics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground font-medium">From completed food orders</p>
        </div>

        {/* Total Orders */}
        <div className="p-5 sm:p-6 rounded-3xl border border-border/70 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Total Orders
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            {metrics.ordersCount.total}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span className="text-emerald-600 font-bold">{metrics.ordersCount.completed} done</span>
            <span>•</span>
            <span className="text-amber-600 font-bold">
              {metrics.ordersCount.pending + metrics.ordersCount.accepted + metrics.ordersCount.preparing + metrics.ordersCount.delivering} active
            </span>
          </div>
        </div>

        {/* Merchants */}
        <div className="p-5 sm:p-6 rounded-3xl border border-border/70 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Local Merchants
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            {metrics.sellersCount.approved}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {metrics.sellersCount.pending} pending • {metrics.sellersCount.total} registered
          </p>
        </div>

        {/* Catalog Items */}
        <div className="p-5 sm:p-6 rounded-3xl border border-border/70 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Food Catalog
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            {metrics.productsCount.total}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            <span className="text-emerald-600 font-bold">{metrics.productsCount.inStock} in stock</span> • {metrics.productsCount.outOfStock} sold out
          </p>
        </div>
      </div>

      {/* Fulfillment Status Pipeline */}
      <div className="p-5 sm:p-6 rounded-3xl border border-border/70 bg-card shadow-xs space-y-3.5">
        <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>Fulfillment Status Pipeline</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="block text-[11px] font-bold uppercase text-amber-700 dark:text-amber-400">Placed</span>
            <span className="text-xl font-black text-amber-900 dark:text-amber-200">{metrics.ordersCount.pending}</span>
          </div>
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-center">
            <span className="block text-[11px] font-bold uppercase text-primary">Accepted</span>
            <span className="text-xl font-black text-primary">{metrics.ordersCount.accepted}</span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <span className="block text-[11px] font-bold uppercase text-indigo-700 dark:text-indigo-400">Preparing</span>
            <span className="text-xl font-black text-indigo-900 dark:text-indigo-200">{metrics.ordersCount.preparing}</span>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
            <span className="block text-[11px] font-bold uppercase text-purple-700 dark:text-purple-400">Delivering</span>
            <span className="text-xl font-black text-purple-900 dark:text-purple-200">{metrics.ordersCount.delivering}</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="block text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400">Completed</span>
            <span className="text-xl font-black text-emerald-900 dark:text-emerald-200">{metrics.ordersCount.completed}</span>
          </div>
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
            <span className="block text-[11px] font-bold uppercase text-red-700 dark:text-red-400">Cancelled / Rej</span>
            <span className="text-xl font-black text-red-900 dark:text-red-200">
              {metrics.ordersCount.cancelled + metrics.ordersCount.rejected}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Orders & Pending Merchant Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="rounded-3xl border border-border/70 bg-card shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <h2 className="font-black text-foreground text-sm sm:text-base">
                Recent Orders
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {metrics.recentOrders.length === 0 ? (
            <p className="text-xs text-muted-foreground py-8 text-center">No orders placed yet.</p>
          ) : (
            <div className="space-y-2.5">
              {metrics.recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors text-xs"
                >
                  <div className="space-y-0.5 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-foreground truncate">
                        {ord.seller?.store_name ?? "Store"}
                      </span>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-card border border-border/60 text-muted-foreground">
                        {ord.payment_method}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      To: {ord.delivery_name} • {new Date(ord.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right whitespace-nowrap shrink-0">
                    <span className="font-black text-foreground text-sm block">₱{Number(ord.total).toFixed(2)}</span>
                    <span className="text-[10px] capitalize font-bold text-muted-foreground">
                      {ord.order_status} • {ord.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Seller Approvals */}
        <div className="rounded-3xl border border-border/70 bg-card shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h2 className="font-black text-foreground text-sm sm:text-base">
                Pending Merchant Applications
              </h2>
            </div>
            <Link
              href="/admin/sellers"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <span>Review list</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {metrics.pendingSellers.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-border/70 bg-muted/10 text-center space-y-2">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-foreground">All caught up!</p>
              <p className="text-[11px] text-muted-foreground">No pending merchant applications awaiting review.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {metrics.pendingSellers.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-amber-500/25 bg-amber-500/5 text-xs"
                >
                  <div className="space-y-0.5 min-w-0 pr-3">
                    <p className="font-extrabold text-foreground truncate">{s.store_name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Owner: {s.profile?.full_name ?? "Unnamed"} • {s.location ?? "San Pablo City"}
                    </p>
                  </div>
                  <Link
                    href="/admin/sellers"
                    className="px-3.5 py-1.5 rounded-full bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shrink-0 shadow-xs"
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
