"use client";

import type { OrderSummary } from "@/modules/orders/types";
import { OrderCard } from "./OrderCard";
import { OrderListSkeleton } from "./Skeletons";
import { Search, Inbox } from "lucide-react";

const FILTER_TABS: { label: string; value: string }[] = [
  { label: "All",       value: "all" },
  { label: "Pending",   value: "pending" },
  { label: "To Ship",   value: "to_ship" },
  { label: "Completed", value: "completed" },
];

function matchesFilter(order: OrderSummary, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "pending")
    return order.order_status === "pending" || order.order_status === "accepted";
  if (filter === "to_ship")
    return order.order_status === "preparing" || order.order_status === "delivering";
  if (filter === "completed")
    return (
      order.order_status === "completed" ||
      order.order_status === "rejected" ||
      order.order_status === "cancelled"
    );
  return true;
}

function matchesSearch(order: OrderSummary, q: string): boolean {
  if (!q.trim()) return true;
  const lower = q.toLowerCase();
  return (
    order.delivery_name.toLowerCase().includes(lower) ||
    order.id.toLowerCase().includes(lower)
  );
}

interface OrderListProps {
  orders: OrderSummary[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  filter: string;
  onFilterChange: (f: string) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

export function OrderList({
  orders,
  loading,
  selectedId,
  onSelect,
  filter,
  onFilterChange,
  search,
  onSearchChange,
}: OrderListProps) {
  const visible = orders
    .filter((o) => matchesFilter(o, filter))
    .filter((o) => matchesSearch(o, search));

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Search bar */}
      <div className="p-3">
        <label htmlFor="order-search" className="sr-only">
          Search orders
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="order-search"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by customer or order #..."
            className="h-10 w-full rounded-2xl border border-transparent bg-muted/70 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Order filters"
        className="flex gap-1.5 px-3 pb-3 border-b border-border/60 overflow-x-auto no-scrollbar"
      >
        {FILTER_TABS.map((tab) => {
          const count = orders.filter((o) => matchesFilter(o, tab.value)).length;
          const isActive = filter === tab.value;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(tab.value)}
              className={`
                flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer
                ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-background text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto py-2">
        {loading ? (
          <OrderListSkeleton />
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-foreground">No orders found</p>
            <p className="text-[11px] text-muted-foreground max-w-[200px]">
              {search
                ? "Try searching with a different name or order ID."
                : "New orders will appear here as customers place them."}
            </p>
          </div>
        ) : (
          visible.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isSelected={order.id === selectedId}
              onClick={() => onSelect(order.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
