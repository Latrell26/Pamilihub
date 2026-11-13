import { z } from "zod";

/** Checkout request validation. Delivery info + payment method come from the
 *  checkout form; the server recomputes totals and never trusts client prices. */
export const checkoutSchema = z.object({
  deliveryName: z.string().min(1, "Delivery name is required").trim(),
  deliveryPhone: z
    .string()
    .min(1, "Delivery phone is required")
    .regex(/^[\d\s\+\-()]{7,15}$/, "Enter a valid phone number"),
  deliveryAddress: z.string().min(1, "Delivery address is required").trim(),
  paymentMethod: z.enum(["mockpay", "cod"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
