"use client";

import type { OrderSummary, OrderStatus } from "@/modules/orders/types";
import { OrderStatusBadge, PaymentBadge } from "./StatusBadge";
import { Clock } from "lucide-react";

function formatPHP(amount: number) {
  return new Intl.NumberFormat("fil-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fil-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

const NEW_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

function isNew(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < NEW_THRESHOLD_MS;
}

interface OrderCardProps {
  order: OrderSummary;
  isSelected: boolean;
  onClick: () => void;
}

export function OrderCard({ order, isSelected, onClick }: OrderCardProps) {
  const shortId = `#${order.id.slice(0, 8).toUpperCase()}`;
  const newOrder = isNew(order.created_at);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Order ${shortId} from ${order.delivery_name}, ${formatPHP(order.total)}`}
      aria-pressed={isSelected}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`
        relative mx-2 my-1 rounded-2xl p-4 cursor-pointer
        transition-all duration-150 outline-none
        border
        ${
          isSelected
            ? "border-primary/40 bg-primary/10 shadow-sm ring-2 ring-primary/20"
            : "border-border/50 bg-card hover:bg-muted/50 hover:border-border"
        }
      `}
    >
      {/* Top row: Customer Name & Amount */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="font-extrabold text-sm text-foreground truncate">
              {order.delivery_name}
            </p>
            {newOrder && (
              <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-primary-foreground shadow-sm animate-pulse">
                NEW
              </span>
            )}
          </div>
          <p className="text-[11px] font-bold text-muted-foreground mt-0.5 tracking-wider">
            {shortId}
          </p>
        </div>

        <span className="text-sm font-black text-foreground shrink-0">
          {formatPHP(order.total)}
        </span>
      </div>

      {/* Middle row: Item preview */}
      {order.item_preview && (
        <p className="text-xs text-muted-foreground/90 mt-2 line-clamp-1">
          {order.item_preview}
        </p>
      )}

      {/* Bottom row: Badges and Date */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-border/40">
        <div className="flex flex-wrap items-center gap-1.5">
          <OrderStatusBadge status={order.order_status as OrderStatus} />
          <PaymentBadge
            status={order.payment_status as any}
            method={order.payment_method as any}
          />
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground shrink-0">
          <Clock className="h-3 w-3" />
          <span>{formatDate(order.created_at)}</span>
        </div>
      </div>
    </article>
  );
}
