"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { registerAction } from "@/modules/accounts/actions";
import { passwordRules } from "@/modules/accounts/password-rules";

const inputBase =
  "h-12 w-full rounded-2xl border bg-muted/70 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [showPassword, setShowPassword] = useState(false);
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

  // Strength = how many rules the current password passes
  const passedCount = passwordRules.filter((r) => r.test(password)).length;
  const strength =
    password.length === 0
      ? { label: "", bar: "bg-muted", text: "" }
      : passedCount <= 1
      ? { label: "Weak", bar: "bg-primary", text: "text-primary" }
      : passedCount < passwordRules.length
      ? { label: "Okay", bar: "bg-amber-500", text: "text-amber-600" }
      : { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-600" };
  const borderFor = (name: string) =>
    getFieldError(name)
      ? "border-primary bg-primary/5"
      : "border-transparent focus:border-primary";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join Pamilihub to order San Pablo delicacies.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-primary/20 bg-primary/10 p-3.5 text-xs font-medium text-primary"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form action={handleSubmit} className="space-y-3.5">
        {/* Full name */}
        <div>
          <div className="relative">
            <label htmlFor="full_name" className="sr-only">
              Full name
            </label>
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="full_name"
              type="text"
              name="full_name"
              required
              autoComplete="name"
              placeholder="Full name"
              className={`${inputBase} ${borderFor("full_name")}`}
            />
          </div>
          {getFieldError("full_name") && (
            <p className="mt-1.5 pl-4 text-xs font-medium text-primary">
              {getFieldError("full_name")}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
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
              className={`${inputBase} ${borderFor("email")}`}
            />
          </div>
          {getFieldError("email") && (
            <p className="mt-1.5 pl-4 text-xs font-medium text-primary">
              {getFieldError("email")}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
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
              autoComplete="new-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className={`${inputBase} pr-12 ${borderFor("password")}`}
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
          {getFieldError("password") && (
            <p className="mt-1.5 pl-4 text-xs font-medium text-primary">
              {getFieldError("password")}
            </p>
          )}

          {/* Live password checklist: expands on focus/typing, ticks as rules pass */}
          <div
            aria-live="polite"
            className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
              passwordFocused || password.length > 0
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              {/* Strength bar: one segment per rule passed */}
              <div className="flex items-center gap-3 pl-4 pr-1 pt-3">
                <div className="flex flex-1 gap-1.5" aria-hidden="true">
                  {passwordRules.map((rule, i) => (
                    <span
                      key={rule.id}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
                        i < passedCount ? strength.bar : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`w-12 text-right text-[11px] font-semibold transition-colors duration-300 motion-reduce:transition-none ${strength.text}`}
                >
                  {strength.label}
                </span>
              </div>

              <ul className="space-y-1.5 pb-0.5 pl-4 pt-2.5">
                {passwordRules.map((rule) => {
                  const met = rule.test(password);
                  return (
                    <li
                      key={rule.id}
                      className={`flex items-center gap-2 text-xs font-medium transition-colors duration-200 motion-reduce:transition-none ${
                        met ? "text-emerald-600" : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-200 motion-reduce:transition-none ${
                          met
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-muted-foreground/40 bg-transparent"
                        }`}
                      >
                        <Check
                          strokeWidth={3}
                          className={`h-2.5 w-2.5 text-white transition-transform duration-200 motion-reduce:transition-none ${
                            met ? "scale-100" : "scale-0"
                          }`}
                        />
                      </span>
                      <span>{rule.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="relative">
          <label htmlFor="phone" className="sr-only">
            Contact phone
          </label>
          <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="Contact phone (optional)"
            className={`${inputBase} border-transparent focus:border-primary`}
          />
        </div>

        {/* Address */}
        <div className="relative">
          <label htmlFor="address" className="sr-only">
            Barangay or town
          </label>
          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="address"
            type="text"
            name="address"
            autoComplete="street-address"
            placeholder="Barangay / town (optional)"
            className={`${inputBase} border-transparent focus:border-primary`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}