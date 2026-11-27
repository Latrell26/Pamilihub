import {
  UserAccount,
  createAccountEntity,
  ProductItem,
  SellerStore,
  CheckoutPlanner,
  PaymentProcessor,
  createPaymentProcessor,
} from "../src/lib/oop";

function banner(title: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${"=".repeat(60)}`);
}

banner("1. INHERITANCE & POLYMORPHISM — UserAccount Hierarchy");
const accounts: UserAccount[] = [
  createAccountEntity({
    id: "usr-cust-1",
    email: "juan@sanpablo.ph",
    role: "customer",
    fullName: "Juan Dela Cruz",
    phone: "09171234567",
    address: "Brgy. San Rafael, San Pablo City",
  }),
  createAccountEntity({
    id: "usr-sell-1",
    email: "maya@sanpablo.ph",
    role: "seller",
    fullName: "Lola Maya",
    storeId: "store-1",
    storeName: "Lola Maya's Bakeshop",
    approvalStatus: "approved",
  }),
  createAccountEntity({
    id: "usr-admin-1",
    email: "admin@pamilihub.ph",
    role: "admin",
    fullName: "System Administrator",
  }),
];

for (const account of accounts) {
  console.log(`• ${account.toSummary()}`);
  console.log(`  Can access /seller/orders? ${account.canAccessRoute("/seller/orders")}`);
  console.log(`  Permissions: ${account.getPermissions().join(", ")}`);
}

banner("2. ENCAPSULATION & AGGREGATION — ProductItem & SellerStore");
const bukoPie = new ProductItem({
  id: "prod-1",
  sellerId: "store-1",
  categoryId: "cat-pies",
  name: "Special San Pablo Buko Pie",
  price: 250,
  stock: 10,
});
const espasol = new ProductItem({
  id: "prod-2",
  sellerId: "store-1",
  categoryId: "cat-kakanin",
  name: "Traditional Espasol",
  price: 120,
  stock: 15,
});

const store = new SellerStore({
  id: "store-1",
  storeName: "Lola Maya's Bakeshop",
  location: "Brgy. San Rafael, San Pablo City",
  status: "approved",
  products: [bukoPie, espasol],
});

console.log(`• Store: ${store.toSummary()}`);
bukoPie.reserveStock(2);
console.log(`• Reserved 2 Buko Pies -> ${bukoPie.toSummary()}`);

banner("3. COMPOSITION & ASSOCIATION — CheckoutPlanner -> Order + OrderItems");
const orders = CheckoutPlanner.splitBySeller(
  "usr-cust-1",
  [
    {
      productId: bukoPie.getId(),
      productName: bukoPie.getName(),
      sellerId: "store-1",
      quantity: 2,
      unitPrice: bukoPie.getPrice(),
    },
    {
      productId: "prod-3",
      productName: "Roasted Barako Coffee",
      sellerId: "store-2",
      quantity: 1,
      unitPrice: 180,
    },
  ],
  "mockpay"
);

for (const order of orders) {
  console.log(`• ${order.toSummary()}`);
}

banner("4. ABSTRACTION & POLYMORPHISM — PaymentProcessor");
const processors: PaymentProcessor[] = [
  createPaymentProcessor("mockpay", orders[0].getId(), orders[0].calculateTotal()),
  createPaymentProcessor("cod", orders[1].getId(), orders[1].calculateTotal()),
];

for (const processor of processors) {
  const outcome = processor.process("approve");
  console.log(`• [${outcome.method.toUpperCase()}] ${outcome.message} (status: ${outcome.paymentStatus})`);
}

console.log("\nOOP demonstration completed successfully.\n");
