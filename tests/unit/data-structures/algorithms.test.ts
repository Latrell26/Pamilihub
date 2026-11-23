import { describe, it, expect } from "vitest";
import { mergeSort, binarySearch } from "@/lib/data-structures/algorithms";

describe("mergeSort", () => {
  it("sorts numbers ascending", () => {
    const arr = [38, 27, 43, 3, 9, 82, 10];
    expect(mergeSort([...arr])).toEqual([3, 9, 10, 27, 38, 43, 82]);
  });

  it("sorts already sorted array", () => {
    expect(mergeSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts reverse sorted array", () => {
    expect(mergeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("handles duplicates", () => {
    expect(mergeSort([3, 1, 2, 1, 3, 2])).toEqual([1, 1, 2, 2, 3, 3]);
  });

  it("handles empty and single element", () => {
    expect(mergeSort([])).toEqual([]);
    expect(mergeSort([42])).toEqual([42]);
  });

  it("sorts strings", () => {
    expect(mergeSort(["banana", "apple", "cherry"])).toEqual([
      "apple",
      "banana",
      "cherry",
    ]);
  });

  it("is stable (equal elements keep relative order)", () => {
    type Item = { value: number; id: string };
    const arr: Item[] = [
      { value: 2, id: "a" },
      { value: 1, id: "b" },
      { value: 2, id: "c" },
    ];
    const result = mergeSort([...arr], (x, y) => x.value - y.value);
    expect(result.map((x) => x.id)).toEqual(["b", "a", "c"]);
  });
});

describe("binarySearch", () => {
  it("finds existing element", () => {
    const arr = [1, 3, 5, 7, 9, 11, 13];
    expect(binarySearch(arr, 7)).toBe(3);
    expect(binarySearch(arr, 1)).toBe(0);
    expect(binarySearch(arr, 13)).toBe(6);
  });

  it("returns -1 for missing element", () => {
    const arr = [1, 3, 5, 7, 9];
    expect(binarySearch(arr, 4)).toBe(-1);
    expect(binarySearch(arr, 10)).toBe(-1);
    expect(binarySearch(arr, 0)).toBe(-1);
  });

  it("handles empty array", () => {
    expect(binarySearch([], 1)).toBe(-1);
  });

  it("handles single element", () => {
    expect(binarySearch([42], 42)).toBe(0);
    expect(binarySearch([42], 7)).toBe(-1);
  });

  it("works with custom comparator", () => {
    const arr = [10, 20, 30, 40, 50];
    expect(binarySearch(arr, 30, (a, b) => a - b)).toBe(2);
    expect(binarySearch(arr, 25, (a, b) => a - b)).toBe(-1);
  });

  it("works with strings", () => {
    const arr = ["apple", "banana", "cherry"];
    expect(binarySearch(arr, "banana")).toBe(1);
    expect(binarySearch(arr, "date")).toBe(-1);
  });
});
