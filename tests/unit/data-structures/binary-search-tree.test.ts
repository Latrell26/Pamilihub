import { describe, it, expect } from "vitest";
import { BinarySearchTree } from "@/lib/data-structures/binary-search-tree";

describe("BinarySearchTree", () => {
  it("starts empty", () => {
    const bst = new BinarySearchTree<number, string>();
    expect(bst.size).toBe(0);
    expect(bst.isEmpty).toBe(true);
  });

  it("insert and search", () => {
    const bst = new BinarySearchTree<number, string>();
    bst.insert(50, "fifty");
    bst.insert(30, "thirty");
    bst.insert(70, "seventy");
    bst.insert(20, "twenty");
    bst.insert(40, "forty");
    bst.insert(60, "sixty");
    bst.insert(80, "eighty");

    expect(bst.size).toBe(7);
    expect(bst.search(50)).toBe("fifty");
    expect(bst.search(30)).toBe("thirty");
    expect(bst.search(20)).toBe("twenty");
    expect(bst.search(40)).toBe("forty");
    expect(bst.search(70)).toBe("seventy");
    expect(bst.search(60)).toBe("sixty");
    expect(bst.search(80)).toBe("eighty");
    expect(bst.search(99)).toBeUndefined();
  });

  it("update existing key does not increase size", () => {
    const bst = new BinarySearchTree<number, string>();
    bst.insert(1, "a");
    bst.insert(1, "b");
    expect(bst.size).toBe(1);
    expect(bst.search(1)).toBe("b");
  });

  it("has", () => {
    const bst = new BinarySearchTree<string, number>();
    bst.insert("a", 1);
    expect(bst.has("a")).toBe(true);
    expect(bst.has("b")).toBe(false);
  });

  it("delete leaf", () => {
    const bst = new BinarySearchTree<number, string>();
    bst.insert(5, "five");
    bst.insert(3, "three");
    bst.insert(7, "seven");
    expect(bst.delete(3)).toBe(true);
    expect(bst.has(3)).toBe(false);
    expect(bst.size).toBe(2);
    expect(bst.search(5)).toBe("five");
    expect(bst.search(7)).toBe("seven");
  });

  it("delete node with one child", () => {
    const bst = new BinarySearchTree<number, string>();
    bst.insert(5, "five");
    bst.insert(3, "three");
    bst.insert(4, "four");
    expect(bst.delete(3)).toBe(true);
    expect(bst.has(3)).toBe(false);
    expect(bst.has(4)).toBe(true);
    expect(bst.size).toBe(2);
  });

  it("delete node with two children", () => {
    const bst = new BinarySearchTree<number, string>();
    bst.insert(50, "fifty");
    bst.insert(30, "thirty");
    bst.insert(70, "seventy");
    bst.insert(20, "twenty");
    bst.insert(40, "forty");
    bst.insert(60, "sixty");
    bst.insert(80, "eighty");

    expect(bst.delete(50)).toBe(true);
    expect(bst.has(50)).toBe(false);
    expect(bst.size).toBe(6);
    // In-order should still be sorted
    const keys = bst.toArray().map((e) => e.key);
    expect(keys).toEqual([20, 30, 40, 60, 70, 80]);
  });

  it("delete missing key returns false", () => {
    const bst = new BinarySearchTree<number, string>();
    bst.insert(1, "one");
    expect(bst.delete(99)).toBe(false);
    expect(bst.size).toBe(1);
  });

  it("minKey and maxKey", () => {
    const bst = new BinarySearchTree<number, string>();
    bst.insert(50, "fifty");
    bst.insert(30, "thirty");
    bst.insert(70, "seventy");
    bst.insert(20, "twenty");
    expect(bst.minKey()).toBe(20);
    expect(bst.maxKey()).toBe(70);
  });

  it("inOrder yields sorted entries", () => {
    const bst = new BinarySearchTree<number, string>();
    bst.insert(50, "fifty");
    bst.insert(30, "thirty");
    bst.insert(70, "seventy");
    bst.insert(20, "twenty");
    bst.insert(40, "forty");
    bst.insert(60, "sixty");
    bst.insert(80, "eighty");

    const entries = bst.toArray();
    expect(entries.map((e) => e.key)).toEqual([20, 30, 40, 50, 60, 70, 80]);
    expect(entries.map((e) => e.value)).toEqual([
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
    ]);
  });

  it("height", () => {
    const bst = new BinarySearchTree<number, string>();
    expect(bst.height).toBe(0);
    bst.insert(1, "a");
    expect(bst.height).toBe(1);
    bst.insert(2, "b");
    bst.insert(3, "c");
    expect(bst.height).toBe(3);
  });

  it("clear empties", () => {
    const bst = new BinarySearchTree<number, string>();
    bst.insert(1, "a");
    bst.insert(2, "b");
    bst.clear();
    expect(bst.size).toBe(0);
    expect(bst.isEmpty).toBe(true);
    expect(bst.has(1)).toBe(false);
  });

  it("custom comparator (descending)", () => {
    const bst = new BinarySearchTree<number, string>((a, b) => b - a);
    bst.insert(1, "one");
    bst.insert(3, "three");
    bst.insert(2, "two");
    expect(bst.minKey()).toBe(3);
    expect(bst.maxKey()).toBe(1);
    const entries = bst.toArray();
    expect(entries.map((e) => e.key)).toEqual([3, 2, 1]);
  });
});
