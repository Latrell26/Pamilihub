import { describe, it, expect } from "vitest";
import { SinglyLinkedList } from "@/lib/data-structures/linked-list";

describe("SinglyLinkedList", () => {
  it("starts empty", () => {
    const list = new SinglyLinkedList<number>();
    expect(list.size).toBe(0);
    expect(list.isEmpty).toBe(true);
  });

  it("append and prepend", () => {
    const list = new SinglyLinkedList<string>();
    list.append("b");
    list.append("c");
    list.prepend("a");
    expect(list.size).toBe(3);
    expect(list.toArray()).toEqual(["a", "b", "c"]);
  });

  it("get by index", () => {
    const list = new SinglyLinkedList<number>();
    list.append(10);
    list.append(20);
    list.append(30);
    expect(list.get(0)).toBe(10);
    expect(list.get(1)).toBe(20);
    expect(list.get(2)).toBe(30);
  });

  it("insert at index", () => {
    const list = new SinglyLinkedList<number>();
    list.append(10);
    list.append(30);
    list.insert(1, 20);
    expect(list.toArray()).toEqual([10, 20, 30]);
    expect(list.size).toBe(3);
  });

  it("insert at boundaries", () => {
    const list = new SinglyLinkedList<number>();
    list.insert(0, 1);
    list.insert(1, 3);
    list.insert(1, 2);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it("removeAt returns value and shrinks", () => {
    const list = new SinglyLinkedList<string>();
    list.append("a");
    list.append("b");
    list.append("c");
    expect(list.removeAt(1)).toBe("b");
    expect(list.toArray()).toEqual(["a", "c"]);
    expect(list.size).toBe(2);
  });

  it("removeAt throws on invalid index", () => {
    const list = new SinglyLinkedList<number>();
    list.append(1);
    expect(() => list.removeAt(5)).toThrow(RangeError);
    expect(() => list.removeAt(-1)).toThrow(RangeError);
  });

  it("remove by value", () => {
    const list = new SinglyLinkedList<number>();
    list.append(1);
    list.append(2);
    list.append(3);
    expect(list.remove(2)).toBe(true);
    expect(list.remove(99)).toBe(false);
    expect(list.toArray()).toEqual([1, 3]);
  });

  it("indexOf and contains", () => {
    const list = new SinglyLinkedList<string>();
    list.append("x");
    list.append("y");
    expect(list.indexOf("y")).toBe(1);
    expect(list.indexOf("z")).toBe(-1);
    expect(list.contains("x")).toBe(true);
    expect(list.contains("nope")).toBe(false);
  });

  it("clear empties the list", () => {
    const list = new SinglyLinkedList<number>();
    list.append(1);
    list.append(2);
    list.clear();
    expect(list.size).toBe(0);
    expect(list.isEmpty).toBe(true);
    expect(list.toArray()).toEqual([]);
  });

  it("iterator yields values in order", () => {
    const list = new SinglyLinkedList<number>();
    list.append(1);
    list.append(2);
    list.append(3);
    const collected: number[] = [];
    for (const value of [...list]) {
      collected.push(value);
    }
    expect(collected).toEqual([1, 2, 3]);
  });
});
