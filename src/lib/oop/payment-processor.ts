import type { PaymentAction, PaymentMethod, PaymentOutcome } from "./contracts";

/**
 * Abstract base class for simulated payment processors in (SP) Pamilihub.
 *
 * Demonstrates:
 * - Abstraction: hides payment-method-specific rules behind `process()`.
 * - Encapsulation: validates positive amounts and exact total matching.
 * - Polymorphism: `MockPayProcessor` and `CashOnDeliveryProcessor` override `process()`.
 */
export abstract class PaymentProcessor {
  protected readonly orderId: string;
  protected readonly amount: number;

  constructor(orderId: string, amount: number) {
    if (!orderId || orderId.trim().length === 0) {
      throw new Error("Order ID is required for payment processing.");
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Payment amount must be a positive number.");
    }
    this.orderId = orderId;
    this.amount = Number(amount.toFixed(2));
  }

  public getOrderId(): string {
    return this.orderId;
  }

  public getAmount(): number {
    return this.amount;
  }

  /** Verifies that the submitted payment amount matches the authoritative order total. */
  public validateAmount(expectedOrderTotal: number): boolean {
    return Math.abs(this.amount - Number(expectedOrderTotal.toFixed(2))) < 0.001;
  }

  public abstract getMethodName(): PaymentMethod;
  public abstract process(action: PaymentAction): PaymentOutcome;
}

/**
 * Simulated online payment processor (MockPay).
 * No real money is ever charged (per AGENTS.md hard rule #1).
 */
export class MockPayProcessor extends PaymentProcessor {
  private readonly gatewayLabel = "MockPay (Simulated)";

  public getGatewayLabel(): string {
    return this.gatewayLabel;
  }

  public override getMethodName(): PaymentMethod {
    return "mockpay";
  }

  public override process(action: PaymentAction): PaymentOutcome {
    if (action === "approve") {
      return {
        orderId: this.orderId,
        method: "mockpay",
        paymentStatus: "paid",
        shouldRestoreStock: false,
        message: "Payment approved (simulated).",
      };
    }

    if (action === "cancel") {
      return {
        orderId: this.orderId,
        method: "mockpay",
        paymentStatus: "cancelled",
        orderStatusChangedTo: "cancelled",
        shouldRestoreStock: true,
        message: "Payment cancelled. Stock has been restored.",
      };
    }

    throw new Error(`Unsupported MockPay action: ${action}`);
  }
}

/**
 * Cash on Delivery (COD) processor.
 * Payment remains `pending` until the seller marks the order `completed`.
 */
export class CashOnDeliveryProcessor extends PaymentProcessor {
  public override getMethodName(): PaymentMethod {
    return "cod";
  }

  public override process(action: PaymentAction): PaymentOutcome {
    if (action === "collect_on_delivery" || action === "approve") {
      return {
        orderId: this.orderId,
        method: "cod",
        paymentStatus: "paid",
        orderStatusChangedTo: "completed",
        shouldRestoreStock: false,
        message: "Cash on delivery collected and marked as paid.",
      };
    }

    if (action === "cancel") {
      return {
        orderId: this.orderId,
        method: "cod",
        paymentStatus: "cancelled",
        orderStatusChangedTo: "cancelled",
        shouldRestoreStock: true,
        message: "COD order cancelled. Stock has been restored.",
      };
    }

    throw new Error(`Unsupported COD action: ${action}`);
  }
}

/**
 * Factory returning the appropriate polymorphic `PaymentProcessor` subclass.
 */
export function createPaymentProcessor(
  method: PaymentMethod,
  orderId: string,
  amount: number
): PaymentProcessor {
  switch (method) {
    case "mockpay":
      return new MockPayProcessor(orderId, amount);
    case "cod":
      return new CashOnDeliveryProcessor(orderId, amount);
    default:
      throw new Error(`Unsupported payment method: ${String(method)}`);
  }
}
