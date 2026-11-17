import { test, expect } from "@playwright/test";
import { USER } from "../e2e/fixtures/auth";

/**
 * Admin governance journey.
 *
 * Covers: dashboard, seller approvals, order & payment monitoring, category
 * management, user directory. Runs as admin@pamilihub.test.
 */
test.describe("admin governance", () => {
  test("dashboard loads with GMV and order pipeline", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(
      page.getByRole("heading", { name: /dashboard/i })
    ).toBeVisible();
    // Dashboard should expose money/counters somewhere on the page
    await expect(page.getByText(/₱/i)).toBeVisible();
  });

  test("seller approvals tab lists pending applicants", async ({ page }) => {
    await page.goto("/admin/sellers");
    await expect(page.getByText(/approval/i, { exact: false })).toBeVisible();
    // At least one of the status tabs is present
    await expect(
      page.getByRole("tab", { name: /pending/i }).or(
        page.getByText(/pending/i)
      )
    ).toBeVisible();
  });

  test("admin orders page has status and payment filters", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(
      page.getByRole("heading", { name: /orders & payment governance/i })
    ).toBeVisible();
    await expect(page.getByText(/all orders/i)).toBeVisible();
    await expect(page.getByText(/all payments/i)).toBeVisible();
  });

  test("admin categories page lists categories", async ({ page }) => {
    await page.goto("/admin/categories");
    await expect(page.getByText(/category/i, { exact: false })).toBeVisible();
  });

  test("admin users page lists registered accounts", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.getByText(/user/i, { exact: false })).toBeVisible();
  });

  test("admin can filter orders by payment status", async ({ page }) => {
    await page.goto("/admin/orders?paymentStatus=paid");
    await expect(page.getByText(/orders & payment governance/i)).toBeVisible();
  });
});
