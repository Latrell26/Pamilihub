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

      // Reload to reflect updated status
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
      <div className="rounded-md bg-destructive/10 border border-destructive/50 p-4 text-sm text-destructive text-center">
        {error}
        <button
          onClick={() => setError("")}
          className="mt-2 text-xs underline text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground text-center">
        Simulated payment for ₱{amount.toFixed(2)}. No real money is processed.
      </p>
      <div className="grid gap-2">
        <button
          onClick={() => handlePay("approve")}
          disabled={loading || result === "approve"}
          className={`rounded-md px-4 py-2 text-sm font-semibold shadow ${
            loading || result === "approve"
              ? "bg-muted opacity-70"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {loading && result === "approve" ? "Approving…" : "Approve payment"}
        </button>
        <button
          onClick={() => handlePay("cancel")}
          disabled={loading || result === "cancel"}
          className={`rounded-md px-4 py-2 text-sm font-semibold shadow ${
            loading || result === "cancel"
              ? "bg-muted opacity-70"
              : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
          }`}
        >
          {loading && result === "cancel" ? "Cancelling…" : "Cancel payment"}
        </button>
      </div>
      {result && !error && (
        <div className="text-xs text-muted-foreground text-center mt-2">
          {result === "approve" ? "Payment approved." : "Payment cancelled."}
        </div>
      )}
    </div>
  );
}
