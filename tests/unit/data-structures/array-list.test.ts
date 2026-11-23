import { describe, it, expect } from "vitest";
import { ArrayList } from "@/lib/data-structures/array-list";

describe("ArrayList", () => {
  it("starts empty", () => {
    const list = new ArrayList<number>();
    expect(list.size).toBe(0);
    expect(list.isEmpty).toBe(true);
  });

  it("push and get", () => {
    const list = new ArrayList<string>();
    list.push("a");
    list.push("b");
    list.push("c");
    expect(list.size).toBe(3);
    expect(list.get(0)).toBe("a");
    expect(list.get(1)).toBe("b");
    expect(list.get(2)).toBe("c");
  });

  it("set updates value", () => {
    const list = new ArrayList<number>();
    list.push(1);
    list.push(2);
    list.set(0, 100);
    expect(list.get(0)).toBe(100);
  });

  it("insert at index shifts elements", () => {
    const list = new ArrayList<number>();
    list.push(1);
    list.push(3);
    list.insert(1, 2);
    expect(list.toArray()).toEqual([1, 2, 3]);
    expect(list.size).toBe(3);
  });

  it("insert at boundaries", () => {
    const list = new ArrayList<string>();
    list.insert(0, "first");
    list.insert(1, "last");
    list.insert(1, "middle");
    expect(list.toArray()).toEqual(["first", "middle", "last"]);
  });

  it("removeAt returns value and shrinks", () => {
    const list = new ArrayList<string>();
    list.push("a");
    list.push("b");
    list.push("c");
    expect(list.removeAt(1)).toBe("b");
    expect(list.toArray()).toEqual(["a", "c"]);
    expect(list.size).toBe(2);
  });

  it("removeAt throws on invalid index", () => {
    const list = new ArrayList<number>();
    list.push(1);
    expect(() => list.removeAt(5)).toThrow(RangeError);
    expect(() => list.removeAt(-1)).toThrow(RangeError);
  });

  it("remove by value", () => {
    const list = new ArrayList<number>();
    list.push(1);
    list.push(2);
    list.push(3);
    expect(list.remove(2)).toBe(true);
    expect(list.remove(99)).toBe(false);
    expect(list.toArray()).toEqual([1, 3]);
  });

  it("indexOf and contains", () => {
    const list = new ArrayList<string>();
    list.push("x");
    list.push("y");
    expect(list.indexOf("y")).toBe(1);
    expect(list.indexOf("z")).toBe(-1);
    expect(list.contains("x")).toBe(true);
    expect(list.contains("nope")).toBe(false);
  });

  it("clear empties the list", () => {
    const list = new ArrayList<number>();
    list.push(1);
    list.push(2);
    list.clear();
    expect(list.size).toBe(0);
    expect(list.isEmpty).toBe(true);
    expect(list.toArray()).toEqual([]);
  });

  it("iterator yields values in order", () => {
    const list = new ArrayList<number>();
    list.push(1);
    list.push(2);
    list.push(3);
    const collected: number[] = [];
    for (const value of [...list]) {
      collected.push(value);
    }
    expect(collected).toEqual([1, 2, 3]);
  });

  it("handles large number of elements (resizing)", () => {
    const list = new ArrayList<number>();
    const n = 1000;
    for (let i = 0; i < n; i++) {
      list.push(i);
    }
    expect(list.size).toBe(n);
    expect(list.get(0)).toBe(0);
    expect(list.get(n - 1)).toBe(n - 1);
    expect(list.toArray()[500]).toBe(500);
  });
});
