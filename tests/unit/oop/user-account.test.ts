import { describe, it, expect } from "vitest";
import {
  BaseEntity,
  UserAccount,
  CustomerAccount,
  SellerAccount,
  AdminAccount,
  createAccountEntity,
} from "@/lib/oop";

describe("OOP: UserAccount Hierarchy (Inheritance, Abstraction, Polymorphism, Encapsulation)", () => {
  it("constructs role-specific subclasses via createAccountEntity factory", () => {
    const customer = createAccountEntity({
      id: "u-1",
      email: "juan@example.com",
      role: "customer",
      fullName: "Juan Dela Cruz",
    });
    const seller = createAccountEntity({
      id: "u-2",
      email: "maria@example.com",
      role: "seller",
      fullName: "Maria Santos",
      storeId: "s-1",
      storeName: "Lola Maya's Bakeshop",
      approvalStatus: "approved",
    });
    const admin = createAccountEntity({
      id: "u-3",
      email: "admin@pamilihub.test",
      role: "admin",
      fullName: "Platform Admin",
    });

    expect(customer).toBeInstanceOf(CustomerAccount);
    expect(customer).toBeInstanceOf(UserAccount);
    expect(customer).toBeInstanceOf(BaseEntity);

    expect(seller).toBeInstanceOf(SellerAccount);
    expect(admin).toBeInstanceOf(AdminAccount);
  });

  it("enforces encapsulation on fullName setter", () => {
    const customer = new CustomerAccount("u-1", "a@b.com", "Juan");
    expect(() => customer.setFullName("A")).toThrow("at least 2 characters");
    customer.setFullName("Juanito");
    expect(customer.getFullName()).toBe("Juanito");
  });

  it("demonstrates polymorphism across UserAccount[] for route access and permissions", () => {
    const accounts: UserAccount[] = [
      new CustomerAccount("c1", "c@test.com", "Buyer"),
      new SellerAccount("s1", "s@test.com", "Baker", "st-1", "Buko Pie Co", "approved"),
      new SellerAccount("s2", "s2@test.com", "Pending", "st-2", "New Store", "pending"),
      new AdminAccount("a1", "a@test.com", "Admin"),
    ];

    expect(accounts[0].canAccessRoute("/checkout")).toBe(true);
    expect(accounts[0].canAccessRoute("/admin/sellers")).toBe(false);

    expect(accounts[1].canAccessRoute("/seller/orders")).toBe(true);
    expect(accounts[1].getPermissions()).toContain("products:create");

    expect(accounts[2].getPermissions()).not.toContain("products:create");

    expect(accounts[3].canAccessRoute("/admin/dashboard")).toBe(true);
    expect(accounts[3].getPermissions()).toContain("sellers:review");
  });
});
