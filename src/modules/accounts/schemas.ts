import { z } from "zod";

// --- Auth ---

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128),
  full_name: z.string().min(1, "Full name is required").trim(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

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
