"use client";

import type { OrderSummary, OrderStatus } from "@/modules/orders/types";
import { OrderStatusBadge, PaymentBadge } from "./StatusBadge";

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
    year: "numeric",
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
        relative border-b border-border px-4 py-4 cursor-pointer
        transition-colors duration-100 outline-none
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
        ${isSelected
          ? "bg-primary/5 border-l-2 border-l-primary"
          : "hover:bg-muted/40"
        }
      `}
    >
      {/* NEW badge */}
      {newOrder && (
        <span
          className="absolute top-3 right-3 inline-flex items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 leading-none"
          aria-label="New order"
        >
          NEW
        </span>
      )}

      <div className="flex items-start justify-between gap-3 pr-8">
        {/* Left: customer + preview */}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-foreground truncate">
            {order.delivery_name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{shortId}</p>
          {order.item_preview && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {order.item_preview}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(order.created_at)}
          </p>
        </div>

        {/* Right: amount + badges */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-sm font-bold text-foreground">
            {formatPHP(order.total)}
          </span>
          <OrderStatusBadge status={order.order_status as OrderStatus} />
          <PaymentBadge
            status={order.payment_status as any}
            method={order.payment_method as any}
          />
        </div>
      </div>
    </article>
  );
}
