import { describe, it, expect } from "vitest";
import { Queue } from "@/lib/data-structures/queue";

describe("Queue", () => {
  it("starts empty", () => {
    const queue = new Queue<number>();
    expect(queue.size).toBe(0);
    expect(queue.isEmpty).toBe(true);
  });

  it("enqueue and dequeue are FIFO", () => {
    const queue = new Queue<string>();
    queue.enqueue("first");
    queue.enqueue("second");
    queue.enqueue("third");
    expect(queue.size).toBe(3);
    expect(queue.dequeue()).toBe("first");
    expect(queue.dequeue()).toBe("second");
    expect(queue.dequeue()).toBe("third");
    expect(queue.isEmpty).toBe(true);
  });

  it("peek does not remove", () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.peek()).toBe(1);
    expect(queue.peek()).toBe(1);
    expect(queue.size).toBe(2);
  });

  it("dequeue on empty throws", () => {
    const queue = new Queue<number>();
    expect(() => queue.dequeue()).toThrow(Error);
  });

  it("peek on empty throws", () => {
    const queue = new Queue<number>();
    expect(() => queue.peek()).toThrow(Error);
  });

  it("clear empties", () => {
    const queue = new Queue<string>();
    queue.enqueue("a");
    queue.enqueue("b");
    queue.clear();
    expect(queue.size).toBe(0);
    expect(queue.isEmpty).toBe(true);
  });

  it("toArray returns front first", () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    expect(queue.toArray()).toEqual([1, 2, 3]);
  });

  it("iterator yields front to rear", () => {
    const queue = new Queue<string>();
    queue.enqueue("a");
    queue.enqueue("b");
    queue.enqueue("c");
    const collected: string[] = [];
    for (const value of [...queue]) {
      collected.push(value);
    }
    expect(collected).toEqual(["a", "b", "c"]);
  });
});
