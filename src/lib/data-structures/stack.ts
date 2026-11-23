import { SinglyLinkedList } from "./linked-list";

/**
 * Stack (LIFO) implementation from scratch, backed by SinglyLinkedList.
 *
 * Time complexity:
 *  - push/pop/peek: O(1)
 *  - size/isEmpty: O(1)
 */
export class Stack<T> {
  private list = new SinglyLinkedList<T>();
  /** Number of elements. O(1) */
  get size(): number {
    return this.list.size;
  }

  /** True if empty. O(1) */
  get isEmpty(): boolean {
    return this.list.isEmpty;
  }

  /** Push an element onto the top. O(1) */
  push(value: T): void {
    this.list.prepend(value);
  }

  /** Pop and return the top element. Throws if empty. O(1) */
  pop(): T {
    if (this.isEmpty) {
      throw new Error("Cannot pop from an empty stack");
    }
    const top = this.list.get(0);
    this.list.removeAt(0);
    return top;
  }

  /** Return the top element without removing it. Throws if empty. O(1) */
  peek(): T {
    if (this.isEmpty) {
      throw new Error("Cannot peek an empty stack");
    }
    return this.list.get(0);
  }

  /** Remove all elements. O(n) */
  clear(): void {
    this.list.clear();
  }

  /** Convert to array (top first). O(n) */
  toArray(): T[] {
    return this.list.toArray();
  }

  /** Iterate from top to bottom. */
  *[Symbol.iterator](): Iterator<T> {
    yield* this.toArray();
  }
}
