import { describe, it, expect } from "vitest";
import { Stack } from "@/lib/data-structures/stack";

describe("Stack", () => {
  it("starts empty", () => {
    const stack = new Stack<number>();
    expect(stack.size).toBe(0);
    expect(stack.isEmpty).toBe(true);
  });

  it("push and pop are LIFO", () => {
    const stack = new Stack<string>();
    stack.push("first");
    stack.push("second");
    stack.push("third");
    expect(stack.size).toBe(3);
    expect(stack.pop()).toBe("third");
    expect(stack.pop()).toBe("second");
    expect(stack.pop()).toBe("first");
    expect(stack.isEmpty).toBe(true);
  });

  it("peek does not remove", () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    expect(stack.peek()).toBe(2);
    expect(stack.peek()).toBe(2);
    expect(stack.size).toBe(2);
  });

  it("pop on empty throws", () => {
    const stack = new Stack<number>();
    expect(() => stack.pop()).toThrow(Error);
  });

  it("peek on empty throws", () => {
    const stack = new Stack<number>();
    expect(() => stack.peek()).toThrow(Error);
  });

  it("clear empties", () => {
    const stack = new Stack<string>();
    stack.push("a");
    stack.push("b");
    stack.clear();
    expect(stack.size).toBe(0);
    expect(stack.isEmpty).toBe(true);
  });

  it("toArray returns top first", () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.toArray()).toEqual([3, 2, 1]);
  });

  it("iterator yields top to bottom", () => {
    const stack = new Stack<string>();
    stack.push("a");
    stack.push("b");
    stack.push("c");
    const collected: string[] = [];
    for (const value of [...stack]) {
      collected.push(value);
    }
    expect(collected).toEqual(["c", "b", "a"]);
  });
});
