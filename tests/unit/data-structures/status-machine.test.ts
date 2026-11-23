import { describe, it, expect } from "vitest";
import {
  canTransition,
  getAllowedTransitions,
  isTerminal,
  allStatuses,
  type OrderStatus,
} from "@/modules/orders/status-machine";

describe("Order status state machine (Graph)", () => {
  it("returns all statuses", () => {
    const statuses = allStatuses();
    expect(statuses.sort()).toEqual([
      "accepted",
      "cancelled",
      "completed",
      "delivering",
      "pending",
      "preparing",
      "rejected",
    ]);
  });

  it("pending transitions to accepted or rejected", () => {
    expect(getAllowedTransitions("pending")).toEqual(
      expect.arrayContaining(["accepted", "rejected"])
    );
  });

  it("accepted transitions to preparing or cancelled", () => {
    const allowed = getAllowedTransitions("accepted");
    expect(allowed).toContain("preparing");
    expect(allowed).toContain("cancelled");
  });

  it("preparing transitions to delivering or cancelled", () => {
    const allowed = getAllowedTransitions("preparing");
    expect(allowed).toContain("delivering");
    expect(allowed).toContain("cancelled");
  });

  it("delivering transitions to completed or cancelled", () => {
    const allowed = getAllowedTransitions("delivering");
    expect(allowed).toContain("completed");
    expect(allowed).toContain("cancelled");
  });

  it("terminal statuses have no outgoing transitions", () => {
    for (const status of ["rejected", "cancelled", "completed"] as OrderStatus[]) {
      expect(getAllowedTransitions(status)).toEqual([]);
    }
  });

  it("canTransition returns true for valid direct transitions", () => {
    expect(canTransition("pending", "accepted")).toBe(true);
    expect(canTransition("accepted", "preparing")).toBe(true);
    expect(canTransition("preparing", "delivering")).toBe(true);
    expect(canTransition("delivering", "completed")).toBe(true);
    // Direct edge — cannot skip statuses
    expect(canTransition("pending", "preparing")).toBe(false);
    expect(canTransition("pending", "completed")).toBe(false);
  });

  it("canTransition returns false for invalid transitions", () => {
    expect(canTransition("pending", "preparing")).toBe(false); // skip accepted
    expect(canTransition("completed", "pending")).toBe(false); // backward
    expect(canTransition("rejected", "accepted")).toBe(false); // terminal
    expect(canTransition("cancelled", "completed")).toBe(false); // terminal
  });

  it("isTerminal returns true for terminal statuses", () => {
    expect(isTerminal("rejected")).toBe(true);
    expect(isTerminal("cancelled")).toBe(true);
    expect(isTerminal("completed")).toBe(true);
  });

  it("isTerminal returns false for non-terminal statuses", () => {
    expect(isTerminal("pending")).toBe(false);
    expect(isTerminal("accepted")).toBe(false);
    expect(isTerminal("preparing")).toBe(false);
    expect(isTerminal("delivering")).toBe(false);
  });

  it("status values match docs/DATABASE.md", () => {
    const expected: OrderStatus[] = [
      "pending",
      "accepted",
      "rejected",
      "preparing",
      "delivering",
      "completed",
      "cancelled",
    ];
    expect(allStatuses().sort()).toEqual(expected.sort());
  });
});
