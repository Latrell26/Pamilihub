"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { loginAction } from "@/modules/accounts/actions";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
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
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Welcome back!
        </h1>
        <p className="text-sm text-muted-foreground">
          Log in to order fresh San Pablo delicacies.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-primary/20 bg-primary/10 p-3.5 text-xs font-medium text-primary"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form action={handleSubmit} className="space-y-3.5">
        {/* Email */}
        <div className="relative">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Email address"
            className="h-12 w-full rounded-2xl border border-transparent bg-muted/70 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            className="h-12 w-full rounded-2xl border border-transparent bg-muted/70 pl-11 pr-12 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            "Log in"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Link
        href="/products"
        className="flex h-12 w-full items-center justify-center rounded-full border-2 border-border bg-background text-sm font-bold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
      >
        Browse as guest
      </Link>

      <p className="text-center text-sm text-muted-foreground">
        New to Pamilihub?{" "}
        <Link
          href="/register"
          className="font-bold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}