"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction } from "@/modules/accounts/actions";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");
    setFieldErrors({});

    const result = await registerAction(null, formData);

    if (result.success) {
      setMessage(result.message);
      setTimeout(() => router.push("/login"), 1500);
    } else {
      if (result.errors) setFieldErrors(result.errors);
      setError(result.message || "Registration failed. Please check the fields.");
    }

    setLoading(false);
  }

  const getFieldError = (name: string) => fieldErrors[name]?.[0];

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Create customer account</h1>
        <p className="text-xs text-muted-foreground">
          Join Pamilihub to browse and order San Pablo delicacies
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-start gap-2 animate-in fade-in-50">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 animate-in fade-in-50">
          {message}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
              getFieldError("email") ? "border-red-400 bg-red-50/20" : "border-input"
            }`}
            placeholder="juan@example.com"
          />
          {getFieldError("email") && (
            <p className="text-xs text-red-600 mt-1">{getFieldError("email")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
              getFieldError("password") ? "border-red-400 bg-red-50/20" : "border-input"
            }`}
            placeholder="At least 6 characters"
          />
          {getFieldError("password") && (
            <p className="text-xs text-red-600 mt-1">{getFieldError("password")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            required
            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
              getFieldError("full_name") ? "border-red-400 bg-red-50/20" : "border-input"
            }`}
            placeholder="Juan Dela Cruz"
          />
          {getFieldError("full_name") && (
            <p className="text-xs text-red-600 mt-1">{getFieldError("full_name")}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
              Contact Phone
            </label>
            <input
              type="tel"
              name="phone"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              placeholder="0912 345 6789"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
              Barangay / Town
            </label>
            <input
              type="text"
              name="address"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              placeholder="Brgy. San Rafael, SPC"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60 transition-all cursor-pointer mt-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Creating account...</span>
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="pt-2 border-t border-border/60 text-center">
        <p className="text-xs text-muted-foreground">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
