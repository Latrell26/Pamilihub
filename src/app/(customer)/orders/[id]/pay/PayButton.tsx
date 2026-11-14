"use client";

import { useState } from "react";

type PayButtonProps = {
  orderId: string;
  amount: number;
};

export default function PayButton({ orderId, amount }: PayButtonProps) {
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

      window.location.reload();
    } catch {
      setError("Network error. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 text-center space-y-2">
        <p className="font-semibold">{error}</p>
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
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => handlePay("approve")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading && result === "approve" ? (
            <span>Approving...</span>
          ) : (
            <>
              <span>✓ Approve Payment</span>
            </>
          )}
        </button>

        <button
          onClick={() => handlePay("cancel")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-xs font-bold hover:bg-red-100 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading && result === "cancel" ? (
            <span>Cancelling...</span>
          ) : (
            <>
              <span>✕ Cancel Payment</span>
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
