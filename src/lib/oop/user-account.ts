import { BaseEntity } from "./base-entity";

export type UserRole = "customer" | "seller" | "admin";
export type SellerApprovalStatus = "pending" | "approved" | "rejected";

/**
 * Abstract base class representing an authenticated Pamilihub user.
 *
 * Demonstrates:
 * - Inheritance: extends `BaseEntity` and serves as parent for `CustomerAccount`,
 *   `SellerAccount`, and `AdminAccount` (strictly the 3 roles in AGENTS.md).
 * - Abstraction & Polymorphism: declares abstract `canAccessRoute()` and
 *   `getPermissions()` overridden by each role subclass.
 */
export abstract class UserAccount extends BaseEntity {
  protected email: string | null;
  protected fullName: string;
  protected readonly role: UserRole;

  constructor(id: string, email: string | null, fullName: string, role: UserRole) {
    super(id);
    this.email = email;
    this.fullName = fullName.trim() || "Pamilihub User";
    this.role = role;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getEmail(): string | null {
    return this.email;
  }

  public getFullName(): string {
    return this.fullName;
  }

  public setFullName(name: string): void {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      throw new Error("Full name must be at least 2 characters.");
    }
    this.fullName = trimmed;
  }

  public abstract canAccessRoute(path: string): boolean;
  public abstract getPermissions(): string[];

  public override toSummary(): string {
    return `[${this.role.toUpperCase()}] ${this.fullName} (${this.email ?? this.id})`;
  }
}

/** Customer role: browses approved delicacies, manages cart, places orders, pays via MockPay/COD. */
export class CustomerAccount extends UserAccount {
  private phone: string;
  private address: string;

  constructor(
    id: string,
    email: string | null,
    fullName: string,
    phone = "",
    address = ""
  ) {
    super(id, email, fullName, "customer");
    this.phone = phone;
    this.address = address;
  }

  public getPhone(): string {
    return this.phone;
  }

  public getAddress(): string {
    return this.address;
  }

  public canPlaceOrders(): boolean {
    return true;
  }

  public override canAccessRoute(path: string): boolean {
    if (path.startsWith("/admin") || path.startsWith("/seller")) {
      return false;
    }
    return true;
  }

  public override getPermissions(): string[] {
    return [
      "catalog:browse",
      "cart:manage",
      "orders:create",
      "orders:read_own",
      "mockpay:process",
      "seller:apply",
    ];
  }
}

/** Seller role: manages own store, products, and incoming order fulfillment once approved. */
export class SellerAccount extends UserAccount {
  private readonly storeId: string;
  private storeName: string;
  private approvalStatus: SellerApprovalStatus;

  constructor(
    id: string,
    email: string | null,
    fullName: string,
    storeId: string,
    storeName: string,
    approvalStatus: SellerApprovalStatus = "pending"
  ) {
    super(id, email, fullName, "seller");
    this.storeId = storeId;
    this.storeName = storeName;
    this.approvalStatus = approvalStatus;
  }

  public getStoreId(): string {
    return this.storeId;
  }

  public getStoreName(): string {
    return this.storeName;
  }

  public getApprovalStatus(): SellerApprovalStatus {
    return this.approvalStatus;
  }

  public isApproved(): boolean {
    return this.approvalStatus === "approved";
  }

  public canManageCatalog(): boolean {
    return this.isApproved();
  }

  public override canAccessRoute(path: string): boolean {
    if (path.startsWith("/admin")) return false;
    if (path.startsWith("/seller")) return true;
    return !path.startsWith("/checkout");
  }

  public override getPermissions(): string[] {
    const base = ["store:read_own", "orders:read_store", "orders:update_status"];
    if (this.isApproved()) {
      base.push("products:create", "products:update_own", "products:delete_own");
    }
    return base;
  }
}

/** Admin role: approves/rejects sellers, manages categories, moderates products, monitors orders. */
export class AdminAccount extends UserAccount {
  constructor(id: string, email: string | null, fullName: string) {
    super(id, email, fullName, "admin");
  }

  public canApproveSeller(): boolean {
    return true;
  }

  public override canAccessRoute(path: string): boolean {
    return path.startsWith("/admin") || path.startsWith("/products") || path === "/";
  }

  public override getPermissions(): string[] {
    return [
      "sellers:review",
      "categories:manage",
      "products:moderate",
      "orders:monitor_all",
      "users:read_all",
    ];
  }
}

/**
 * Factory helper returning the appropriate polymorphic `UserAccount` subclass
 * for a given profile role.
 */
export function createAccountEntity(params: {
  id: string;
  email: string | null;
  role: UserRole;
  fullName?: string;
  phone?: string;
  address?: string;
  storeId?: string;
  storeName?: string;
  approvalStatus?: SellerApprovalStatus;
}): UserAccount {
  const name = params.fullName ?? params.email ?? "Pamilihub User";

  switch (params.role) {
    case "admin":
      return new AdminAccount(params.id, params.email, name);
    case "seller":
      return new SellerAccount(
        params.id,
        params.email,
        name,
        params.storeId ?? "",
        params.storeName ?? "San Pablo Store",
        params.approvalStatus ?? "pending"
      );
    case "customer":
    default:
      return new CustomerAccount(
        params.id,
        params.email,
        name,
        params.phone ?? "",
        params.address ?? ""
      );
  }
}
