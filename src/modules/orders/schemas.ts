import { z } from "zod";

/** Checkout request validation. Delivery info + payment method come from the
 *  checkout form; the server recomputes totals and never trusts client prices. */
export const checkoutSchema = z.object({
  deliveryName: z.string().trim().min(1, "Delivery name is required"),
  deliveryPhone: z
    .string()
    .trim()
    .min(1, "Delivery phone is required")
    .max(20, "Phone number is too long")
    .regex(/^[\d\s+\-()]+$/, "Enter a valid phone number"),
  deliveryAddress: z.string().trim().min(1, "Delivery address is required"),
  paymentMethod: z.enum(["mockpay", "cod"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

/** Single cart item sent from the client during checkout. */
export const cartItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;

/** MockPay payment request validation. */
export const mockpaySchema = z.object({
  order_id: z.string().uuid("Invalid order ID"),
  amount: z.number().positive("Amount must be positive"),
  result: z.enum(["approve", "cancel"]),
});

export type MockPayInput = z.infer<typeof mockpaySchema>;

/** Order status update request validation (seller/admin actions). */
export const orderStatusUpdateSchema = z.object({
  order_id: z.string().uuid("Invalid order ID"),
  new_status: z.enum([
    "accepted",
    "rejected",
    "preparing",
    "delivering",
    "completed",
    "cancelled",
  ]),
});

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
