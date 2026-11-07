import { z } from "zod";

// --- Approve / reject seller ---

export const sellerReviewSchema = z.object({
  seller_id: z.string().uuid("Invalid seller ID"),
  action: z.enum(["approve", "reject"]),
});
