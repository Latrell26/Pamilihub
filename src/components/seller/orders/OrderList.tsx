"use client";

import type { OrderSummary, OrderStatus } from "@/modules/orders/types";
import { OrderCard } from "./OrderCard";
import { OrderListSkeleton } from "./Skeletons";

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
    return order.order_status === "completed" || order.order_status === "rejected" || order.order_status === "cancelled";
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
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="px-4 pt-4 pb-2">
        <label htmlFor="order-search" className="sr-only">
          Search orders
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.65 10.65Z"
            />
          </svg>
          <input
            id="order-search"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or order #"
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Order filters"
        className="flex gap-1 px-4 pb-2 border-b border-border"
      >
        {FILTER_TABS.map((tab) => {
          const count = orders.filter((o) => matchesFilter(o, tab.value)).length;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={filter === tab.value}
              onClick={() => onFilterChange(tab.value)}
              className={`
                flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium
                transition-colors outline-none
                focus-visible:ring-2 focus-visible:ring-ring
                ${filter === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              {tab.label}
              <span
                className={`
                  rounded-full px-1.5 py-0.5 text-[10px] leading-none
                  ${filter === tab.value
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List body */}
      <div
        role="list"
        aria-label="Order list"
        className="flex-1 overflow-y-auto"
      >
        {loading ? (
          <OrderListSkeleton />
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <svg
              className="mb-4 h-12 w-12 text-muted-foreground/40"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-3-3v6M3.75 9A6.75 6.75 0 0 1 10.5 2.25h3A6.75 6.75 0 0 1 20.25 9v.75M3.75 9v.75A6.75 6.75 0 0 0 10.5 16.5h3a6.75 6.75 0 0 0 6.75-6.75V9"
              />
            </svg>
            <p className="text-sm font-medium text-muted-foreground">
              {search ? "No orders match your search." : "No orders here yet."}
            </p>
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          visible.map((order) => (
            <div key={order.id} role="listitem">
              <OrderCard
                order={order}
                isSelected={selectedId === order.id}
                onClick={() => onSelect(order.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
