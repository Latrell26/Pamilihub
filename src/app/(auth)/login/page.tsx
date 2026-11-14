"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/modules/accounts/actions";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");

    const result = await loginAction(null, formData);

    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.message || "Invalid email or password.");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-xs text-muted-foreground">
          Enter your credentials to access your account
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
            Email address
          </label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="juan@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
              Password
            </label>
          </div>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Signing in...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="pt-2 border-t border-border/60 text-center">
        <p className="text-xs text-muted-foreground">
          Don&#39;t have an account yet?{" "}
          <Link href="/register" className="font-semibold text-foreground hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
