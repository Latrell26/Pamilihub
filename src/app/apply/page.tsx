"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { applySellerAction } from "@/modules/accounts/actions";
import { getSellerStatus } from "@/modules/accounts/queries";

export default function SellerApplyPage() {
  const [application, setApplication] = useState<{
    id: string;
    store_name: string | null;
    status: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    store_name: "",
    description: "",
    location: "",
  });

  async function loadStatus() {
    const data = await getSellerStatus();
    setApplication(data);
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");

    const result = await applySellerAction(null, formData);

    if (result.success) {
      setMessage(result.message);
      await loadStatus();
    } else {
      setError(result.message || "Application submission failed.");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Merchant Program</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Seller Application
        </h1>
        <p className="text-xs text-muted-foreground">
          Showcase and sell your local San Pablo delicacies to residents and visitors
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 flex items-start gap-2">
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
          {message}
        </div>
      )}

      {/* Application Status Banner if exists */}
      {application && application.status && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Application Status</h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                application.status === "approved"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : application.status === "rejected"
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
            >
              {application.status.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-foreground">
            <strong>Store:</strong> {application.store_name}
          </p>

          {application.status === "pending" && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your merchant application is under review by the platform administrator. You will gain access to the seller dashboard once approved.
            </p>
          )}

          {application.status === "approved" && (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-emerald-700 font-medium">
                Congratulations! Your store is approved. You can now manage products and process orders.
              </p>
              <Link
                href="/seller/products"
                className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all"
              >
                Go to Seller Dashboard
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Application Form */}
      {(!application || application.status === "rejected") && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
            Store Profile Information
          </h2>

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                Store or Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="store_name"
                defaultValue={formData.store_name}
                required
                placeholder="e.g. San Pablo Original Buko Pie"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                Store Location / Barangay <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                defaultValue={formData.location}
                required
                placeholder="e.g. Brgy. San Rafael, San Pablo City, Laguna"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                Store Description & Products
              </label>
              <textarea
                name="description"
                defaultValue={formData.description}
                rows={3}
                placeholder="Describe your delicacies, specialties, and business history..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 px-4 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-60 transition-all cursor-pointer"
            >
              {loading ? "Submitting Application..." : "Submit Seller Application"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
