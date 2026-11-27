import { BaseEntity } from "./base-entity";
import type {
  PaymentAction,
  PaymentMethod,
  PaymentOutcome,
  PaymentStatus,
} from "./contracts";
import type { PaymentProcessor } from "./payment-processor";
import { canTransition, isTerminal, type OrderStatus } from "@/modules/orders/status-machine";

export const FLAT_DELIVERY_FEE = 50;

/**
 * Line item owned by an `Order`.
 *
 * Demonstrates Composition: `OrderItem` instances are created and owned
 * inside `Order` and encapsulate quantity * unitPrice calculation.
 */
export class OrderItem {
  private readonly productId: string;
  private readonly productName: string;
  private readonly quantity: number;
  private readonly unitPrice: number;

  constructor(
    productId: string,
    productName: string,
    quantity: number,
    unitPrice: number
  ) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Order item quantity must be a positive integer.");
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error("Order item unit price cannot be negative.");
    }
    this.productId = productId;
    this.productName = productName;
    this.quantity = quantity;
    this.unitPrice = Number(unitPrice.toFixed(2));
  }

  public getProductId(): string {
    return this.productId;
  }

  public getProductName(): string {
    return this.productName;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getUnitPrice(): number {
    return this.unitPrice;
  }

  public getLineTotal(): number {
    return Number((this.quantity * this.unitPrice).toFixed(2));
  }
}

/**
 * Domain entity representing a single seller's order.
 *
 * Demonstrates:
 * - Composition: owns `OrderItem[]`.
 * - Encapsulation: enforces `OrderStatus` state machine & payment-gated acceptance.
 * - Polymorphism / Association: `applyPayment(processor: PaymentProcessor, action)`
 *   delegates to any `PaymentProcessor` subclass.
 */
export class Order extends BaseEntity {
  private readonly customerId: string;
  private readonly sellerId: string;
  private readonly items: OrderItem[] = [];
  private readonly deliveryFee: number;
  private readonly paymentMethod: PaymentMethod;
  private paymentStatus: PaymentStatus;
  private orderStatus: OrderStatus;

  constructor(params: {
    id: string;
    customerId: string;
    sellerId: string;
    paymentMethod: PaymentMethod;
    deliveryFee?: number;
    paymentStatus?: PaymentStatus;
    orderStatus?: OrderStatus;
    createdAt?: Date;
  }) {
    super(params.id, params.createdAt);
    this.customerId = params.customerId;
    this.sellerId = params.sellerId;
    this.paymentMethod = params.paymentMethod;
    this.deliveryFee = params.deliveryFee ?? FLAT_DELIVERY_FEE;
    this.paymentStatus = params.paymentStatus ?? "pending";
    this.orderStatus = params.orderStatus ?? "pending";
  }

  public getCustomerId(): string {
    return this.customerId;
  }

  public getSellerId(): string {
    return this.sellerId;
  }

  public getPaymentMethod(): PaymentMethod {
    return this.paymentMethod;
  }

  public getPaymentStatus(): PaymentStatus {
    return this.paymentStatus;
  }

  public getOrderStatus(): OrderStatus {
    return this.orderStatus;
  }

  public getDeliveryFee(): number {
    return this.deliveryFee;
  }

  public getItems(): OrderItem[] {
    return [...this.items];
  }

  /** Adds a composed `OrderItem` owned by this `Order`. */
  public addItem(
    productId: string,
    productName: string,
    quantity: number,
    unitPrice: number
  ): void {
    this.items.push(new OrderItem(productId, productName, quantity, unitPrice));
  }

  public calculateSubtotal(): number {
    const sum = this.items.reduce((acc, item) => acc + item.getLineTotal(), 0);
    return Number(sum.toFixed(2));
  }

  public calculateTotal(): number {
    return Number((this.calculateSubtotal() + this.deliveryFee).toFixed(2));
  }

  /**
   * Polymorphically executes a `PaymentProcessor` (`MockPayProcessor` or
   * `CashOnDeliveryProcessor`) and updates order/payment state accordingly.
   */
  public applyPayment(
    processor: PaymentProcessor,
    action: PaymentAction
  ): PaymentOutcome {
    if (processor.getMethodName() !== this.paymentMethod) {
      throw new Error(
        `Payment processor mismatch: order uses ${this.paymentMethod}, got ${processor.getMethodName()}.`
      );
    }
    if (!processor.validateAmount(this.calculateTotal())) {
      throw new Error("Payment amount does not match order total.");
    }
    if (isTerminal(this.orderStatus)) {
      throw new Error(`Order is already in a terminal state (${this.orderStatus}).`);
    }

    const outcome = processor.process(action);
    this.paymentStatus = outcome.paymentStatus;
    if (outcome.orderStatusChangedTo) {
      this.orderStatus = outcome.orderStatusChangedTo;
    }
    return outcome;
  }

  /**
   * Enforces business rules for order status transitions, including
   * payment-gated acceptance for MockPay orders.
   */
  public transitionTo(nextStatus: OrderStatus): void {
    if (isTerminal(this.orderStatus)) {
      throw new Error(`Order is already in a terminal state (${this.orderStatus}).`);
    }
    if (!canTransition(this.orderStatus, nextStatus)) {
      throw new Error(`Invalid transition from ${this.orderStatus} to ${nextStatus}.`);
    }
    if (
      nextStatus === "accepted" &&
      this.paymentMethod === "mockpay" &&
      this.paymentStatus !== "paid"
    ) {
      throw new Error("Customer has not paid for this MockPay order yet.");
    }

    this.orderStatus = nextStatus;

    // Business rules: COD paid on completion; paid order rejected/cancelled -> simulated refund
    if (
      nextStatus === "completed" &&
      this.paymentMethod === "cod" &&
      this.paymentStatus === "pending"
    ) {
      this.paymentStatus = "paid";
    } else if (
      (nextStatus === "rejected" || nextStatus === "cancelled") &&
      this.paymentStatus === "paid"
    ) {
      this.paymentStatus = "refunded";
    } else if (
      (nextStatus === "rejected" || nextStatus === "cancelled") &&
      this.paymentStatus === "pending"
    ) {
      this.paymentStatus = "cancelled";
    }
  }

  public override toSummary(): string {
    return `Order #${this.id.slice(0, 8)} (${this.items.length} items) — ₱${this.calculateTotal().toFixed(2)} [${this.orderStatus} / ${this.paymentStatus}]`;
  }
}

export interface CartSplitLine {
  productId: string;
  productName: string;
  sellerId: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Dependency / Service class that groups cart items into one `Order` per seller
 * (Business Rule #1) with a flat ₱50 delivery fee per seller order.
 */
export class CheckoutPlanner {
  public static splitBySeller(
    customerId: string,
    lines: CartSplitLine[],
    paymentMethod: PaymentMethod
  ): Order[] {
    if (lines.length === 0) {
      throw new Error("Cannot plan checkout for an empty cart.");
    }

    const ordersBySeller = new Map<string, Order>();

    for (const line of lines) {
      let order = ordersBySeller.get(line.sellerId);
      if (!order) {
        order = new Order({
          id: `draft-${line.sellerId}`,
          customerId,
          sellerId: line.sellerId,
          paymentMethod,
        });
        ordersBySeller.set(line.sellerId, order);
      }
      order.addItem(
        line.productId,
        line.productName,
        line.quantity,
        line.unitPrice
      );
    }

    return Array.from(ordersBySeller.values());
  }
}
