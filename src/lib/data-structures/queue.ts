import { SinglyLinkedList } from "./linked-list";

/**
 * Queue (FIFO) implementation from scratch, backed by SinglyLinkedList.
 *
 * Time complexity:
 *  - enqueue/dequeue/peek: O(1)
 *  - size/isEmpty: O(1)
 */
export class Queue<T> {
  private list = new SinglyLinkedList<T>();

  /** Number of elements. O(1) */
  get size(): number {
    return this.list.size;
  }

  /** True if empty. O(1) */
  get isEmpty(): boolean {
    return this.list.isEmpty;
  }

  /** Enqueue an element at the rear. O(1) */
  enqueue(value: T): void {
    this.list.append(value);
  }

  /** Dequeue and return the front element. Throws if empty. O(1) */
  dequeue(): T {
    if (this.isEmpty) {
      throw new Error("Cannot dequeue from an empty queue");
    }
    const front = this.list.get(0);
    this.list.removeAt(0);
    return front;
  }

  /** Return the front element without removing it. Throws if empty. O(1) */
  peek(): T {
    if (this.isEmpty) {
      throw new Error("Cannot peek an empty queue");
    }
    return this.list.get(0);
  }

  /** Remove all elements. O(n) */
  clear(): void {
    this.list.clear();
  }

  /** Convert to array (front first). O(n) */
  toArray(): T[] {
    return this.list.toArray();
  }

  /** Iterate from front to rear. */
  *[Symbol.iterator](): Iterator<T> {
    yield* this.toArray();
  }
}
