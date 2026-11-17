import { describe, it, expect } from "vitest";
import {
  buildAddress,
  parseInitialAddress,
  formatBarangayName,
  dedupeAndSort,
  escapeRegExp,
} from "@/lib/address/format";

const barangays = [
  { code: "0403424001", name: "Bagong Bayan II-A" },
  { code: "0403424002", name: "Bagong Pook VI-C" },
  { code: "0403424003", name: "Barangay I-A" },
  { code: "0403424004", name: "San Francisco" },
  { code: "0403424005", name: "San Rafael" },
];

describe("formatBarangayName", () => {
  it("adds Brgy. prefix when missing", () => {
    expect(formatBarangayName("Concepcion")).toBe("Brgy. Concepcion");
  });

  it("keeps existing Brgy. / Barangay prefix", () => {
    expect(formatBarangayName("Brgy. Concepcion")).toBe("Brgy. Concepcion");
    expect(formatBarangayName("Barangay Concepcion")).toBe("Barangay Concepcion");
  });

  it("trims whitespace", () => {
    expect(formatBarangayName("  Concepcion  ")).toBe("Brgy. Concepcion");
  });
});

describe("buildAddress", () => {
  it("composes street + barangay + fixed tail", () => {
    const b = barangays[0];
    expect(buildAddress("Purok 3", b)).toBe(
      "Purok 3, Brgy. Bagong Bayan II-A, City of San Pablo, Laguna, CALABARZON"
    );
  });

  it("omits empty street", () => {
    const b = barangays[0];
    expect(buildAddress("", b)).toBe(
      "Brgy. Bagong Bayan II-A, City of San Pablo, Laguna, CALABARZON"
    );
  });

  it("collapses double spaces in street", () => {
    const b = barangays[0];
    expect(buildAddress("Purok   3  Block 2", b)).toBe(
      "Purok 3 Block 2, Brgy. Bagong Bayan II-A, City of San Pablo, Laguna, CALABARZON"
    );
  });
});

describe("parseInitialAddress", () => {
  it("returns empty for blank input", () => {
    expect(parseInitialAddress("", barangays)).toEqual({ street: "", code: "" });
    expect(parseInitialAddress("   ", barangays)).toEqual({ street: "", code: "" });
  });

  it("extracts street when no barangay matches", () => {
    const { street, code } = parseInitialAddress("Purok 3, Block 2", barangays);
    expect(street).toBe("Purok 3, Block 2");
    expect(code).toBe("");
  });

  it("matches barangay by full name (case-insensitive)", () => {
    const { street, code } = parseInitialAddress(
      "Purok 3, San Francisco, City of San Pablo, Laguna",
      barangays
    );
    expect(code).toBe("0403424004");
    expect(street).toBe("Purok 3");
  });

  it("matches barangay alias without Brgy. prefix", () => {
    const { street, code } = parseInitialAddress(
      "Block 5, Concepcion, San Pablo City",
      [{ code: "0403424009", name: "Concepcion" }]
    );
    expect(code).toBe("0403424009");
    expect(street).toBe("Block 5");
  });

  it("prefers longest match when names overlap", () => {
    const bs = [
      { code: "a", name: "San" },
      { code: "b", name: "San Francisco" },
    ];
    const { code } = parseInitialAddress("Purok 1, San Francisco", bs);
    expect(code).toBe("b");
  });
});

describe("dedupeAndSort", () => {
  it("removes duplicates by code and sorts by name", () => {
    const list = [
      { code: "2", name: "Zebra" },
      { code: "1", name: "Alpha" },
      { code: "1", name: "Alpha" },
      { code: "3", name: "beta" },
      { code: "", name: "NoCode" },
      { code: "4", name: "" },
    ];
    const result = dedupeAndSort(list);
    expect(result.map((b) => b.code)).toEqual(["1", "3", "2"]);
    expect(result.map((b) => b.name)).toEqual(["Alpha", "beta", "Zebra"]);
  });
});

describe("escapeRegExp", () => {
  it("escapes regex special characters", () => {
    expect(escapeRegExp("Brgy. I-A (Poblacion)")).toBe(
      "Brgy\\. I-A \\(Poblacion\\)"
    );
  });
});
