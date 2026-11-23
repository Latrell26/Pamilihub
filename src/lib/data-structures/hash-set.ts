import { SinglyLinkedList } from "./linked-list";

/**
 * HashSet implementation from scratch using separate chaining with SinglyLinkedList.
 *
 * Provides O(1) average-case add, remove, and contains operations.
 * Resizes (rehashes) when the load factor exceeds 0.75.
 *
 * Time complexity (average case):
 *  - add/remove/has: O(1)
 *  - values/forEach: O(n)
 */
export class HashSet<T> {
  private buckets: SinglyLinkedList<T>[];
  private _size = 0;
  private _capacity = 16;
  private readonly loadFactorThreshold = 0.75;

  constructor() {
    this.buckets = Array.from({ length: this._capacity }, () => new SinglyLinkedList<T>());
  }

  /** Number of elements. O(1) */
  get size(): number {
    return this._size;
  }

  /** True if no elements. O(1) */
  get isEmpty(): boolean {
    return this._size === 0;
  }

  /** Add a value. Returns true if the value was newly added (false if already present). O(1) average */
  add(value: T): boolean {
    if (this.has(value)) return false;

    const index = this._hash(value);
    this.buckets[index].append(value);
    this._size++;

    if (this._size / this._capacity > this.loadFactorThreshold) {
      this._resize();
    }
    return true;
  }

  /** True if value exists in the set. O(1) average */
  has(value: T): boolean {
    const index = this._hash(value);
    return this.buckets[index].contains(value);
  }

  /** Remove a value. Returns true if removed. O(1) average */
  delete(value: T): boolean {
    const index = this._hash(value);
    const removed = this.buckets[index].remove(value);
    if (removed) {
      this._size--;
    }
    return removed;
  }

  /** Remove all elements. O(n) */
  clear(): void {
    this.buckets = Array.from({ length: this._capacity }, () => new SinglyLinkedList<T>());
    this._size = 0;
  }

  /** Return all values as an array. O(n) */
  values(): T[] {
    const result: T[] = [];
    for (const bucket of this.buckets) {
      for (let i = 0; i < bucket.size; i++) {
        result.push(bucket.get(i)!);
      }
    }
    return result;
  }

  /** Iterate over all values. O(n) */
  *[Symbol.iterator](): Iterator<T> {
    for (const bucket of this.buckets) {
      for (let i = 0; i < bucket.size; i++) {
        yield bucket.get(i)!;
      }
    }
  }

  /** Union: returns a new set with all elements from this and `other`. O(n + m) */
  union(other: HashSet<T>): HashSet<T> {
    const result = new HashSet<T>();
    const thisArray = this.values();
    const otherArray = other.values();
    for (let i = 0; i < thisArray.length; i++) {
      result.add(thisArray[i]);
    }
    for (let i = 0; i < otherArray.length; i++) {
      result.add(otherArray[i]);
    }
    return result;
  }

  /** Intersection: returns a new set with elements present in both. O(min(n, m)) average */
  intersection(other: HashSet<T>): HashSet<T> {
    const result = new HashSet<T>();
    const thisArray = this.values();
    const otherArray = other.values();
    const smaller = thisArray.length <= otherArray.length ? thisArray : otherArray;
    const larger = thisArray.length <= otherArray.length ? otherArray : thisArray;
    for (let i = 0; i < smaller.length; i++) {
      const val = smaller[i];
      if (larger.includes(val)) {
        result.add(val);
      }
    }
    return result;
  }

  /** Difference: returns a new set with elements in this but not in `other`. O(n) average */
  difference(other: HashSet<T>): HashSet<T> {
    const result = new HashSet<T>();
    const thisArray = this.values();
    const otherArray = other.values();
    for (let i = 0; i < thisArray.length; i++) {
      const val = thisArray[i];
      if (!otherArray.includes(val)) {
        result.add(val);
      }
    }
    return result;
  }

  /** True if every element of `other` is in this set. O(m) average */
  isSubsetOf(other: HashSet<T>): boolean {
    const thisArray = this.values();
    const otherArray = other.values();
    for (let i = 0; i < thisArray.length; i++) {
      if (!otherArray.includes(thisArray[i])) return false;
    }
    return true;
  }

  private _hash(value: T): number {
    // Simple string-aware hash that distributes well across buckets.
    const str = String(value ?? "");
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash * 31 + char) % this._capacity;
    }
    return hash;
  }

  private _resize(): void {
    const oldBuckets = this.buckets;
    this._capacity *= 2;
    this.buckets = Array.from({ length: this._capacity }, () => new SinglyLinkedList<T>());
    this._size = 0;

    for (let i = 0; i < oldBuckets.length; i++) {
      const bucket = oldBuckets[i];
      for (let j = 0; j < bucket.size; j++) {
        this.add(bucket.get(j)!);
      }
    }
  }
}
