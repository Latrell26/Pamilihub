/**
 * Trie (prefix tree) implementation from scratch.
 *
 * Stores strings and supports efficient prefix-based lookup.
 * Each node stores children in a Map keyed by character.
 *
 * Time complexity:
 *  - insert/search/startsWith: O(m) where m is string length
 *  - collectWordsWithPrefix: O(m + k) where k is number of matches
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord = false;
}

export class Trie {
  private root = new TrieNode();
  private _size = 0;

  /** Number of words stored. O(1) */
  get size(): number {
    return this._size;
  }

  /** True if no words stored. O(1) */
  get isEmpty(): boolean {
    return this._size === 0;
  }

  /** Insert a word into the trie. O(m) where m is word length. */
  insert(word: string): void {
    if (this.search(word)) return; // already present — no size change

    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }

    if (!node.isEndOfWord) {
      node.isEndOfWord = true;
      this._size++;
    }
  }

  /** True if the exact word exists. O(m). */
  search(word: string): boolean {
    const node = this._findNode(word);
    return node !== null && node.isEndOfWord;
  }

  /** True if any word in the trie starts with the given prefix. O(m). */
  startsWith(prefix: string): boolean {
    return this._findNode(prefix) !== null;
  }

  /** Remove a word. Returns true if the word existed and was removed. O(m). */
  delete(word: string): boolean {
    const result = this._delete(this.root, word, 0);
    return result.found;
  }

  private _delete(
    node: TrieNode,
    word: string,
    depth: number
  ): { found: boolean; prune: boolean } {
    if (depth === word.length) {
      if (!node.isEndOfWord) {
        return { found: false, prune: false };
      }
      node.isEndOfWord = false;
      this._size--;
      return { found: true, prune: node.children.size === 0 };
    }

    const char = word[depth];
    const child = node.children.get(char);
    if (child === undefined) {
      return { found: false, prune: false };
    }

    const result = this._delete(child, word, depth + 1);
    if (result.prune) {
      node.children.delete(char);
    }

    return {
      found: result.found,
      prune: !node.isEndOfWord && node.children.size === 0,
    };
  }

  /** Remove all words. O(n) */
  clear(): void {
    this.root = new TrieNode();
    this._size = 0;
  }

  /** Collect all words that start with `prefix`. O(m + k). */
  collectWordsWithPrefix(prefix: string): string[] {
    const node = this._findNode(prefix);
    if (node === null) return [];

    const results: string[] = [];
    this._collect(node, prefix, results);
    return results;
  }

  /** All words in the trie. O(n). */
  words(): string[] {
    return this.collectWordsWithPrefix("");
  }

  private _findNode(prefix: string): TrieNode | null {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) return null;
      node = node.children.get(char)!;
    }
    return node;
  }

  private _collect(node: TrieNode, prefix: string, results: string[]): void {
    if (node.isEndOfWord) {
      results.push(prefix);
    }
    node.children.forEach((child: TrieNode, char: string) => {
      this._collect(child, prefix + char, results);
    });
  }
}
