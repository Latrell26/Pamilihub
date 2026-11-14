"use client";

import { useState, useTransition } from "react";
import type { OrderDetail, OrderStatus } from "@/modules/orders/types";
import { OrderStatusBadge, PaymentBadge } from "./StatusBadge";
import { OrderDetailSkeleton } from "./Skeletons";
import { updateOrderStatusAction } from "@/modules/orders/actions";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPHP(amount: number) {
  return new Intl.NumberFormat("fil-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fil-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

// ─── Status timeline ──────────────────────────────────────────────────────────

const TIMELINE_STEPS: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "delivering",
  "completed",
];

function TimelineStep({
  step,
  currentStatus,
}: {
  step: OrderStatus;
  currentStatus: OrderStatus;
}) {
  const isTerminal =
    currentStatus === "rejected" || currentStatus === "cancelled";
  const stepIndex = TIMELINE_STEPS.indexOf(step);
  const currentIndex = TIMELINE_STEPS.indexOf(currentStatus);
  const done = !isTerminal && currentIndex > stepIndex;
  const active = !isTerminal && currentIndex === stepIndex;
  const skipped = isTerminal && step !== "pending";

  const labels: Record<OrderStatus, string> = {
    pending: "Order Placed",
    accepted: "Accepted",
    preparing: "Preparing",
    delivering: "Out for Delivery",
    completed: "Completed",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`
          h-7 w-7 rounded-full border-2 flex items-center justify-center transition-colors
          ${done
            ? "border-green-500 bg-green-500 text-white"
            : active
            ? "border-primary bg-primary text-primary-foreground"
            : skipped
            ? "border-muted bg-muted text-muted-foreground opacity-40"
            : "border-muted bg-background text-muted-foreground"
          }
        `}
        aria-label={`${labels[step]} – ${done ? "done" : active ? "current" : "pending"}`}
      >
        {done ? (
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="text-[9px] font-bold leading-none">
            {stepIndex + 1}
          </span>
        )}
      </div>
      <span
        className={`text-[10px] text-center font-medium leading-tight max-w-[56px] ${
          active ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {labels[step]}
      </span>
    </div>
  );
}

function StatusTimeline({ status }: { status: OrderStatus }) {
  const isTerminal = status === "rejected" || status === "cancelled";
  return (
    <div aria-label="Order status timeline" className="mt-2">
      {isTerminal ? (
        <div
          className={`rounded-md px-3 py-2 text-sm font-medium text-center ${
            status === "rejected"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}
        >
          Order {status === "rejected" ? "Rejected" : "Cancelled"}
        </div>
      ) : (
        <div className="flex items-start gap-0">
          {TIMELINE_STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <TimelineStep step={step} currentStatus={status} />
              </div>
              {i < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mt-[-18px] transition-colors ${
                    TIMELINE_STEPS.indexOf(status) > i
                      ? "bg-green-400"
                      : "bg-muted"
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Action buttons ───────────────────────────────────────────────────────────

type NextStatus = "accepted" | "rejected" | "preparing" | "delivering" | "completed" | "cancelled";

const ALLOWED_TRANSITIONS: Partial<Record<OrderStatus, NextStatus[]>> = {
  pending:    ["accepted", "rejected"],
  accepted:   ["preparing", "cancelled"],
  preparing:  ["delivering", "cancelled"],
  delivering: ["completed", "cancelled"],
};

const ACTION_LABELS: Record<NextStatus, string> = {
  accepted:   "Accept Order",
  rejected:   "Reject Order",
  preparing:  "Mark Preparing",
  delivering: "Mark Out for Delivery",
  completed:  "Mark Completed",
  cancelled:  "Cancel Order",
};

const ACTION_VARIANT: Record<NextStatus, "primary" | "danger" | "secondary"> = {
  accepted:   "primary",
  preparing:  "primary",
  delivering: "primary",
  completed:  "primary",
  rejected:   "danger",
  cancelled:  "danger",
};

interface ActionButtonsProps {
  order: OrderDetail;
  onStatusUpdated: () => void;
}

function ActionButtons({ order, onStatusUpdated }: ActionButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const allowedNext = ALLOWED_TRANSITIONS[order.order_status as OrderStatus] ?? [];
  if (allowedNext.length === 0) return null;

  function handleAction(newStatus: NextStatus) {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("order_id", order.id);
      fd.append("new_status", newStatus);
      const result = await updateOrderStatusAction(null, fd);
      setToast({ ok: result.success, msg: result.message });
      if (result.success) {
        onStatusUpdated();
        setTimeout(() => setToast(null), 3000);
      }
    });
  }

  return (
    <div className="space-y-3">
      {toast && (
        <div
          role="alert"
          className={`rounded-md px-3 py-2 text-sm ${
            toast.ok
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.msg}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {allowedNext.map((next) => {
          const variant = ACTION_VARIANT[next];
          return (
            <button
              key={next}
              disabled={isPending}
              onClick={() => handleAction(next)}
              aria-label={ACTION_LABELS[next]}
              className={`
                rounded-md px-4 py-2 text-sm font-medium transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variant === "primary"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : variant === "danger"
                  ? "border border-red-300 text-red-700 hover:bg-red-50"
                  : "border border-border text-foreground hover:bg-muted"
                }
              `}
            >
              {isPending ? "Updating…" : ACTION_LABELS[next]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main detail panel ────────────────────────────────────────────────────────

interface OrderDetailPanelProps {
  order: OrderDetail | null;
  loading: boolean;
  onClose?: () => void;
  onStatusUpdated: () => void;
}

export function OrderDetailPanel({
  order,
  loading,
  onClose,
  onStatusUpdated,
}: OrderDetailPanelProps) {
  if (loading) return <OrderDetailSkeleton />;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 px-8 text-center">
        <svg
          className="mb-4 h-14 w-14 text-muted-foreground/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
          />
        </svg>
        <p className="text-muted-foreground text-sm">
          Select an order to see details.
        </p>
      </div>
    );
  }

  const subtotal = order.order_items.reduce(
    (acc, i) => acc + i.unit_price * i.quantity,
    0
  );
  const shortId = `#${order.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Order {shortId}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.order_status as OrderStatus} size="md" />
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close order detail"
              className="ml-1 rounded-md p-1.5 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-6 py-5 space-y-6">

        {/* Status timeline */}
        <section aria-labelledby="timeline-heading">
          <h3 id="timeline-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Order Progress
          </h3>
          <StatusTimeline status={order.order_status as OrderStatus} />
        </section>

        <div className="h-px bg-border" />

        {/* Action buttons */}
        <section aria-labelledby="actions-heading">
          <h3 id="actions-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Actions
          </h3>
          <ActionButtons order={order} onStatusUpdated={onStatusUpdated} />
        </section>

        <div className="h-px bg-border" />

        {/* Items */}
        <section aria-labelledby="items-heading">
          <h3 id="items-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Items Ordered
          </h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th scope="col" className="text-left px-4 py-2.5 font-medium text-muted-foreground">Product</th>
                  <th scope="col" className="text-center px-3 py-2.5 font-medium text-muted-foreground w-14">Qty</th>
                  <th scope="col" className="text-right px-4 py-2.5 font-medium text-muted-foreground">Unit Price</th>
                  <th scope="col" className="text-right px-4 py-2.5 font-medium text-muted-foreground">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {item.products?.name ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-center text-muted-foreground">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {formatPHP(item.unit_price)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatPHP(item.unit_price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPHP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery fee</span>
              <span>{formatPHP(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
              <span>Total</span>
              <span>{formatPHP(order.total)}</span>
            </div>
          </div>
        </section>

        <div className="h-px bg-border" />

        {/* Customer & payment info */}
        <section aria-labelledby="customer-heading">
          <h3 id="customer-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Delivery & Payment
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-3">
              <dt className="w-28 shrink-0 text-muted-foreground">Name</dt>
              <dd className="font-medium text-foreground">{order.delivery_name}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-28 shrink-0 text-muted-foreground">Phone</dt>
              <dd className="font-medium text-foreground">
                <a
                  href={`tel:${order.delivery_phone}`}
                  className="hover:underline text-primary"
                >
                  {order.delivery_phone}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-28 shrink-0 text-muted-foreground">Address</dt>
              <dd className="font-medium text-foreground">{order.delivery_address}</dd>
            </div>
            <div className="flex gap-3 items-center">
              <dt className="w-28 shrink-0 text-muted-foreground">Payment</dt>
              <dd>
                <PaymentBadge
                  status={order.payment_status as any}
                  method={order.payment_method as any}
                  size="md"
                />
              </dd>
            </div>
          </dl>
        </section>

      </div>
    </div>
  );
}
