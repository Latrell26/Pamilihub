import { test, expect } from "@playwright/test";

/**
 * Security & role-boundary tests.
 *
 * Confirms server-side role guards block cross-role access both in the UI
 * (redirects) and that unauthenticated guests can't reach role pages.
 */
test.describe("security", () => {
  test("guest is redirected from /admin/dashboard to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/.*\/login/);
  });

  test("guest is redirected from /seller/orders to login", async ({ page }) => {
    await page.goto("/seller/orders");
    await expect(page).toHaveURL(/.*\/login/);
  });

  test("customer cannot reach admin pages", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("textbox", { name: /email/i }).fill("ana@pamilihub.test");
    await page.getByRole("textbox", { name: /password/i }).fill("password123");
    await page.getByRole("button", { name: /log in/i }).click();
    await page.waitForURL(/.*\/products/);

    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/.*\/unauthorized/);
  });

  test("customer cannot reach seller pages", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("textbox", { name: /email/i }).fill("ana@pamilihub.test");
    await page.getByRole("textbox", { name: /password/i }).fill("password123");
    await page.getByRole("button", { name: /log in/i }).click();
    await page.waitForURL(/.*\/products/);

    await page.goto("/seller/orders");
    await expect(page).toHaveURL(/.*\/unauthorized/);
  });

  test("seller cannot reach admin pages", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("textbox", { name: /email/i }).fill("maria@pamilihub.test");
    await page.getByRole("textbox", { name: /password/i }).fill("password123");
    await page.getByRole("button", { name: /log in/i }).click();
    await page.waitForURL(/.*\/seller\/orders/);

    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/.*\/unauthorized/);
  });

  test("unauthorized page shows a clear message", async ({ page }) => {
    await page.goto("/unauthorized");
    await expect(page.getByText(/unauthorized/i, { exact: false })).toBeVisible();
  });
});
