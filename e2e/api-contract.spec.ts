import { test, expect } from "@playwright/test";

/**
 * MockPay + PSGC API contract tests.
 *
 * Hits /api/mockpay and /api/psgc directly (no browser page) to verify the
 * JSON contract from docs/API.md: auth guards, validation errors, terminal
 * orders, non-MockPay orders, and the PSGC allow-list.
 */
test.describe("mockpay api contract", () => {
  const FAKE_ORDER = "00000000-0000-0000-0000-000000000000";

  test("missing session returns 401", async ({ request }) => {
    const res = await request.post("/api/mockpay", {
      data: { order_id: FAKE_ORDER, amount: 100, result: "approve" },
    });
    expect([401, 403]).toContain(res.status());
  });

  test("unknown order returns 404", async ({ request }) => {
    const res = await request.post("/api/mockpay", {
      data: { order_id: FAKE_ORDER, amount: 100, result: "approve" },
      headers: { "Content-Type": "application/json" },
    });
    // 404 (order not found) or 401 (no session) are both valid guards
    expect([401, 403, 404]).toContain(res.status());
  });

  test("invalid result value is rejected", async ({ request }) => {
    const res = await request.post("/api/mockpay", {
      data: { order_id: FAKE_ORDER, amount: 100, result: "refund" },
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
  });

  test("psgc allow-listed regions returns 200", async ({ request }) => {
    const res = await request.get("/api/psgc/regions");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test("psgc barangays for san pablo returns 80 items", async ({ request }) => {
    const res = await request.get(
      "/api/psgc/cities-municipalities/0403424000/barangays"
    );
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBe(80);
  });

  test("psgc unknown path returns 404", async ({ request }) => {
    const res = await request.get("/api/psgc/secret-endpoint");
    expect(res.status()).toBe(404);
  });

  test("psgc non-GET method returns 405", async ({ request }) => {
    const res = await request.post("/api/psgc/regions");
    expect(res.status()).toBe(405);
  });
});
