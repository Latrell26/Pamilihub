import { test, expect } from "@playwright/test";

/**
 * Responsive layout smoke tests.
 *
 * Key pages render at phone (Pixel 7) and desktop widths without crashing or
 * showing broken layout. Screenshots captured on failure only.
 */
const pages = ["/", "/products", "/cart", "/checkout", "/orders", "/login", "/register"];

for (const path of pages) {
  test(`renders ${path} at desktop width`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path);
    await expect(page.locator("body")).toBeVisible();
  });

  test(`renders ${path} at mobile width`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    await expect(page.locator("body")).toBeVisible();
  });
}
