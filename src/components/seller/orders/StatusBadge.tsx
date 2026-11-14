import type { OrderStatus, PaymentStatus, PaymentMethod } from "@/modules/orders/types";

// ─── Order status ────────────────────────────────────────────────────────────

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending:    { label: "Pending",    className: "bg-amber-100 text-amber-800 border-amber-200" },
  accepted:   { label: "Accepted",   className: "bg-blue-100 text-blue-800 border-blue-200" },
  rejected:   { label: "Rejected",   className: "bg-red-100 text-red-700 border-red-200" },
  preparing:  { label: "Preparing",  className: "bg-orange-100 text-orange-800 border-orange-200" },
  delivering: { label: "Delivering", className: "bg-purple-100 text-purple-800 border-purple-200" },
  completed:  { label: "Completed",  className: "bg-green-100 text-green-800 border-green-200" },
  cancelled:  { label: "Cancelled",  className: "bg-gray-100 text-gray-600 border-gray-200" },
};

// ─── Payment status ───────────────────────────────────────────────────────────

const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  pending:   { label: "Pending",   className: "bg-amber-50 text-amber-700 border-amber-200" },
  paid:      { label: "Paid",      className: "bg-green-100 text-green-800 border-green-200" },
  failed:    { label: "Failed",    className: "bg-red-100 text-red-700 border-red-200" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600 border-gray-200" },
  refunded:  { label: "Refunded",  className: "bg-blue-100 text-blue-800 border-blue-200" },
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
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClass} ${cfg.className}`}
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
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClass} ${cfg.className}`}
      aria-label={`Payment: ${methodLabel}, ${cfg.label}`}
    >
      <span className="opacity-70">{methodLabel}</span>
      <span>·</span>
      <span>{cfg.label}</span>
    </span>
  );
}
