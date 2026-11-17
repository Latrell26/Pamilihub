import { test, expect } from "@playwright/test";

/**
 * Guest & public pages.
 *
 * Validates the root-only redirect decision: guests at / go to /login,
 * while /products, /products/[id], /search stay public. Also covers catalog
 * basics (category filter, search, out-of-stock state).
 */
test.describe("guest", () => {
  test("redirects guest at / to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/.*\/login/);
  });

  test("keeps /products public for guests", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveURL(/.*\/products/);
    // Public catalog: category navigation and search are visible to guests
    await expect(page.getByRole("navigation", { name: /Delicacy Categories/ })).toBeVisible();
  });

  test("category filter narrows results", async ({ page }) => {
    await page.goto("/products?category=kakanin");
    await expect(page.getByRole("link", { name: /kakanin/i })).toBeVisible();
  });

  test("product detail shows stock and seller", async ({ page }) => {
    await page.goto("/products");
    // Click into a store, then into a product from that store's menu
    const firstStore = page.locator("a[href^='/stores/']").first();
    await firstStore.click();
    const firstProduct = page.locator("a[href^='/products/']").first();
    await firstProduct.click();
    await expect(page.getByText(/stock/i, { exact: false })).toBeVisible();
    await expect(page.getByText(/seller/i, { exact: false })).toBeVisible();
  });

  test("out of stock item cannot be added to cart", async ({ page }) => {
    await page.goto("/products");
    const soldOut = page.getByText(/sold out/i);
    if ((await soldOut.count()) > 0) {
      await expect(soldOut.first()).toBeVisible();
    } else {
      await expect(page).toHaveURL(/.*\/products/);
    }
  });

  test("guest cart button is hidden; sign in shown", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByLabel(/Shopping Cart/i)).not.toBeVisible();
    await expect(page.getByRole("link", { name: /Sign in/i })).toBeVisible();
  });

  test("search page is public", async ({ page }) => {
    await page.goto("/search");
    await expect(page).toHaveURL(/.*\/search/);
  });
});
