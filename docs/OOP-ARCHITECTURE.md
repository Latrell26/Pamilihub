# Object-Oriented Programming (OOP) Technical Documentation
**Project Title:** (SP) Pamilihub: A Web-Based Local Food Delicacies E-Commerce Platform for San Pablo City, Laguna  
**Course:** Object-Oriented Programming (System Development Requirements)  
**Implementation Language:** TypeScript (Node.js / Next.js)

---

## 1. Overview
**(SP) Pamilihub** implements a strongly-typed Object-Oriented domain layer under [`src/lib/oop/`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/index.ts) that models the marketplace's three roles (`customer`, `seller`, `admin`), catalog products and stores, multi-seller orders, and simulated payments (`MockPay` and `Cash on Delivery`).

---

## 2. The Four Pillars of OOP

| Pillar | Implementation & Source Location | How It Works |
|---|---|---|
| **Encapsulation** | [`ProductItem`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/catalog-entities.ts), [`Order`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/order-entities.ts), [`UserAccount`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/user-account.ts) | Internal state (`price`, `stock`, `orderStatus`, `paymentStatus`, `fullName`) is declared `private` or `protected`. Mutations are allowed only through validated methods (`setPrice()`, `reserveStock()`, `transitionTo()`, `setFullName()`), protecting business invariants. |
| **Abstraction** | [`contracts.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/contracts.ts), [`BaseEntity`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/base-entity.ts), [`PaymentProcessor`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/payment-processor.ts) | Interfaces (`Identifiable`, `Summarizable`, `StockManaged`) and `abstract` classes (`BaseEntity`, `UserAccount`, `PaymentProcessor`) define high-level contracts (`toSummary()`, `canAccessRoute()`, `process()`) while hiding subclass implementation details. |
| **Inheritance** | [`user-account.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/user-account.ts), [`payment-processor.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/payment-processor.ts), [`catalog-entities.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/catalog-entities.ts) | `CustomerAccount`, `SellerAccount`, and `AdminAccount` inherit shared identity and profile logic from `UserAccount` (which extends `BaseEntity`) using `extends` and `super(...)`. `MockPayProcessor` and `CashOnDeliveryProcessor` extend `PaymentProcessor`. |
| **Polymorphism** | [`user-account.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/user-account.ts), [`payment-processor.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/payment-processor.ts), [`order-entities.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/order-entities.ts) | Subclasses override `canAccessRoute()`, `getPermissions()`, `process()`, and `toSummary()`. `Order.applyPayment(processor: PaymentProcessor, action)` dispatches dynamically to either `MockPayProcessor` or `CashOnDeliveryProcessor` without conditional branching on payment type. |

---

## 3. Class Relationships Demonstrated

- **Inheritance (`is-a`):**
  - `CustomerAccount`, `SellerAccount`, `AdminAccount` **is-a** `UserAccount` **is-a** `BaseEntity`
  - `MockPayProcessor`, `CashOnDeliveryProcessor` **is-a** `PaymentProcessor`
- **Composition (`owns-a` / strong lifecycle):**
  - `Order` composes `OrderItem[]` in [`order-entities.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/order-entities.ts). `OrderItem` instances are created and owned by their parent `Order`.
- **Aggregation (`has-a` / independent lifecycle):**
  - `SellerStore` aggregates `ProductItem[]` in [`catalog-entities.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/catalog-entities.ts). Products can exist and be referenced independently in search or cart views.
- **Association / Dependency (`uses-a`):**
  - `Order.applyPayment()` depends on `PaymentProcessor` ([`order-entities.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/order-entities.ts)).
  - `CheckoutPlanner.splitBySeller()` groups cart lines into one `Order` per seller with the flat ₱50 delivery fee.

---

## 4. Live Application Integration

Every OOP class is wired into production application paths:
- **MockPay API ([`src/app/api/mockpay/route.ts`](file:///c:/DEV/LSPU/PRINCE/src/app/api/mockpay/route.ts)):** Uses `createPaymentProcessor("mockpay", order_id, amount)` (`MockPayProcessor`) to validate the payment amount and produce the polymorphic `PaymentOutcome`.
- **Role Authorization ([`src/lib/auth/roles.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/auth/roles.ts)):** `requireRole()` and `getCurrentAccount()` instantiate `createAccountEntity(...)` (`CustomerAccount`, `SellerAccount`, `AdminAccount`) for role-based route access.
- **Checkout Splitting ([`src/app/(customer)/checkout/page.tsx`](file:///c:/DEV/LSPU/PRINCE/src/app/(customer)/checkout/page.tsx)):** Uses `CheckoutPlanner.splitBySeller()` to compose `Order` and `OrderItem` instances per seller and compute subtotals, flat ₱50 delivery fees, and grand totals.
- **Seller Order Fulfillment ([`src/modules/orders/actions.ts`](file:///c:/DEV/LSPU/PRINCE/src/modules/orders/actions.ts)):** `updateOrderStatusAction()` instantiates `Order` to enforce `transitionTo()` (status machine + payment-gated MockPay acceptance) and uses `CashOnDeliveryProcessor` on COD completion.
- **Store Menu Catalog ([`src/components/catalog/store-menu-view.tsx`](file:///c:/DEV/LSPU/PRINCE/src/components/catalog/store-menu-view.tsx)):** Instantiates `SellerStore` aggregating `ProductItem[]` for encapsulated product name/price access during menu filtering and BST price sorting.

---

## 5. Verification & Teacher Walkthrough Checklist

1. **Inspect OOP Source Code:** Open [`src/lib/oop/`](file:///c:/DEV/LSPU/PRINCE/src/lib/oop/index.ts) to show `abstract` classes, `interface` contracts, `private`/`protected`/`public`/`readonly` modifiers, constructors, and `extends`/`super`.
2. **Run OOP CLI Demo:**
   ```bash
   pnpm demo:oop
   ```
3. **Run Automated Unit Tests:**
   ```bash
   pnpm test:unit
   ```
   Unit tests for the OOP layer live in `tests/unit/oop/`:
   - [`user-account.test.ts`](file:///c:/DEV/LSPU/PRINCE/tests/unit/oop/user-account.test.ts)
   - [`payment-processor.test.ts`](file:///c:/DEV/LSPU/PRINCE/tests/unit/oop/payment-processor.test.ts)
   - [`catalog-order.test.ts`](file:///c:/DEV/LSPU/PRINCE/tests/unit/oop/catalog-order.test.ts)
