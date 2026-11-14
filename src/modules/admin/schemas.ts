import { z } from "zod";

// --- Approve / reject seller ---

export const sellerReviewSchema = z.object({
  seller_id: z.string().uuid("Invalid seller ID"),
  action: z.enum(["approve", "reject"]),
});

// --- Admin moderate/delete product ---

export const adminDeleteProductSchema = z.object({
  product_id: z.string().uuid("Invalid product ID"),
});
