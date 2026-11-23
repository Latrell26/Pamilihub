"use client";

import { useState, useTransition } from "react";
import type { OrderDetail } from "@/modules/orders/types";
import { OrderStatusBadge, PaymentBadge } from "./StatusBadge";
import { OrderDetailSkeleton } from "./Skeletons";
import { updateOrderStatusAction } from "@/modules/orders/actions";
import {
  getAllowedTransitions,
  isTerminal,
  type OrderStatus,
} from "@/modules/orders/status-machine";
import {
  Check,
  Clock,
  User,
  Phone,
  MapPin,
  CreditCard,
  Package,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

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
    weekday: "short",
    month: "short",
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
  const isTerminalStatus = isTerminal(currentStatus);
  const stepIndex = TIMELINE_STEPS.indexOf(step);
  const currentIndex = TIMELINE_STEPS.indexOf(currentStatus);
  const done = !isTerminalStatus && currentIndex > stepIndex;
  const active = !isTerminalStatus && currentIndex === stepIndex;
  const skipped = isTerminalStatus && step !== "pending";

  const labels: Record<OrderStatus, string> = {
    pending: "Placed",
    accepted: "Accepted",
    preparing: "Preparing",
    delivering: "Delivery",
    completed: "Done",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`
          flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all
          ${
            done
              ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
              : active
              ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-4 ring-primary/15"
              : skipped
              ? "border-muted bg-muted text-muted-foreground/40"
              : "border-border bg-card text-muted-foreground"
          }
        `}
        aria-label={`${labels[step]} – ${done ? "done" : active ? "current" : "pending"}`}
      >
        {done ? (
          <Check className="h-4 w-4" strokeWidth={3} />
        ) : (
          <span className="text-[10px] font-black">{stepIndex + 1}</span>
        )}
      </div>
      <span
        className={`text-[10px] font-extrabold uppercase tracking-wider text-center ${
          active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {labels[step]}
      </span>
    </div>
  );
}

function StatusTimeline({ status }: { status: OrderStatus }) {
  const isTerminalStatus = isTerminal(status);
  return (
    <div aria-label="Order status timeline" className="rounded-2xl border border-border/70 bg-card p-4">
      {isTerminalStatus ? (
        <div
          className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold ${
            status === "rejected"
              ? "bg-red-500/10 text-red-600 border border-red-500/20"
              : "bg-muted text-muted-foreground border border-border"
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <span>Order is {status === "rejected" ? "Rejected" : "Cancelled"}</span>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          {TIMELINE_STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <TimelineStep step={step} currentStatus={status} />
              {i < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 mt-[-18px] rounded-full transition-colors ${
                    TIMELINE_STEPS.indexOf(status) > i
                      ? "bg-emerald-500"
                      : "bg-border"
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

const ACTION_LABELS: Record<OrderStatus, string> = {
  pending:   "Pending",
  accepted:   "Accept Order",
  rejected:   "Reject Order",
  preparing:  "Mark Preparing",
  delivering: "Mark Out for Delivery",
  completed:  "Mark Completed",
  cancelled:  "Cancel Order",
};

interface ActionButtonsProps {
  order: OrderDetail;
  onStatusUpdated: () => void;
}

function ActionButtons({ order, onStatusUpdated }: ActionButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const allowedNext = getAllowedTransitions(order.order_status);

  // MockPay: block 'accept' until the customer has paid
  const mockpayNotPaid =
    order.payment_method === "mockpay" && order.payment_status !== "paid";
  const filteredAllowed = mockpayNotPaid
    ? allowedNext.filter((s) => s !== "accepted")
    : allowedNext;

  if (filteredAllowed.length === 0) return null;

  function handleAction(newStatus: OrderStatus) {
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
          className={`flex items-center gap-2 rounded-2xl p-3.5 text-xs font-bold ${
            toast.ok
              ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
              : "bg-red-500/10 text-red-600 border border-red-500/20"
          }`}
        >
          {toast.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {mockpayNotPaid && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3.5 text-xs text-amber-700">
          <Clock className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            <strong>Awaiting MockPay payment.</strong> The customer has not paid yet. You can reject or wait for payment before accepting.
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2.5">
        {filteredAllowed.map((next) => {
          const isDanger = next === "rejected" || next === "cancelled";
          return (
            <button
              key={next}
              disabled={isPending}
              onClick={() => handleAction(next)}
              aria-label={ACTION_LABELS[next]}
              className={`
                flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-60
                ${
                  !isDanger
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90"
                    : "border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/20"
                }
              `}
            >
              {isPending ? "Updating..." : ACTION_LABELS[next]}
              {!isDanger && <ArrowRight className="h-3.5 w-3.5" />}
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
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/60 text-muted-foreground/60">
          <Package className="h-8 w-8" />
        </div>
        <p className="text-sm font-bold text-foreground">No order selected</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Select an order from the list on the left to review details, update status, and manage fulfillment.
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
    <div className="flex flex-col h-full overflow-y-auto bg-background">
      {/* Header bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/95 p-4 sm:px-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-foreground">Order {shortId}</h2>
            <OrderStatusBadge status={order.order_status as OrderStatus} size="md" />
          </div>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close detail panel"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-6 flex-1">
        {/* Status Timeline */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Fulfillment Progress
          </span>
          <StatusTimeline status={order.order_status as OrderStatus} />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Order Actions
          </span>
          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
            <ActionButtons order={order} onStatusUpdated={onStatusUpdated} />
          </div>
        </div>

        {/* Customer & Delivery Card */}
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <User className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
              Customer & Delivery Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Customer Name</span>
              <p className="font-bold text-foreground text-sm mt-0.5">{order.delivery_name}</p>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Contact Number</span>
              <p className="font-bold text-foreground text-sm mt-0.5">{order.delivery_phone}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-muted-foreground block text-[11px]">Delivery Address (San Pablo City)</span>
              <p className="font-bold text-foreground mt-0.5 leading-relaxed">{order.delivery_address}</p>
            </div>
          </div>
        </div>

        {/* Items List Card */}
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                Items ({order.order_items.length})
              </h3>
            </div>
            <PaymentBadge
              status={order.payment_status as any}
              method={order.payment_method as any}
              size="sm"
            />
          </div>

          <div className="divide-y divide-border/40">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
                {item.products?.image_url ? (
                  <img
                    src={item.products.image_url}
                    alt={item.products?.name ?? "Food"}
                    className="h-12 w-12 rounded-xl object-cover border border-border/60 shrink-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/60 text-lg border border-border/50 shrink-0">
                    🍲
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-xs text-foreground truncate">
                    {item.products?.name ?? "Delicacy"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formatPHP(item.unit_price)} × {item.quantity}
                  </p>
                </div>
                <span className="text-xs font-black text-foreground shrink-0">
                  {formatPHP(item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div className="border-t border-border/60 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPHP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee (San Pablo)</span>
              <span>{formatPHP(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-foreground pt-1.5 border-t border-border/40">
              <span>Total Bill</span>
              <span className="text-primary">{formatPHP(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
