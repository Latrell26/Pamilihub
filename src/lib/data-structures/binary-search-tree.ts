/**
 * Binary Search Tree (BST) implementation from scratch.
 *
 * Stores key-value pairs ordered by key. Supports insert, search, delete,
 * in-order traversal, min, max, size, and height.
 *
 * Time complexity (average case; O(n) worst case for skewed trees):
 *  - insert/search/delete: O(log n)
 *  - in-order traversal: O(n)
 */
class BSTNode<K, V> {
  key: K;
  value: V;
  left: BSTNode<K, V> | null = null;
  right: BSTNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class BinarySearchTree<K, V> {
  private root: BSTNode<K, V> | null = null;
  private _size = 0;
  private comparator: (a: K, b: K) => number;

  constructor(comparator?: (a: K, b: K) => number) {
    this.comparator = comparator ?? ((a: K, b: K) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
  }

  /** Number of nodes. O(1) */
  get size(): number {
    return this._size;
  }

  /** True if empty. O(1) */
  get isEmpty(): boolean {
    return this._size === 0;
  }

  /** Insert or update a key-value pair. Average O(log n), worst O(n). */
  insert(key: K, value: V): void {
    const inserted = this._insertNode(this.root, key, value);
    if (inserted !== null) {
      this.root = inserted.node;
      this._size += inserted.sizeDelta;
    }
  }

  private _insertNode(
    node: BSTNode<K, V> | null,
    key: K,
    value: V
  ): { node: BSTNode<K, V> | null; sizeDelta: number } {
    if (node === null) {
      return { node: new BSTNode(key, value), sizeDelta: 1 };
    }

    const cmp = this.comparator(key, node.key);
    if (cmp < 0) {
      const result = this._insertNode(node.left, key, value);
      node.left = result.node;
      return { node, sizeDelta: result.sizeDelta };
    } else if (cmp > 0) {
      const result = this._insertNode(node.right, key, value);
      node.right = result.node;
      return { node, sizeDelta: result.sizeDelta };
    } else {
      // Key exists — update value in place (no size change).
      node.value = value;
      return { node, sizeDelta: 0 };
    }
  }

  /** Search for a value by key. Returns undefined if not found. Average O(log n). */
  search(key: K): V | undefined {
    let current = this.root;
    while (current !== null) {
      const cmp = this.comparator(key, current.key);
      if (cmp === 0) return current.value;
      if (cmp < 0) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return undefined;
  }

  /** True if key exists. Average O(log n). */
  has(key: K): boolean {
    return this.search(key) !== undefined;
  }

  /** Delete a node by key. Returns true if removed. Average O(log n). */
  delete(key: K): boolean {
    const result = this._deleteNode(this.root, key);
    this.root = result.node;
    return result.deleted;
  }

  private _deleteNode(
    node: BSTNode<K, V> | null,
    key: K
  ): { node: BSTNode<K, V> | null; deleted: boolean } {
    if (node === null) {
      return { node: null, deleted: false };
    }

    const cmp = this.comparator(key, node.key);
    if (cmp < 0) {
      const result = this._deleteNode(node.left, key);
      node.left = result.node;
      return { node, deleted: result.deleted };
    } else if (cmp > 0) {
      const result = this._deleteNode(node.right, key);
      node.right = result.node;
      return { node, deleted: result.deleted };
    } else {
      // Found the node to delete.
      this._size--;

      // No children
      if (node.left === null && node.right === null) {
        return { node: null, deleted: true };
      }
      // One child
      if (node.left === null) {
        return { node: node.right, deleted: true };
      }
      if (node.right === null) {
        return { node: node.left, deleted: true };
      }

      // Two children: replace with in-order successor (min of right subtree)
      const successor = this._minNode(node.right)!;
      node.key = successor.key;
      node.value = successor.value;
      // Remove the successor from the right subtree without double-decrementing size.
      const successorResult = this._removeMin(node.right);
      node.right = successorResult.node;
      return { node, deleted: true };
    }
  }

  /** Remove the minimum node from a subtree. Returns the new subtree root. */
  private _removeMin(
    node: BSTNode<K, V> | null
  ): { node: BSTNode<K, V> | null } {
    if (node === null) {
      return { node: null };
    }
    if (node.left === null) {
      return { node: node.right };
    }
    const result = this._removeMin(node.left);
    node.left = result.node;
    return { node };
  }

  /** Return the smallest key. Average O(log n). */
  minKey(): K | undefined {
    const node = this._minNode(this.root);
    return node?.key;
  }

  /** Return the largest key. Average O(log n). */
  maxKey(): K | undefined {
    let current = this.root;
    while (current !== null && current.right !== null) {
      current = current.right;
    }
    return current?.key;
  }

  /** Height of the tree. O(n) */
  get height(): number {
    return this._height(this.root);
  }

  private _height(node: BSTNode<K, V> | null): number {
    if (node === null) return 0;
    return 1 + Math.max(this._height(node.left), this._height(node.right));
  }

  /** In-order traversal yielding entries sorted by key. O(n) */
  inOrder(): Array<{ key: K; value: V }> {
    const result: Array<{ key: K; value: V }> = [];
    this._inOrderToArray(this.root, result);
    return result;
  }

  private _inOrderToArray(
    node: BSTNode<K, V> | null,
    result: Array<{ key: K; value: V }>
  ): void {
    if (node === null) return;
    this._inOrderToArray(node.left, result);
    result.push({ key: node.key, value: node.value });
    this._inOrderToArray(node.right, result);
  }

  /** Return all entries sorted by key. O(n) */
  toArray(): Array<{ key: K; value: V }> {
    return Array.from(this.inOrder());
  }

  /** Remove all nodes. O(n) */
  clear(): void {
    this.root = null;
    this._size = 0;
  }

  private _minNode(node: BSTNode<K, V> | null): BSTNode<K, V> | null {
    let current = node;
    while (current !== null && current.left !== null) {
      current = current.left;
    }
    return current;
  }
}
