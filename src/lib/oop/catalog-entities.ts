import { BaseEntity } from "./base-entity";
import type { StockManaged } from "./contracts";
import type { SellerApprovalStatus } from "./user-account";

/**
 * Represents a local food product listed on (SP) Pamilihub.
 *
 * Demonstrates:
 * - Encapsulation: `price` and `stock` are `private` and can only be mutated
 *   through validated methods (`setPrice`, `reserveStock`, `restoreStock`).
 * - Inheritance: extends `BaseEntity`.
 * - Abstraction: implements `StockManaged`.
 */
export class ProductItem extends BaseEntity implements StockManaged {
  private readonly sellerId: string;
  private readonly categoryId: string;
  private name: string;
  private price: number;
  private stock: number;

  constructor(params: {
    id: string;
    sellerId: string;
    categoryId: string;
    name: string;
    price: number;
    stock: number;
    createdAt?: Date;
  }) {
    super(params.id, params.createdAt);
    this.sellerId = params.sellerId;
    this.categoryId = params.categoryId;
    this.name = params.name.trim();
    this.price = 0;
    this.stock = 0;
    this.setName(params.name);
    this.setPrice(params.price);
    this.setStock(params.stock);
  }

  public getSellerId(): string {
    return this.sellerId;
  }

  public getCategoryId(): string {
    return this.categoryId;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error("Product name cannot be empty.");
    }
    this.name = trimmed;
  }

  public getPrice(): number {
    return this.price;
  }

  public setPrice(price: number): void {
    if (!Number.isFinite(price) || price < 0) {
      throw new Error("Product price cannot be negative.");
    }
    this.price = Number(price.toFixed(2));
  }

  public getStock(): number {
    return this.stock;
  }

  public setStock(stock: number): void {
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error("Product stock must be a non-negative integer.");
    }
    this.stock = stock;
  }

  public hasSufficientStock(quantity: number): boolean {
    return Number.isInteger(quantity) && quantity > 0 && this.stock >= quantity;
  }

  public reserveStock(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Reserve quantity must be a positive integer.");
    }
    if (this.stock < quantity) {
      throw new Error(
        `Insufficient stock for "${this.name}" (have ${this.stock}, need ${quantity}).`
      );
    }
    this.stock -= quantity;
  }

  public restoreStock(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Restore quantity must be a positive integer.");
    }
    this.stock += quantity;
  }

  public override toSummary(): string {
    return `${this.name} — ₱${this.price.toFixed(2)} (${this.stock} in stock)`;
  }
}

/**
 * Represents a San Pablo City seller store.
 *
 * Demonstrates:
 * - Aggregation (`has-a`): `SellerStore` aggregates `ProductItem[]` whose
 *   lifecycles can exist independently (e.g., referenced in search or cart).
 */
export class SellerStore extends BaseEntity {
  private storeName: string;
  private location: string;
  private status: SellerApprovalStatus;
  private readonly products: ProductItem[] = [];

  constructor(params: {
    id: string;
    storeName: string;
    location: string;
    status?: SellerApprovalStatus;
    products?: ProductItem[];
  }) {
    super(params.id);
    this.storeName = params.storeName.trim();
    this.location = params.location.trim();
    this.status = params.status ?? "pending";
    if (params.products) {
      for (const product of params.products) {
        this.addProduct(product);
      }
    }
  }

  public getStoreName(): string {
    return this.storeName;
  }

  public getLocation(): string {
    return this.location;
  }

  public getStatus(): SellerApprovalStatus {
    return this.status;
  }

  public isApproved(): boolean {
    return this.status === "approved";
  }

  public addProduct(product: ProductItem): void {
    if (product.getSellerId() !== this.id) {
      throw new Error(
        `Product "${product.getName()}" belongs to seller ${product.getSellerId()}, not ${this.id}.`
      );
    }
    this.products.push(product);
  }

  public getProducts(): ProductItem[] {
    return [...this.products];
  }

  public getAvailableProducts(): ProductItem[] {
    if (!this.isApproved()) return [];
    return this.products.filter((p) => p.getStock() > 0);
  }

  public override toSummary(): string {
    return `${this.storeName} (${this.location}) [${this.status}] — ${this.products.length} products`;
  }
}
