import { describe, it, expect } from "vitest";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  productCreateSchema,
  productUpdateSchema,
} from "@/modules/catalog/schemas";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("categoryCreateSchema", () => {
  it("accepts valid category name", () => {
    expect(categoryCreateSchema.safeParse({ name: "Pies & Pastries" }).success).toBe(true);
  });

  it("rejects empty name", () => {
    expect(categoryCreateSchema.safeParse({ name: "" }).success).toBe(false);
  });
});

describe("categoryUpdateSchema", () => {
  it("accepts valid update", () => {
    expect(
      categoryUpdateSchema.safeParse({ id: VALID_UUID, name: "Coffee" }).success
    ).toBe(true);
  });

  it("rejects non-UUID id", () => {
    expect(categoryUpdateSchema.safeParse({ id: "nope", name: "Coffee" }).success).toBe(false);
  });
});

describe("productCreateSchema", () => {
  const base = {
    category_id: VALID_UUID,
    name: "Buko Pie",
    description: "Fresh buko pie",
    price: 450,
    stock: 10,
  };

  it("accepts valid product", () => {
    expect(productCreateSchema.safeParse(base).success).toBe(true);
  });

  it("coerces price and stock from strings", () => {
    const result = productCreateSchema.safeParse({ ...base, price: "450", stock: "10" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.price).toBe("number");
      expect(typeof result.data.stock).toBe("number");
    }
  });

  it("rejects negative price and stock", () => {
    expect(productCreateSchema.safeParse({ ...base, price: -1 }).success).toBe(false);
    expect(productCreateSchema.safeParse({ ...base, stock: -1 }).success).toBe(false);
  });

  it("rejects non-integer stock", () => {
    expect(productCreateSchema.safeParse({ ...base, stock: 1.5 }).success).toBe(false);
  });
});

describe("productUpdateSchema", () => {
  it("accepts partial updates (id still required)", () => {
    expect(productUpdateSchema.safeParse({ id: VALID_UUID }).success).toBe(true);
    expect(
      productUpdateSchema.safeParse({ id: VALID_UUID, stock: 5 }).success
    ).toBe(true);
  });

  it("rejects non-UUID id when provided", () => {
    expect(productUpdateSchema.safeParse({ id: "nope" }).success).toBe(false);
  });
});
