import { chromium } from "@playwright/test";
import { USER } from "../e2e/fixtures/auth";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

/**
 * Logs in each demo role once through the UI and persists the session cookie
 * to playwright/.auth/<role>.json. Every journey spec reuses storageState so
 * tests don't re-authenticate (and don't hit Supabase auth rate limits).
 *
 * Demo accounts (from supabase/seed.sql), password `password123`:
 *   customer: ana@pamilihub.test
 *   seller:   maria@pamilihub.test  (Lola Mayas Bakeshop)
 *   admin:    admin@pamilihub.test
 */
export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  async function login(role: keyof typeof USER, email: string) {
    await page.goto(`${BASE}/login`);
    await page.getByRole("textbox", { name: /email/i }).fill(email);
    await page.getByRole("textbox", { name: /password/i }).fill("password123");
    await page.getByRole("button", { name: /log in/i }).click();

    const expectedUrl =
      role === "customer"
        ? /.*\/products/
        : role === "seller"
        ? /.*\/seller\/orders/
        : /.*\/admin\/dashboard/;
    await page.waitForURL(expectedUrl);
    await page.context().storageState({ path: USER[role].storageState });
  }

  await login("customer", "ana@pamilihub.test");
  await login("seller", "maria@pamilihub.test");
  await login("admin", "admin@pamilihub.test");

  await browser.close();
}
