import { describe, it, expect } from "vitest";
import {
  ProductItem,
  SellerStore,
  Order,
  CheckoutPlanner,
  MockPayProcessor,
  CashOnDeliveryProcessor,
  FLAT_DELIVERY_FEE,
} from "@/lib/oop";

describe("OOP: Catalog & Order Relationships (Encapsulation, Aggregation, Composition, Association)", () => {
  it("encapsulates ProductItem price and stock invariants", () => {
    const pie = new ProductItem({
      id: "p-1",
      sellerId: "s-1",
      categoryId: "cat-1",
      name: "San Pablo Buko Pie",
      price: 250,
      stock: 5,
    });

    expect(() => pie.setPrice(-10)).toThrow("cannot be negative");
    expect(() => pie.reserveStock(6)).toThrow("Insufficient stock");

    pie.reserveStock(2);
    expect(pie.getStock()).toBe(3);

    pie.restoreStock(2);
    expect(pie.getStock()).toBe(5);
  });

  it("demonstrates Aggregation: SellerStore aggregates ProductItems", () => {
    const pie = new ProductItem({
      id: "p-1",
      sellerId: "s-1",
      categoryId: "cat-1",
      name: "Buko Pie",
      price: 250,
      stock: 10,
    });
    const soldOut = new ProductItem({
      id: "p-2",
      sellerId: "s-1",
      categoryId: "cat-1",
      name: "Espasol",
      price: 120,
      stock: 0,
    });

    const store = new SellerStore({
      id: "s-1",
      storeName: "Lola Maya's",
      location: "Brgy. San Rafael",
      status: "approved",
      products: [pie, soldOut],
    });

    expect(store.getProducts()).toHaveLength(2);
    expect(store.getAvailableProducts()).toHaveLength(1);
    expect(store.getAvailableProducts()[0].getName()).toBe("Buko Pie");
  });

  it("demonstrates Composition & Dependency: CheckoutPlanner splits cart into one Order per seller", () => {
    const orders = CheckoutPlanner.splitBySeller(
      "cust-1",
      [
        { productId: "p-1", productName: "Buko Pie", sellerId: "s-1", quantity: 2, unitPrice: 250 },
        { productId: "p-2", productName: "Espasol", sellerId: "s-1", quantity: 1, unitPrice: 120 },
        { productId: "p-3", productName: "Barako Coffee", sellerId: "s-2", quantity: 1, unitPrice: 180 },
      ],
      "mockpay"
    );

    expect(orders).toHaveLength(2);
    expect(orders[0].calculateSubtotal()).toBe(620);
    expect(orders[0].calculateTotal()).toBe(620 + FLAT_DELIVERY_FEE);
    expect(orders[1].calculateTotal()).toBe(180 + FLAT_DELIVERY_FEE);
  });

  it("enforces payment-gated acceptance for MockPay and COD completion rules on Order", () => {
    const mockOrder = new Order({
      id: "ord-1",
      customerId: "cust-1",
      sellerId: "s-1",
      paymentMethod: "mockpay",
    });
    mockOrder.addItem("p-1", "Buko Pie", 1, 250);

    // Cannot accept before MockPay payment
    expect(() => mockOrder.transitionTo("accepted")).toThrow("has not paid");

    // Polymorphic payment application
    const processor = new MockPayProcessor("ord-1", 300);
    mockOrder.applyPayment(processor, "approve");
    expect(mockOrder.getPaymentStatus()).toBe("paid");

    mockOrder.transitionTo("accepted");
    mockOrder.transitionTo("preparing");
    mockOrder.transitionTo("delivering");
    mockOrder.transitionTo("completed");
    expect(mockOrder.getOrderStatus()).toBe("completed");
    expect(() => mockOrder.transitionTo("cancelled")).toThrow("terminal state");

    // COD order: can accept immediately, becomes paid on completion
    const codOrder = new Order({
      id: "ord-2",
      customerId: "cust-1",
      sellerId: "s-1",
      paymentMethod: "cod",
    });
    codOrder.addItem("p-2", "Espasol", 1, 100);
    codOrder.transitionTo("accepted");
    codOrder.transitionTo("preparing");
    codOrder.transitionTo("delivering");
    codOrder.transitionTo("completed");
    expect(codOrder.getPaymentStatus()).toBe("paid");

    // Verify CashOnDeliveryProcessor works polymorphically too
    const codOrder2 = new Order({
      id: "ord-3",
      customerId: "cust-1",
      sellerId: "s-1",
      paymentMethod: "cod",
    });
    codOrder2.addItem("p-2", "Espasol", 1, 100);
    codOrder2.applyPayment(new CashOnDeliveryProcessor("ord-3", 150), "collect_on_delivery");
    expect(codOrder2.getPaymentStatus()).toBe("paid");
    expect(codOrder2.getOrderStatus()).toBe("completed");
  });
});
