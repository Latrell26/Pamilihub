/**
 * Graph implementation from scratch using an adjacency list (Map of vertices to edge sets).
 *
 * Supports directed and undirected edges, BFS, DFS, path existence, and shortest path.
 *
 * Time complexity:
 *  - addVertex/addEdge: O(1)
 *  - BFS/DFS: O(V + E)
 *  - hasPath/shortestPath: O(V + E)
 */
import { Queue } from "./queue";
import { Stack } from "./stack";

export class Graph<T> {
  private adjacency = new Map<T, Set<T>>();
  private directed = false;

  constructor(directed = false) {
    this.directed = directed;
  }

  /** Number of vertices. O(1) */
  get size(): number {
    return this.adjacency.size;
  }

  /** Add a vertex. O(1) */
  addVertex(vertex: T): void {
    if (!this.adjacency.has(vertex)) {
      this.adjacency.set(vertex, new Set());
    }
  }

  /** Add an edge between two vertices. Creates vertices if missing. O(1) */
  addEdge(from: T, to: T): void {
    this.addVertex(from);
    this.addVertex(to);

    this.adjacency.get(from)!.add(to);
    if (!this.directed) {
      this.adjacency.get(to)!.add(from);
    }
  }

  /** Remove an edge between two vertices. O(1) average */
  removeEdge(from: T, to: T): void {
    this.adjacency.get(from)?.delete(to);
    if (!this.directed) {
      this.adjacency.get(to)?.delete(from);
    }
  }

  /** Return the neighbors of a vertex. O(1) average */
  neighbors(vertex: T): T[] {
    return this.adjacency.get(vertex) ? Array.from(this.adjacency.get(vertex)!) : [];
  }

  /** True if vertex exists. O(1) average */
  hasVertex(vertex: T): boolean {
    return this.adjacency.has(vertex);
  }

  /** Breadth-first traversal starting from `start`. Yields vertices in BFS order. O(V + E) */
  *bfs(start: T): Generator<T> {
    if (!this.adjacency.has(start)) return;

    const visited = new Set<T>();
    const queue = new Queue<T>();
    visited.add(start);
    queue.enqueue(start);

    while (!queue.isEmpty) {
      const current = queue.dequeue();
      yield current;

      for (const neighbor of this.neighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.enqueue(neighbor);
        }
      }
    }
  }

  /** Depth-first traversal starting from `start`. Yields vertices in DFS order. O(V + E) */
  *dfs(start: T): Generator<T> {
    if (!this.adjacency.has(start)) return;

    const visited = new Set<T>();
    const stack = new Stack<T>();
    stack.push(start);

    while (!stack.isEmpty) {
      const current = stack.pop();
      if (visited.has(current)) continue;

      visited.add(current);
      yield current;

      // Push neighbors in reverse order so the first neighbor is visited first (mirrors recursive DFS).
      const neighbors = this.neighbors(current);
      for (let i = neighbors.length - 1; i >= 0; i--) {
        if (!visited.has(neighbors[i])) {
          stack.push(neighbors[i]);
        }
      }
    }
  }

  /** True if a path exists between `from` and `to`. O(V + E) */
  hasPath(from: T, to: T): boolean {
    if (!this.adjacency.has(from) || !this.adjacency.has(to)) return false;
    if (from === to) return true;

    const visited = new Set<T>();
    const queue = new Queue<T>();
    visited.add(from);
    queue.enqueue(from);

    while (!queue.isEmpty) {
      const current = queue.dequeue();
      if (current === to) return true;

      for (const neighbor of this.neighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.enqueue(neighbor);
        }
      }
    }
    return false;
  }

  /** Shortest path (unweighted) from `from` to `to` as an array of vertices, or null if no path. O(V + E) */
  shortestPath(from: T, to: T): T[] | null {
    if (!this.adjacency.has(from) || !this.adjacency.has(to)) return null;
    if (from === to) return [from];

    const visited = new Set<T>();
    const parent = new Map<T, T | null>();
    const queue = new Queue<T>();

    visited.add(from);
    parent.set(from, null);
    queue.enqueue(from);

    while (!queue.isEmpty) {
      const current = queue.dequeue();

      for (const neighbor of this.neighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parent.set(neighbor, current);
          if (neighbor === to) {
            return this._reconstructPath(parent, to);
          }
          queue.enqueue(neighbor);
        }
      }
    }
    return null;
  }

  /** All vertices as an array. O(V) */
  vertices(): T[] {
    return Array.from(this.adjacency.keys());
  }

  private _reconstructPath(parent: Map<T, T | null>, end: T): T[] {
    const path: T[] = [];
    let current: T | null = end;
    while (current !== null) {
      path.push(current);
      current = parent.get(current) ?? null;
    }
    path.reverse();
    return path;
  }
}
