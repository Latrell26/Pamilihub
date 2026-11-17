import { describe, it, expect } from "vitest";
import {
  sellerReviewSchema,
  adminDeleteProductSchema,
} from "@/modules/admin/schemas";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("sellerReviewSchema", () => {
  it("accepts approve and reject", () => {
    expect(
      sellerReviewSchema.safeParse({ seller_id: VALID_UUID, action: "approve" }).success
    ).toBe(true);
    expect(
      sellerReviewSchema.safeParse({ seller_id: VALID_UUID, action: "reject" }).success
    ).toBe(true);
  });

  it("rejects invalid action", () => {
    expect(
      sellerReviewSchema.safeParse({ seller_id: VALID_UUID, action: "delete" }).success
    ).toBe(false);
  });

  it("rejects non-UUID seller id", () => {
    expect(
      sellerReviewSchema.safeParse({ seller_id: "nope", action: "approve" }).success
    ).toBe(false);
  });
});

describe("adminDeleteProductSchema", () => {
  it("accepts valid product id", () => {
    expect(adminDeleteProductSchema.safeParse({ product_id: VALID_UUID }).success).toBe(true);
  });

  it("rejects non-UUID product id", () => {
    expect(adminDeleteProductSchema.safeParse({ product_id: "nope" }).success).toBe(false);
  });
});
