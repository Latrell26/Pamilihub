"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Store,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { OrderStatusBadge, PaymentBadge } from "@/components/seller/orders/StatusBadge";
import type { OrderWithItems } from "@/modules/orders/queries";
import type { OrderStatus, PaymentStatus, PaymentMethod } from "@/modules/orders/types";

const PAST_STATUSES = new Set([
  "delivered",
  "completed",
  "cancelled",
  "canceled",
  "rejected",
  "declined",
  "failed",
]);

const ORDERS_PER_PAGE = 5;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * ONE_DAY_MS;

type PastCategory = "all" | "day" | "week" | "older";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("fil-PH", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function OrdersClientView({
  orders,
  initialTab = "active",
}: {
  orders: OrderWithItems[];
  initialTab?: "active" | "past";
}) {
  const router = useRouter();

  const isPast = (status: string) => PAST_STATUSES.has(String(status).toLowerCase());

  const activeOrders = useMemo(
    () => orders.filter((o) => !isPast(o.order_status)),
    [orders]
  );

  const pastOrders = useMemo(
    () => orders.filter((o) => isPast(o.order_status)),
    [orders]
  );

  // If initialTab wasn't specified and there are no active orders but past orders exist, default to past tab
  const defaultTab =
    initialTab === "past" || (activeOrders.length === 0 && pastOrders.length > 0)
      ? "past"
      : "active";

  const [tab, setTab] = useState<"active" | "past">(defaultTab);
  const [pastCategory, setPastCategory] = useState<PastCategory>("all");
  const [currentPage, setCurrentPage] = useState(1);

  function orderAgain(order: OrderWithItems) {
    // Store re-order items in sessionStorage — completely separate from the main cart
    const reorderItems = (order.order_items ?? []).map((item) => ({
      productId: item.product_id,
      name: item.products?.name ?? "Item",
      price: Number(item.unit_price),
      stock: 999,
      sellerId: order.seller_id,
      sellerName: order.sellerStoreName ?? "San Pablo Merchant",
      imageUrl: item.products?.image_url ?? null,
      quantity: item.quantity,
    }));
    sessionStorage.setItem("pamilihub_reorder", JSON.stringify(reorderItems));
    router.push("/cart?reorder=1");
  }

  // Group past orders into timeframe buckets
  const { lastDayCount, lastWeekCount, olderCount } = useMemo(() => {
    const now = Date.now();
    let day = 0;
    let week = 0;
    let older = 0;

    for (const o of pastOrders) {
      const diff = now - new Date(o.created_at).getTime();
      if (diff <= ONE_DAY_MS) {
        day++;
        week++; // also within week
      } else if (diff <= ONE_WEEK_MS) {
        week++;
      } else {
        older++;
      }
    }

    return { lastDayCount: day, lastWeekCount: week, olderCount: older };
  }, [pastOrders]);

  // Filtered list based on active tab and pastCategory
  const displayedOrders = useMemo(() => {
    if (tab === "active") return activeOrders;

    const now = Date.now();
    if (pastCategory === "day") {
      return pastOrders.filter(
        (o) => now - new Date(o.created_at).getTime() <= ONE_DAY_MS
      );
    }
    if (pastCategory === "week") {
      return pastOrders.filter(
        (o) => now - new Date(o.created_at).getTime() <= ONE_WEEK_MS
      );
    }
    if (pastCategory === "older") {
      return pastOrders.filter(
        (o) => now - new Date(o.created_at).getTime() > ONE_WEEK_MS
      );
    }
    return pastOrders;
  }, [tab, pastCategory, activeOrders, pastOrders]);

  // Reset to page 1 whenever tab or filter category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tab, pastCategory]);

  // Pagination calculation
  const totalPages = Math.ceil(displayedOrders.length / ORDERS_PER_PAGE) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ORDERS_PER_PAGE;
    return displayedOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [displayedOrders, currentPage]);

  const tabClass = (active: boolean) =>
    `flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full text-xs sm:text-sm font-extrabold transition-all active:scale-[0.98] ${
      active
        ? "bg-foreground text-background shadow-sm"
        : "text-muted-foreground hover:text-foreground"
    }`;

  const categoryBtnClass = (active: boolean) =>
    `shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 ${
      active
        ? "bg-primary text-primary-foreground shadow-sm"
        : "border border-border/70 bg-card text-muted-foreground hover:text-foreground hover:border-border"
    }`;

  return (
    <div className="mx-auto max-w-3xl pb-4">
      {/* Sticky Top Header with Back Button to Delicacies */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60">
        <div className="mx-auto max-w-3xl flex items-center gap-3 px-4 py-3">
          <Link
            href="/products"
            aria-label="Back to delicacies"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card text-foreground shadow-sm transition active:scale-90 hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-black leading-tight text-foreground">
              My Orders
            </h1>
            
          </div>
        </div>
      </div>

      {/* Main Tabs (Active vs Past) */}
      <div className="space-y-3 bg-muted/40 px-4 pb-4 pt-4">
        <div className="flex gap-1 rounded-full border border-border/50 bg-muted p-1">
          <button
            type="button"
            onClick={() => setTab("active")}
            className={tabClass(tab === "active")}
            aria-current={tab === "active" ? "page" : undefined}
          >
            Active
            {activeOrders.length > 0 && (
              <span className="opacity-80">({activeOrders.length})</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setTab("past")}
            className={tabClass(tab === "past")}
            aria-current={tab === "past" ? "page" : undefined}
          >
            Past orders
            {pastOrders.length > 0 && (
              <span className="opacity-80">({pastOrders.length})</span>
            )}
          </button>
        </div>

        {/* Categories / Timeframe Pagination Filter (only shown on Past orders) */}
        {tab === "past" && (
          <div className="pt-1">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setPastCategory("all")}
                className={categoryBtnClass(pastCategory === "all")}
              >
                All Past ({pastOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setPastCategory("day")}
                className={categoryBtnClass(pastCategory === "day")}
              >
                Last Day ({lastDayCount})
              </button>
              <button
                type="button"
                onClick={() => setPastCategory("week")}
                className={categoryBtnClass(pastCategory === "week")}
              >
                Last Week ({lastWeekCount})
              </button>
              <button
                type="button"
                onClick={() => setPastCategory("older")}
                className={categoryBtnClass(pastCategory === "older")}
              >
                Older ({olderCount})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders List Content */}
      <div className="space-y-4 px-4 pt-4">
        {displayedOrders.length === 0 ? (
          <div className="mx-auto max-w-sm space-y-4 px-4 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
              {tab === "past" ? "🧾" : "📦"}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground">
                {tab === "past"
                  ? pastCategory === "all"
                    ? "No past orders yet"
                    : `No past orders in ${
                        pastCategory === "day"
                          ? "the last day"
                          : pastCategory === "week"
                          ? "the last week"
                          : "older records"
                      }`
                  : "No active orders"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tab === "past"
                  ? pastCategory === "all"
                    ? "Completed and cancelled orders will show up here."
                    : "Try selecting another timeframe category or view all past orders."
                  : "When you order delicacies from San Pablo food makers, track your delivery status here."}
              </p>
            </div>

            {tab === "past" && pastCategory !== "all" ? (
              <button
                type="button"
                onClick={() => setPastCategory("all")}
                className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-xs font-extrabold text-primary-foreground shadow-sm transition active:scale-95 hover:bg-primary/90"
              >
                View All Past Orders
              </button>
            ) : tab === "active" && pastOrders.length > 0 ? (
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTab("past")}
                  className="inline-flex h-11 items-center rounded-full bg-primary px-7 text-xs font-extrabold text-primary-foreground shadow-md shadow-primary/25 transition active:scale-95 hover:bg-primary/90"
                >
                  View Past Orders ({pastOrders.length})
                </button>
                <Link
                  href="/products"
                  className="text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Explore Delicacies
                </Link>
              </div>
            ) : tab === "past" && activeOrders.length > 0 ? (
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTab("active")}
                  className="inline-flex h-11 items-center rounded-full bg-primary px-7 text-xs font-extrabold text-primary-foreground shadow-md shadow-primary/25 transition active:scale-95 hover:bg-primary/90"
                >
                  View Active Orders ({activeOrders.length})
                </button>
                <Link
                  href="/products"
                  className="text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Explore Delicacies
                </Link>
              </div>
            ) : (
              <Link
                href="/products"
                className="inline-flex h-11 items-center rounded-full bg-primary px-7 text-xs font-extrabold text-primary-foreground shadow-md shadow-primary/25 transition active:scale-95 hover:bg-primary/90"
              >
                Explore Delicacies
              </Link>
            )}
          </div>
        ) : (
          <>
            {paginatedOrders.map((order) => {
              const shortId = `#${order.id.slice(0, 8).toUpperCase()}`;
              const items = order.order_items ?? [];
              const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
              const canPay =
                order.payment_method === "mockpay" && order.payment_status === "pending";
              const past = isPast(order.order_status);

              return (
                <section
                  key={order.id}
                  className="rounded-[2rem] border border-border/60 bg-card p-4 shadow-sm transition-colors hover:border-border"
                >
                  {/* Store header */}
                  <div className="flex items-start gap-3">
                    {order.sellerStoreImage ? (
                      <img
                        src={order.sellerStoreImage}
                        alt={order.sellerStoreName || "Store"}
                        className="h-12 w-12 shrink-0 rounded-2xl border border-border object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary">
                        <Store className="h-6 w-6" aria-hidden="true" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-base font-black leading-tight text-foreground">
                        {order.sellerStoreName || "San Pablo Merchant"}
                      </h2>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(order.created_at)} • {shortId}
                      </p>
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <OrderStatusBadge
                      status={order.order_status as OrderStatus}
                      size="sm"
                    />
                    <PaymentBadge
                      status={order.payment_status as PaymentStatus}
                      method={order.payment_method as PaymentMethod}
                      size="sm"
                    />
                  </div>

                  {/* Items summary */}
                  <p className="mt-3 line-clamp-2 text-xs font-medium text-foreground/80">
                    {items
                      .map((i) => `${i.quantity}x ${i.products?.name ?? "Item"}`)
                      .join(", ")}
                  </p>

                  {/* Total */}
                  <div className="mt-4 flex items-center justify-between border-t border-dashed border-border pt-3">
                    <span className="text-xs font-bold text-foreground">
                      Total{" "}
                      <span className="font-normal text-muted-foreground">
                        ({itemCount} item{itemCount !== 1 ? "s" : ""})
                      </span>
                    </span>
                    <span className="text-base font-black text-foreground">
                      ₱{Number(order.total).toFixed(2)}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex gap-2">
                    {canPay && (
                      <Link
                        href={`/orders/${order.id}/pay`}
                        className="flex h-11 flex-1 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground shadow-md shadow-primary/25 transition active:scale-[0.98] hover:bg-primary/90"
                      >
                        Pay now
                      </Link>
                    )}
                    {/* Order Again — only for past orders */}
                    {past && (
                      <button
                        type="button"
                        onClick={() => orderAgain(order)}
                        className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 text-xs font-extrabold text-primary transition active:scale-[0.98] hover:bg-primary/10"
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        Order again
                      </button>
                    )}
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-muted text-xs font-extrabold text-foreground transition active:scale-[0.98] hover:bg-muted/80"
                    >
                      {past ? "View details" : "Track order"}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </section>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border/60 pt-4 pb-2 px-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex items-center gap-1 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground shadow-sm transition active:scale-95 disabled:pointer-events-none disabled:opacity-40 hover:bg-muted"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </button>

                <span className="text-xs font-medium text-muted-foreground">
                  Page <span className="font-extrabold text-foreground">{currentPage}</span> of{" "}
                  <span className="font-extrabold text-foreground">{totalPages}</span>
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex items-center gap-1 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground shadow-sm transition active:scale-95 disabled:pointer-events-none disabled:opacity-40 hover:bg-muted"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
