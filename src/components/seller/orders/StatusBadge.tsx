import type { OrderStatus, PaymentStatus, PaymentMethod } from "@/modules/orders/types";

// ─── Order status ────────────────────────────────────────────────────────────

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending:    { label: "Pending",    className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  accepted:   { label: "Accepted",   className: "bg-primary/10 text-primary border-primary/20" },
  rejected:   { label: "Rejected",   className: "bg-red-500/10 text-red-600 border-red-500/20" },
  preparing:  { label: "Preparing",  className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  delivering: { label: "Delivering", className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  completed:  { label: "Completed",  className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  cancelled:  { label: "Cancelled",  className: "bg-muted text-muted-foreground border-border/80" },
};

// ─── Payment status ───────────────────────────────────────────────────────────

const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  pending:   { label: "Unpaid",    className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  paid:      { label: "Paid",      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  failed:    { label: "Failed",    className: "bg-red-500/10 text-red-600 border-red-500/20" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground border-border/80" },
  refunded:  { label: "Refunded",  className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
};

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  mockpay: "MockPay",
  cod: "COD",
};

// ─── Components ───────────────────────────────────────────────────────────────

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export function OrderStatusBadge({ status, size = "sm" }: OrderStatusBadgeProps) {
  const cfg = ORDER_STATUS_CONFIG[status] ?? ORDER_STATUS_CONFIG.pending;
  const sizeClass = size === "sm" ? "text-[11px] px-2.5 py-0.5" : "text-xs px-3 py-1 font-bold";
  return (
    <span
      className={`inline-flex items-center rounded-full border font-bold uppercase tracking-wider ${sizeClass} ${cfg.className}`}
      aria-label={`Order status: ${cfg.label}`}
    >
      {cfg.label}
    </span>
  );
}

interface PaymentBadgeProps {
  status: PaymentStatus;
  method: PaymentMethod;
  size?: "sm" | "md";
}

export function PaymentBadge({ status, method, size = "sm" }: PaymentBadgeProps) {
  const cfg = PAYMENT_STATUS_CONFIG[status] ?? PAYMENT_STATUS_CONFIG.pending;
  const methodLabel = PAYMENT_METHOD_LABEL[method] ?? method.toUpperCase();
  const sizeClass = size === "sm" ? "text-[11px] px-2.5 py-0.5" : "text-xs px-3 py-1 font-bold";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold ${sizeClass} ${cfg.className}`}
      aria-label={`Payment: ${methodLabel}, ${cfg.label}`}
    >
      <span className="opacity-80 uppercase tracking-wider">{methodLabel}</span>
      <span>•</span>
      <span>{cfg.label}</span>
    </span>
  );
}
