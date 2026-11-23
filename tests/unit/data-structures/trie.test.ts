import { describe, it, expect } from "vitest";
import { Trie } from "@/lib/data-structures/trie";

describe("Trie", () => {
  it("starts empty", () => {
    const trie = new Trie();
    expect(trie.size).toBe(0);
    expect(trie.isEmpty).toBe(true);
  });

  it("insert and search", () => {
    const trie = new Trie();
    trie.insert("buko");
    trie.insert("buka");
    trie.insert("pie");

    expect(trie.size).toBe(3);
    expect(trie.search("buko")).toBe(true);
    expect(trie.search("buka")).toBe(true);
    expect(trie.search("pie")).toBe(true);
    expect(trie.search("buk")).toBe(false); // prefix, not a word
    expect(trie.search("p")).toBe(false);
    expect(trie.search("cake")).toBe(false);
  });

  it("inserting duplicate does not increase size", () => {
    const trie = new Trie();
    trie.insert("buko");
    trie.insert("buko");
    expect(trie.size).toBe(1);
  });

  it("startsWith", () => {
    const trie = new Trie();
    trie.insert("buko");
    trie.insert("buka");
    trie.insert("pie");

    expect(trie.startsWith("bu")).toBe(true);
    expect(trie.startsWith("buk")).toBe(true);
    expect(trie.startsWith("p")).toBe(true);
    expect(trie.startsWith("pi")).toBe(true);
    expect(trie.startsWith("cake")).toBe(false);
    expect(trie.startsWith("z")).toBe(false);
  });

  it("collectWordsWithPrefix", () => {
    const trie = new Trie();
    trie.insert("buko");
    trie.insert("buka");
    trie.insert("buko pie");
    trie.insert("pie");

    expect(trie.collectWordsWithPrefix("bu").sort()).toEqual(["buka", "buko", "buko pie"]);
    expect(trie.collectWordsWithPrefix("buk").sort()).toEqual(["buka", "buko", "buko pie"]);
    expect(trie.collectWordsWithPrefix("pie")).toEqual(["pie"]);
    expect(trie.collectWordsWithPrefix("xyz")).toEqual([]);
  });

  it("words returns all", () => {
    const trie = new Trie();
    trie.insert("buko");
    trie.insert("pie");
    trie.insert("kakanin");
    expect(trie.words().sort()).toEqual(["buko", "kakanin", "pie"]);
  });

  it("delete removes word", () => {
    const trie = new Trie();
    trie.insert("buko");
    trie.insert("buka");
    trie.insert("pie");

    expect(trie.delete("buko")).toBe(true);
    expect(trie.search("buko")).toBe(false);
    expect(trie.search("buka")).toBe(true); // unaffected
    expect(trie.size).toBe(2);

    expect(trie.delete("nonexistent")).toBe(false);
    expect(trie.size).toBe(2);
  });

  it("delete shared prefix does not break other words", () => {
    const trie = new Trie();
    trie.insert("buko");
    trie.insert("buko pie");
    trie.insert("buka");

    trie.delete("buko");
    expect(trie.search("buko")).toBe(false);
    expect(trie.search("buko pie")).toBe(true);
    expect(trie.search("buka")).toBe(true);
  });

  it("clear empties", () => {
    const trie = new Trie();
    trie.insert("buko");
    trie.insert("pie");
    trie.clear();
    expect(trie.size).toBe(0);
    expect(trie.isEmpty).toBe(true);
    expect(trie.search("buko")).toBe(false);
  });
});
