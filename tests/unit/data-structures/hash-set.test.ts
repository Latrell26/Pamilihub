import { describe, it, expect } from "vitest";
import { HashSet } from "@/lib/data-structures/hash-set";

describe("HashSet", () => {
  it("starts empty", () => {
    const set = new HashSet<number>();
    expect(set.size).toBe(0);
    expect(set.isEmpty).toBe(true);
  });

  it("add and has", () => {
    const set = new HashSet<string>();
    expect(set.add("a")).toBe(true);
    expect(set.add("a")).toBe(false); // duplicate
    expect(set.add("b")).toBe(true);
    expect(set.size).toBe(2);
    expect(set.has("a")).toBe(true);
    expect(set.has("b")).toBe(true);
    expect(set.has("c")).toBe(false);
  });

  it("delete removes value", () => {
    const set = new HashSet<number>();
    set.add(1);
    set.add(2);
    set.add(3);
    expect(set.delete(2)).toBe(true);
    expect(set.delete(2)).toBe(false); // already gone
    expect(set.delete(99)).toBe(false);
    expect(set.size).toBe(2);
    expect(set.has(2)).toBe(false);
    expect(set.has(1)).toBe(true);
    expect(set.has(3)).toBe(true);
  });

  it("values returns all elements", () => {
    const set = new HashSet<string>();
    set.add("x");
    set.add("y");
    set.add("z");
    const values = set.values().sort();
    expect(values).toEqual(["x", "y", "z"]);
  });

  it("clear empties the set", () => {
    const set = new HashSet<number>();
    set.add(1);
    set.add(2);
    set.clear();
    expect(set.size).toBe(0);
    expect(set.isEmpty).toBe(true);
    expect(set.has(1)).toBe(false);
  });

  it("iterator yields all elements", () => {
    const set = new HashSet<number>();
    set.add(10);
    set.add(20);
    set.add(30);
    const collected: number[] = [];
    for (const value of [...set]) {
      collected.push(value);
    }
    expect(collected.sort()).toEqual([10, 20, 30]);
  });

  it("union", () => {
    const a = new HashSet<number>();
    a.add(1);
    a.add(2);
    const b = new HashSet<number>();
    b.add(2);
    b.add(3);
    const u = a.union(b);
    expect(u.values().sort()).toEqual([1, 2, 3]);
  });

  it("intersection", () => {
    const a = new HashSet<number>();
    a.add(1);
    a.add(2);
    a.add(3);
    const b = new HashSet<number>();
    b.add(2);
    b.add(3);
    b.add(4);
    const inter = a.intersection(b);
    expect(inter.values().sort()).toEqual([2, 3]);
  });

  it("difference", () => {
    const a = new HashSet<number>();
    a.add(1);
    a.add(2);
    a.add(3);
    const b = new HashSet<number>();
    b.add(2);
    b.add(4);
    const diff = a.difference(b);
    expect(diff.values().sort()).toEqual([1, 3]);
  });

  it("isSubsetOf", () => {
    const a = new HashSet<number>();
    a.add(1);
    a.add(2);
    const b = new HashSet<number>();
    b.add(1);
    b.add(2);
    b.add(3);
    expect(a.isSubsetOf(b)).toBe(true);
    expect(b.isSubsetOf(a)).toBe(false);
  });

  it("handles many elements (resizing)", () => {
    const set = new HashSet<number>();
    const n = 5000;
    for (let i = 0; i < n; i++) {
      set.add(i);
    }
    expect(set.size).toBe(n);
    for (let i = 0; i < n; i++) {
      expect(set.has(i)).toBe(true);
    }
  });
});
