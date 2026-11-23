/**
 * Dynamic Array (ArrayList) implementation from scratch.
 *
 * Provides indexed access with amortized O(1) append and O(n) insert/remove
 * due to element shifting. Internally backed by a fixed-size TypeScript array
 * that grows by doubling when capacity is reached.
 *
 * Time complexity:
 *  - push/get/set: O(1)
 *  - insert/remove: O(n)
 *  - indexOf/contains: O(n)
 */
export class ArrayList<T> {
  private data: Array<T | null>;
  private _size = 0;
  private _capacity = 8;

  constructor() {
    this.data = new Array(this._capacity);
  }

  /** Number of elements. O(1) */
  get size(): number {
    return this._size;
  }

  /** True if no elements. O(1) */
  get isEmpty(): boolean {
    return this._size === 0;
  }

  /** Append an element to the end. Amortized O(1) */
  push(value: T): void {
    if (this._size === this._capacity) {
      this._resize(this._capacity * 2);
    }
    this.data[this._size++] = value;
  }

  /** Insert an element at index, shifting subsequent elements right. O(n) */
  insert(index: number, value: T): void {
    if (index < 0 || index > this._size) {
      throw new RangeError(`Index ${index} out of bounds for list of size ${this._size}`);
    }
    if (this._size === this._capacity) {
      this._resize(this._capacity * 2);
    }
    for (let i = this._size; i > index; i--) {
      this.data[i] = this.data[i - 1];
    }
    this.data[index] = value;
    this._size++;
  }

  /** Remove and return the element at index, shifting subsequent elements left. O(n) */
  removeAt(index: number): T {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`Index ${index} out of bounds for list of size ${this._size}`);
    }

    const value = this.data[index] as T;

    for (let i = index; i < this._size - 1; i++) {
      this.data[i] = this.data[i + 1];
    }
    this.data[--this._size] = null;

    // Shrink when load factor drops below 25% and capacity is comfortably above default.
    if (this._size > 0 && this._size === Math.floor(this._capacity / 4) && this._capacity > 8) {
      this._resize(Math.floor(this._capacity / 2));
    }

    return value;
  }

  /** Remove the first element equal to `value`. Returns true if removed. O(n) */
  remove(value: T): boolean {
    const index = this.indexOf(value);
    if (index === -1) return false;
    this.removeAt(index);
    return true;
  }

  /** Get the element at index. O(1) */
  get(index: number): T {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`Index ${index} out of bounds for list of size ${this._size}`);
    }
    const item = this.data[index];
    if (item === null) {
      throw new Error("Element not found");
    }
    return item;
  }

  /** Set the element at index. O(1) */
  set(index: number, value: T): void {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`Index ${index} out of bounds for list of size ${this._size}`);
    }
    this.data[index] = value;
  }

  /** Find the first index of `value`. Returns -1 if not found. O(n) */
  indexOf(value: T): number {
    for (let i = 0; i < this._size; i++) {
      if (this.data[i] === value) return i;
    }
    return -1;
  }

  /** True if `value` exists in the list. O(n) */
  contains(value: T): boolean {
    return this.indexOf(value) !== -1;
  }

  /** Convert to a plain array (copy). O(n) */
  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this._size; i++) {
      const item = this.data[i];
      if (item !== null) result.push(item);
    }
    return result;
  }

  /** Remove all elements. O(n) */
  clear(): void {
    for (let i = 0; i < this._size; i++) {
      this.data[i] = null;
    }
    this._size = 0;
  }

  /** Iterate over elements in order. */
  *[Symbol.iterator](): Iterator<T> {
    for (let i = 0; i < this._size; i++) {
      const item = this.data[i];
      if (item !== null) yield item;
    }
  }

  private _resize(newCapacity: number): void {
    const newData: Array<T | null> = new Array(newCapacity);
    for (let i = 0; i < this._size; i++) {
      newData[i] = this.data[i];
    }
    this.data = newData;
    this._capacity = newCapacity;
  }
}
