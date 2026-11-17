import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "github" : "list",

  // Use storageState so each role logs in once (global-setup) and reuses the cookie.
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "guest",
      use: { ...devices["Desktop Chrome"], storageState: { cookies: [], origins: [] } },
    },
    {
      name: "customer",
      use: { ...devices["Desktop Chrome"], storageState: "playwright/.auth/customer.json" },
    },
    {
      name: "seller",
      use: { ...devices["Desktop Chrome"], storageState: "playwright/.auth/seller.json" },
    },
    {
      name: "admin",
      use: { ...devices["Desktop Chrome"], storageState: "playwright/.auth/admin.json" },
    },
  ],

  // Dev server must be started separately (`pnpm run dev` on :3001).
  // webServer disabled to avoid port conflicts in this environment.

  globalSetup: require.resolve("./e2e/global-setup.ts"),
});
