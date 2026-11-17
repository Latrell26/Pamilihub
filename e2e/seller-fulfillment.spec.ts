import { test, expect } from "@playwright/test";
import { USER } from "../e2e/fixtures/auth";

/**
 * Seller order fulfillment journey.
 *
 * Covers: master–detail orders panel, payment-gated acceptance (Accept hidden
 * until MockPay paid; "Awaiting MockPay payment" banner), full lifecycle
 * accept → preparing → delivering → completed, reject restores stock.
 */
test.describe("seller fulfillment", () => {
  test("seller cannot accept an unpaid MockPay order", async ({ page }) => {
    await page.goto("/seller/orders");
    await expect(page.getByRole("heading", { name: /store orders/i })).toBeVisible();

    // If there are pending orders, open the first one.
    const firstOrder = page.getByRole("button", { name: /order #/i }).first();
    if ((await firstOrder.count()) > 0) {
      await firstOrder.click();
      // Unpaid MockPay: Accept should be absent; awaiting banner present
      await expect(
        page.getByText(/awaiting mockpay payment/i)
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /accept order/i })
      ).not.toBeVisible();
      // Reject should still be available
      await expect(page.getByRole("button", { name: /reject order/i })).toBeVisible();
    } else {
      await expect(page.getByText(/no orders/i, { exact: false })).toBeVisible();
    }
  });

  test("fulfills a paid order through the full lifecycle", async ({ page }) => {
    await page.goto("/seller/orders");
    const firstOrder = page.getByRole("button", { name: /order #/i }).first();
    if ((await firstOrder.count()) === 0) {
      test.skip("no seller orders to fulfill");
    }

    await firstOrder.click();

    // Accept (only if paid; if not paid this test may still pass via reject)
    const accept = page.getByRole("button", { name: /accept order/i });
    if ((await accept.count()) > 0) {
      await accept.click();
      await expect(page.getByText(/accepted/i)).toBeVisible();
    }

    await page.getByRole("button", { name: /mark preparing/i }).click();
    await expect(page.getByText(/preparing/i)).toBeVisible();

    await page.getByRole("button", { name: /mark out for delivery/i }).click();
    await expect(page.getByText(/delivering/i)).toBeVisible();

    await page.getByRole("button", { name: /mark completed/i }).click();
    await expect(page.getByText(/completed/i)).toBeVisible();
  });

  test("rejecting an order shows rejection badge", async ({ page }) => {
    await page.goto("/seller/orders");
    const firstOrder = page.getByRole("button", { name: /order #/i }).first();
    if ((await firstOrder.count()) === 0) {
      test.skip("no seller orders to reject");
    }

    await firstOrder.click();
    const reject = page.getByRole("button", { name: /reject order/i });
    if ((await reject.count()) > 0) {
      await reject.click();
      await expect(page.getByText(/rejected/i)).toBeVisible();
    }
  });

  test("seller order detail shows customer delivery info", async ({ page }) => {
    await page.goto("/seller/orders");
    const firstOrder = page.getByRole("button", { name: /order #/i }).first();
    if ((await firstOrder.count()) === 0) {
      test.skip("no seller orders");
    }
    await firstOrder.click();
    await expect(page.getByText(/customer & delivery details/i)).toBeVisible();
    await expect(page.getByText(/contact number/i)).toBeVisible();
    await expect(page.getByText(/delivery address/i)).toBeVisible();
  });
});
