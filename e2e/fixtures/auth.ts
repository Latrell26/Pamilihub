/**
 * Shared e2e fixtures: demo account credentials and the storageState path
 * produced by global-setup.ts. Journey specs reference these so role and
 * auth file stay in one place.
 */

export const PASSWORD = "password123";

export const USER = {
  customer: {
    email: "ana@pamilihub.test",
    password: PASSWORD,
    storageState: "playwright/.auth/customer.json",
  },
  seller: {
    email: "maria@pamilihub.test",
    password: PASSWORD,
    storageState: "playwright/.auth/seller.json",
  },
  admin: {
    email: "admin@pamilihub.test",
    password: PASSWORD,
    storageState: "playwright/.auth/admin.json",
  },
} as const;

export type Role = keyof typeof USER;
