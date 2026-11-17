"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  BadgeCheck,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { applySellerAction } from "@/modules/accounts/actions";
import { getSellerStatus } from "@/modules/accounts/queries";
import { AddressPicker } from "@/components/ui/address-picker";

export default function SellerApplyPage() {
  const [application, setApplication] = useState<{
    id: string;
    store_name: string | null;
    status: string | null;
    created_at?: string;
  } | null>(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [storeName, setStoreName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  async function loadStatus() {
    try {
      const data = await getSellerStatus();
      setApplication(data);
      if (data?.store_name) {
        setStoreName(data.store_name);
      }
    } catch (err) {
      console.error("Failed to load seller status:", err);
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.set("store_name", storeName);
    formData.set("location", location);
    formData.set("description", description);

    const result = await applySellerAction(null, formData);

    if (result.success) {
      setMessage(result.message);
      await loadStatus();
    } else {
      setError(result.message || "Application submission failed. Please try again.");
    }

    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-background pb-0">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              aria-label="Back to delicacies"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card text-foreground shadow-sm transition-all hover:bg-muted active:scale-90"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
            </Link>
            <div>
              <h1 className="text-lg font-black tracking-tight text-foreground sm:text-lg">
                Merchant Program
              </h1>
              
            </div>
          </div>

          
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Loading Skeleton */}
        {initialLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-44 w-full rounded-3xl bg-muted/60" />
            <div className="space-y-4 rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="h-5 w-40 rounded-lg bg-muted" />
              <div className="space-y-3 pt-2">
                <div className="h-12 w-full rounded-2xl bg-muted/70" />
                <div className="h-12 w-full rounded-2xl bg-muted/70" />
                <div className="h-24 w-full rounded-2xl bg-muted/70" />
                <div className="h-12 w-full rounded-full bg-muted" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-blue-700 p-6 text-primary-foreground shadow-xl shadow-primary/20 sm:p-8">
              <div className="relative z-10 space-y-2.5">
               
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Showcase Your Local Delicacies
                </h2>
                <p className="max-w-xl text-xs sm:text-sm text-white/90 leading-relaxed">
                  Join Pamilihub to reach buyers across San Pablo City. From famous buko pie and espasol to home-roasted barako coffee, connect directly with food lovers.
                </p>

                <div className="grid grid-cols-3 gap-2 pt-3 pt-sm-4 border-t border-white/15 text-center sm:text-left">
                  <div>
                    <p className="text-xs font-bold text-white sm:text-sm">0% Sign Up</p>
                    <p className="text-[10px] text-white/75">No hidden upfront fees</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white sm:text-sm">Verified Store</p>
                    <p className="text-[10px] text-white/75">Official city badge</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white sm:text-sm">Local Delivery</p>
                    <p className="text-[10px] text-white/75">San Pablo riders & COD</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-medium text-red-600 dark:text-red-400"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Notification */}
            {message && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-700 dark:text-emerald-400"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {/* Status Cards (If Application Exists) */}
            {application && application.status && (
              <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
                {application.status === "approved" && (
                  <div className="space-y-6 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
                        <BadgeCheck className="h-9 w-9" />
                      </div>
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600">
                          <span>STORE APPROVED</span>
                        </div>
                        <h3 className="text-xl font-black text-foreground">
                          {application.store_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Your seller account is active and verified on Pamilihub.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                      Congratulations! You can now upload your menu, manage inventory, and fulfill customer orders through your dedicated seller dashboard.
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Link
                        href="/seller/products"
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-[0.98]"
                      >
                        <Store className="h-4 w-4" />
                        <span>Manage Products</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <Link
                        href="/seller/orders"
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-border/70 bg-card text-sm font-bold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
                      >
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        <span>Seller Orders</span>
                      </Link>
                    </div>
                  </div>
                )}

                {application.status === "pending" && (
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600">
                        <Clock className="h-8 w-8 animate-pulse" />
                      </div>
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-600">
                          <span>APPLICATION UNDER REVIEW</span>
                        </div>
                        <h3 className="text-xl font-black text-foreground">
                          {application.store_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Submitted for verification by the platform administrator.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                      Thank you for applying to sell on Pamilihub. We verify all local makers to ensure authentic San Pablo food quality. You will be able to add delicacies as soon as an admin approves your store.
                    </div>

                    <div className="flex justify-center sm:justify-start pt-2">
                      <Link
                        href="/products"
                        className="inline-flex h-11 items-center gap-2 rounded-full border border-border/70 bg-muted/50 px-6 text-xs font-bold text-foreground transition-all hover:bg-muted"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Browse Pamilihub Delicacies</span>
                      </Link>
                    </div>
                  </div>
                )}

                {application.status === "rejected" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 text-red-600">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[11px] font-bold text-red-600">
                          PREVIOUS APPLICATION DECLINED
                        </span>
                        <h3 className="text-base font-bold text-foreground">
                          Store: {application.store_name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your previous application could not be verified. You can update your store profile details below and resubmit for reconsideration.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Application Form (For new applicants or rejected re-applications) */}
            {(!application || application.status === "rejected") && (
              <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-8 space-y-6">
                <div className="space-y-1 border-b border-border/60 pb-4">
                  <h3 className="text-base font-black tracking-tight text-foreground sm:text-lg">
                    {application?.status === "rejected" ? "Resubmit Store Application" : "Store Profile Information"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Please provide accurate details about your San Pablo food business.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Store Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="store_name"
                      className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Store or Brand Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Store className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="store_name"
                        type="text"
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g., Lola Maya's Bakeshop, Collette's Buko Pie"
                        className="h-12 w-full rounded-2xl border border-transparent bg-muted/70 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15"
                      />
                    </div>
                  </div>

                  {/* Barangay & Location */}
                  <div className="space-y-2">
                    <label
                      htmlFor="location"
                      className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Barangay &amp; Location in San Pablo <span className="text-red-500">*</span>
                    </label>
                    <input type="hidden" name="location" value={location} />
                    <AddressPicker
                      value={location}
                      onChange={setLocation}
                      disabled={submitting}
                    />
                  </div>

                  {/* Store Description & Products */}
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Store Description & Specialties
                    </label>
                    <div className="relative">
                      <FileText className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                      <textarea
                        id="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your authentic delicacies, years in business, and specialties"
                        className="w-full rounded-2xl border border-transparent bg-muted/70 pl-11 pr-4 pt-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span>{application?.status === "rejected" ? "Resubmit Application" : "Submit Seller Application"}</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
