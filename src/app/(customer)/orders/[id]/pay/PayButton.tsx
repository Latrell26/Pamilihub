"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";

type PayButtonProps = {
  orderId: string;
  amount: number;
};

export default function PayButton({ orderId, amount }: PayButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"approve" | "cancel" | null>(null);
  const [error, setError] = useState("");

  const handlePay = async (r: "approve" | "cancel") => {
    setLoading(true);
    setError("");
    setResult(r);

    try {
      const res = await fetch("/api/mockpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          order_id: orderId,
          amount,
          result: r,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Payment failed.");
        setResult(null);
        return;
      }

      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl bg-red-500/10 border border-red-200 dark:border-red-900/50 p-4 text-xs text-red-600 dark:text-red-400 space-y-2 text-center">
        <div className="flex items-center justify-center gap-2 font-bold">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
        <button
          onClick={() => setError("")}
          className="text-xs text-primary font-bold hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Green Success Approve Button */}
        <button
          type="button"
          onClick={() => handlePay("approve")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 active:scale-[0.98] px-4 py-3.5 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading && result === "approve" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Approving Payment…</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Approve Payment</span>
            </>
          )}
        </button>

        {/* Red Error/Decline Cancel Button */}
        <button
          type="button"
          onClick={() => handlePay("cancel")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/70 text-red-600 dark:text-red-400 active:scale-[0.98] px-4 py-3.5 text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading && result === "cancel" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Cancelling…</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              <span>Cancel / Decline</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
        Cancelling restores product stock automatically via the database transaction.
      </p>
    </div>
  );
}
