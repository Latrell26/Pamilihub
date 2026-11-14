import { z } from "zod";
import { passwordRules } from "./password-rules";

// --- Auth ---

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .max(128, "Password is too long")
    .superRefine((value, ctx) => {
      // Enforce every rule shown in the register checklist.
      for (const rule of passwordRules) {
        if (!rule.test(value)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: rule.label });
        }
      }
    }),
  full_name: z.string().min(1, "Full name is required").trim(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Login only checks that a password was entered, so existing accounts
// created under older rules can still sign in.
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// --- Profile ---

export const profileUpdateSchema = z.object({
  full_name: z.string().min(1, "Full name is required").trim().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// --- Seller application ---

export const sellerApplicationSchema = z.object({
  store_name: z.string().min(1, "Store name is required").trim(),
  description: z.string().max(500).optional(),
  location: z.string().min(1, "Location is required").trim(),
});