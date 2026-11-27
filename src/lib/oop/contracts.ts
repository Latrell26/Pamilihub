/**
 * OOP Abstraction Contracts (Interfaces)
 *
 * Defines clean behavioral contracts implemented by domain entities
 * without exposing their internal state or implementation details.
 */

export interface Identifiable {
  getId(): string;
}

export interface Summarizable {
  toSummary(): string;
}

export interface StockManaged {
  getStock(): number;
  hasSufficientStock(quantity: number): boolean;
  reserveStock(quantity: number): void;
  restoreStock(quantity: number): void;
}

export type PaymentMethod = "mockpay" | "cod";
export type PaymentAction = "approve" | "cancel" | "collect_on_delivery";
export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";

export interface PaymentOutcome {
  orderId: string;
  method: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatusChangedTo?: "cancelled" | "completed";
  shouldRestoreStock: boolean;
  message: string;
}
