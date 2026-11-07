import { z } from "zod";

// --- Categories (admin) ---

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required").trim(),
});

export const categoryUpdateSchema = z.object({
  id: z.string().uuid("Invalid category ID"),
  name: z.string().min(1, "Category name is required").trim(),
});

// --- Products (seller) ---

export const productCreateSchema = z.object({
  category_id: z.string().uuid("Invalid category"),
  name: z.string().min(1, "Product name is required").trim(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  stock: z.coerce.number().int().min(0, "Stock must be at least 0"),
});

export const productUpdateSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
  category_id: z.string().uuid("Invalid category").optional(),
  name: z.string().min(1, "Product name is required").trim().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be at least 0").optional(),
  stock: z.coerce.number().int().min(0, "Stock must be at least 0").optional(),
});
