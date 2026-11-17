import { describe, it, expect } from "vitest";
import {
  checkoutSchema,
  cartItemSchema,
  mockpaySchema,
  orderStatusUpdateSchema,
} from "@/modules/orders/schemas";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("checkoutSchema", () => {
  const base = {
    deliveryName: "Ana Dela Cruz",
    deliveryPhone: "09171234567",
    deliveryAddress: "Purok 3, Brgy. San Rafael, City of San Pablo, Laguna",
    paymentMethod: "mockpay" as const,
  };

  it("accepts a valid checkout", () => {
    const result = checkoutSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("rejects missing delivery name", () => {
    const result = checkoutSchema.safeParse({ ...base, deliveryName: "" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.flatten().fieldErrors.deliveryName).toContain(
        "Delivery name is required"
      );
  });

  it("rejects missing delivery phone", () => {
    const result = checkoutSchema.safeParse({ ...base, deliveryPhone: "" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.flatten().fieldErrors.deliveryPhone).toContain(
        "Delivery phone is required"
      );
  });

  it("rejects invalid phone characters", () => {
    const result = checkoutSchema.safeParse({ ...base, deliveryPhone: "abc" });
    expect(result.success).toBe(false);
  });

  it("rejects missing delivery address", () => {
    const result = checkoutSchema.safeParse({ ...base, deliveryAddress: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid payment method", () => {
    const result = checkoutSchema.safeParse({ ...base, paymentMethod: "card" });
    expect(result.success).toBe(false);
  });
});

describe("cartItemSchema", () => {
  it("accepts valid cart item", () => {
    const result = cartItemSchema.safeParse({ productId: VALID_UUID, quantity: 2 });
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID product id", () => {
    const result = cartItemSchema.safeParse({ productId: "not-a-uuid", quantity: 1 });
    expect(result.success).toBe(false);
  });

  it("rejects zero or negative quantity", () => {
    expect(cartItemSchema.safeParse({ productId: VALID_UUID, quantity: 0 }).success).toBe(false);
    expect(cartItemSchema.safeParse({ productId: VALID_UUID, quantity: -1 }).success).toBe(false);
  });
});

describe("mockpaySchema", () => {
  const base = {
    order_id: VALID_UUID,
    amount: 450,
    result: "approve" as const,
  };

  it("accepts approve and cancel", () => {
    expect(mockpaySchema.safeParse({ ...base, result: "approve" }).success).toBe(true);
    expect(mockpaySchema.safeParse({ ...base, result: "cancel" }).success).toBe(true);
  });

  it("rejects negative amount", () => {
    expect(mockpaySchema.safeParse({ ...base, amount: -10 }).success).toBe(false);
  });

  it("rejects non-UUID order id", () => {
    expect(mockpaySchema.safeParse({ ...base, order_id: "nope" }).success).toBe(false);
  });
});

describe("orderStatusUpdateSchema", () => {
  const base = { order_id: VALID_UUID, new_status: "accepted" as const };

  it("accepts all valid statuses", () => {
    for (const status of [
      "accepted",
      "rejected",
      "preparing",
      "delivering",
      "completed",
      "cancelled",
    ]) {
      expect(orderStatusUpdateSchema.safeParse({ ...base, new_status: status }).success).toBe(
        true
      );
    }
  });

  it("rejects invalid status", () => {
    expect(
      orderStatusUpdateSchema.safeParse({ ...base, new_status: "shipped" }).success
    ).toBe(false);
  });
});
