import { describe, it, expect } from "vitest";
import {
  PaymentProcessor,
  MockPayProcessor,
  CashOnDeliveryProcessor,
  createPaymentProcessor,
} from "@/lib/oop";

describe("OOP: PaymentProcessor Hierarchy (Abstraction, Encapsulation, Polymorphism)", () => {
  it("rejects invalid constructor arguments (encapsulation)", () => {
    expect(() => new MockPayProcessor("", 100)).toThrow("Order ID is required");
    expect(() => new MockPayProcessor("ord-1", 0)).toThrow("positive number");
    expect(() => new CashOnDeliveryProcessor("ord-1", -50)).toThrow("positive number");
  });

  it("validates amount against expected order total", () => {
    const processor = createPaymentProcessor("mockpay", "ord-1", 250);
    expect(processor.validateAmount(250)).toBe(true);
    expect(processor.validateAmount(249.99)).toBe(false);
  });

  it("processes payments polymorphically through PaymentProcessor base type", () => {
    const processors: PaymentProcessor[] = [
      createPaymentProcessor("mockpay", "ord-1", 300),
      createPaymentProcessor("cod", "ord-2", 450),
    ];

    const outcomes = processors.map((p) => p.process("approve"));

    expect(outcomes[0].method).toBe("mockpay");
    expect(outcomes[0].paymentStatus).toBe("paid");
    expect(outcomes[0].orderStatusChangedTo).toBeUndefined();

    expect(outcomes[1].method).toBe("cod");
    expect(outcomes[1].paymentStatus).toBe("paid");
    expect(outcomes[1].orderStatusChangedTo).toBe("completed");
  });

  it("handles cancellation and stock restoration flag", () => {
    const mockpay = new MockPayProcessor("ord-1", 200);
    const outcome = mockpay.process("cancel");

    expect(outcome.paymentStatus).toBe("cancelled");
    expect(outcome.orderStatusChangedTo).toBe("cancelled");
    expect(outcome.shouldRestoreStock).toBe(true);
  });
});
