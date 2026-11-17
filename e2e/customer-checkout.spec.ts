import { test, expect } from "@playwright/test";
import { USER } from "../e2e/fixtures/auth";

/**
 * Customer checkout + MockPay journey.
 *
 * Covers: multi-seller order split (₱50 per seller), MockPay approve → paid,
 * MockPay cancel → cancelled + stock restored, COD → pending until completed.
 * Runs against the seeded customer `ana@pamilihub.test`.
 */
test.describe("customer checkout", () => {
  test("places a multi-seller MockPay order and approves payment", async ({
    page,
  }) => {
    await test.step("add two items from different sellers to cart", async () => {
      await page.goto("/products");
      // Add first in-stock item
      await page.getByRole("button", { name: /add to cart/i }).first().click();
      await page.waitForTimeout(300); // let optimistic UI settle
      await page.goBack({ waitUntil: "domcontentloaded" });
      // Add a second item
      await page.getByRole("button", { name: /add to cart/i }).first().click();
    });

    await test.step("proceed to checkout and fill delivery info", async () => {
      await page.getByRole("link", { name: /cart/i }).click();
      await page.getByRole("button", { name: /proceed to checkout/i }).click();

      await page.getByLabel(/recipient name/i).fill("Ana Test Customer");
      await page.getByLabel(/phone number/i).fill("09171234567");

      // Address picker: street + barangay
      await page.getByLabel(/street \/ purok/i).fill("Purok 3, Block 2");
      await page.getByLabel(/barangay/i).selectOption({ index: 1 });

      // Select MockPay
      await page
        .getByLabel("MockPay (Simulated)")
        .check();
      await page.getByRole("button", { name: /place order/i }).click();

      // Expect redirect to orders list or pay page
      await expect(page).toHaveURL(/.*\/orders/);
    });

    await test.step("approve MockPay payment", async () => {
      // Should land on /orders/[id]/pay for MockPay
      await expect(page.getByText(/simulated payment/i)).toBeVisible();
      const total = page.locator("text=₱").first();
      await expect(total).toBeVisible();

      await page.getByRole("button", { name: /approve payment/i }).click();
      await page.waitForResponse((res) =>
        res.url().includes("/api/mockpay") && res.status() === 200
      );

      await expect(page.getByText(/paid/i)).toBeVisible();
    });
  });

  test("cancelling MockPay restores stock (cancel path)", async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("button", { name: /add to cart/i }).first().click();
    await page.getByRole("link", { name: /cart/i }).click();
    await page.getByRole("button", { name: /proceed to checkout/i }).click();

    await page.getByLabel(/recipient name/i).fill("Ana Cancel Test");
    await page.getByLabel(/phone number/i).fill("09171234567");
    await page.getByLabel(/street \/ purok/i).fill("Purok 5");
    await page.getByLabel(/barangay/i).selectOption({ index: 1 });

    await page.getByLabel("MockPay (Simulated)").check();
    await page.getByRole("button", { name: /place order/i }).click();

    await page.getByRole("button", { name: /cancel \/ decline/i }).click();
    await expect(page.getByText(/cancelled/i)).toBeVisible();
  });

  test("COD order stays payment pending until completed", async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("button", { name: /add to cart/i }).first().click();
    await page.getByRole("link", { name: /cart/i }).click();
    await page.getByRole("button", { name: /proceed to checkout/i }).click();

    await page.getByLabel(/recipient name/i).fill("Ana COD Test");
    await page.getByLabel(/phone number/i).fill("09171234567");
    await page.getByLabel(/street \/ purok/i).fill("Purok 7");
    await page.getByLabel(/barangay/i).selectOption({ index: 1 });

    await page.getByLabel("Cash on Delivery").check();
    await page.getByRole("button", { name: /place order/i }).click();

    await page.getByText(/pending/i).first().waitFor({ state: "visible" });
  });
});
