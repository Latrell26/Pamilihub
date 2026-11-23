/**
 * Singly Linked List implementation from scratch.
 *
 * Each node holds a value and a reference to the next node.
 * Operations: append, prepend, insert, remove, find, get, size, isEmpty, toArray, clear, iterator.
 *
 * Time complexity:
 *  - append/prepend/pushHead: O(1)
 *  - insert/remove by index: O(n)
 *  - find/contains/get by index: O(n)
 */
class ListNode<T> {
  value: T;
  next: ListNode<T> | null;

  constructor(value: T, next: ListNode<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}

export class SinglyLinkedList<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private _size = 0;

  /** Number of elements in the list. O(1) */
  get size(): number {
    return this._size;
  }

  /** True if the list contains no elements. O(1) */
  get isEmpty(): boolean {
    return this._size === 0;
  }

  /** Add an element to the end of the list. O(1) */
  append(value: T): void {
    const node = new ListNode(value);
    if (this.tail === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this._size++;
  }

  /** Add an element to the front of the list. O(1) */
  prepend(value: T): void {
    const node = new ListNode(value, this.head);
    this.head = node;
    if (this.tail === null) {
      this.tail = node;
    }
    this._size++;
  }

  /** Insert an element at a specific index. O(n) */
  insert(index: number, value: T): void {
    if (index < 0 || index > this._size) {
      throw new RangeError(`Index ${index} out of bounds for list of size ${this._size}`);
    }
    if (index === 0) {
      this.prepend(value);
      return;
    }
    if (index === this._size) {
      this.append(value);
      return;
    }

    let current = this.head;
    for (let i = 0; i < index - 1 && current !== null; i++) {
      current = current.next;
    }

    if (current !== null) {
      current.next = new ListNode(value, current.next);
      this._size++;
    }
  }

  /** Remove the element at a specific index and return its value. O(n) */
  removeAt(index: number): T {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`Index ${index} out of bounds for list of size ${this._size}`);
    }

    let removedValue: T;

    if (index === 0) {
      if (this.head === null) throw new Error("List is empty");
      removedValue = this.head.value;
      this.head = this.head.next;
      if (this.head === null) {
        this.tail = null;
      }
    } else {
      let current = this.head;
      for (let i = 0; i < index - 1 && current !== null; i++) {
        current = current.next;
      }
      if (current === null || current.next === null) {
        throw new Error("Unable to remove node");
      }
      removedValue = current.next.value;
      current.next = current.next.next;
      if (current.next === null) {
        this.tail = current;
      }
    }

    this._size--;
    return removedValue;
  }

  /** Remove the first element equal to `value`. Returns true if removed. O(n) */
  remove(value: T): boolean {
    if (this.head === null) return false;

    if (this.head.value === value) {
      this.head = this.head.next;
      if (this.head === null) {
        this.tail = null;
      }
      this._size--;
      return true;
    }

    let current = this.head;
    while (current.next !== null && current.next.value !== value) {
      current = current.next;
    }

    if (current.next === null) return false;

    current.next = current.next.next;
    if (current.next === null) {
      this.tail = current;
    }
    this._size--;
    return true;
  }

  /** Get the value at a specific index. O(n) */
  get(index: number): T {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`Index ${index} out of bounds for list of size ${this._size}`);
    }

    let current = this.head;
    for (let i = 0; i < index && current !== null; i++) {
      current = current.next;
    }

    if (current === null) {
      throw new Error("Unable to retrieve node");
    }
    return current.value;
  }

  /** Find the first index of `value`. Returns -1 if not found. O(n) */
  indexOf(value: T): number {
    let current = this.head;
    let index = 0;
    while (current !== null) {
      if (current.value === value) return index;
      current = current.next;
      index++;
    }
    return -1;
  }

  /** True if `value` exists in the list. O(n) */
  contains(value: T): boolean {
    return this.indexOf(value) !== -1;
  }

  /** Convert to a plain array. O(n) */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  /** Remove all elements. O(1) */
  clear(): void {
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  /** Iterate over values in insertion order. */
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current !== null) {
      yield current.value;
      current = current.next;
    }
  }
}
