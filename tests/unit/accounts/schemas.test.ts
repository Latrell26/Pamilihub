import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  sellerApplicationSchema,
} from "@/modules/accounts/schemas";

describe("registerSchema", () => {
  const base = {
    email: "ana@pamilihub.test",
    password: "Password123!",
    full_name: "Ana Dela Cruz",
  };

  it("accepts valid registration", () => {
    expect(registerSchema.safeParse(base).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(registerSchema.safeParse({ ...base, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects missing full name", () => {
    expect(registerSchema.safeParse({ ...base, full_name: "" }).success).toBe(false);
  });

  it("accepts optional phone and address", () => {
    expect(
      registerSchema.safeParse({ ...base, phone: "09171234567", address: "Brgy. San Rafael" }).success
    ).toBe(true);
    expect(registerSchema.safeParse(base).success).toBe(true);
  });
});

describe("loginSchema", () => {
  it("accepts valid login", () => {
    expect(
      loginSchema.safeParse({ email: "ana@pamilihub.test", password: "password123" }).success
    ).toBe(true);
  });

  it("rejects missing password", () => {
    expect(loginSchema.safeParse({ email: "ana@pamilihub.test", password: "" }).success).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(loginSchema.safeParse({ email: "nope", password: "x" }).success).toBe(false);
  });
});

describe("profileUpdateSchema", () => {
  it("accepts partial updates", () => {
    expect(profileUpdateSchema.safeParse({ full_name: "Ana" }).success).toBe(true);
    expect(profileUpdateSchema.safeParse({}).success).toBe(true);
  });

  it("rejects empty full name when provided", () => {
    expect(profileUpdateSchema.safeParse({ full_name: "" }).success).toBe(false);
  });
});

describe("sellerApplicationSchema", () => {
  const base = {
    store_name: "Lola Mayas Bakeshop",
    description: "Buko pie and espasol",
    location: "Brgy. San Rafael, San Pablo City",
  };

  it("accepts valid application", () => {
    expect(sellerApplicationSchema.safeParse(base).success).toBe(true);
  });

  it("rejects missing store name", () => {
    expect(sellerApplicationSchema.safeParse({ ...base, store_name: "" }).success).toBe(false);
  });

  it("rejects missing location", () => {
    expect(sellerApplicationSchema.safeParse({ ...base, location: "" }).success).toBe(false);
  });

  it("accepts optional description", () => {
    expect(sellerApplicationSchema.safeParse({ ...base, description: "" }).success).toBe(true);
  });
});
