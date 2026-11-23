import { describe, it, expect } from "vitest";
import { Graph } from "@/lib/data-structures/graph";

describe("Graph", () => {
  it("starts empty", () => {
    const graph = new Graph<string>();
    expect(graph.size).toBe(0);
  });

  it("addVertex and hasVertex", () => {
    const graph = new Graph<string>();
    graph.addVertex("A");
    graph.addVertex("B");
    expect(graph.size).toBe(2);
    expect(graph.hasVertex("A")).toBe(true);
    expect(graph.hasVertex("Z")).toBe(false);
  });

  it("addEdge and neighbors (undirected)", () => {
    const graph = new Graph<string>();
    graph.addEdge("A", "B");
    graph.addEdge("A", "C");
    graph.addEdge("B", "D");

    expect(graph.neighbors("A").sort()).toEqual(["B", "C"]);
    expect(graph.neighbors("B").sort()).toEqual(["A", "D"]);
    expect(graph.neighbors("C")).toEqual(["A"]);
    expect(graph.neighbors("D")).toEqual(["B"]);
    expect(graph.neighbors("Z")).toEqual([]);
  });

  it("addEdge creates vertices automatically", () => {
    const graph = new Graph<string>();
    graph.addEdge("X", "Y");
    expect(graph.size).toBe(2);
    expect(graph.hasVertex("X")).toBe(true);
    expect(graph.hasVertex("Y")).toBe(true);
  });

  it("directed graph edges are one-way", () => {
    const graph = new Graph<string>(true);
    graph.addEdge("A", "B");
    expect(graph.neighbors("A")).toEqual(["B"]);
    expect(graph.neighbors("B")).toEqual([]);
  });

  it("removeEdge", () => {
    const graph = new Graph<string>();
    graph.addEdge("A", "B");
    graph.removeEdge("A", "B");
    expect(graph.neighbors("A")).toEqual([]);
    expect(graph.neighbors("B")).toEqual([]);
  });

  it("bfs traversal order", () => {
    const graph = new Graph<string>();
    graph.addEdge("A", "B");
    graph.addEdge("A", "C");
    graph.addEdge("B", "D");
    graph.addEdge("C", "E");

    const order = Array.from(graph.bfs("A"));
    expect(order[0]).toBe("A");
    expect(order).toContain("B");
    expect(order).toContain("C");
    expect(order).toContain("D");
    expect(order).toContain("E");
    expect(order.length).toBe(5);
  });

  it("dfs traversal visits all reachable", () => {
    const graph = new Graph<string>();
    graph.addEdge("A", "B");
    graph.addEdge("A", "C");
    graph.addEdge("B", "D");
    graph.addEdge("C", "E");

    const order = Array.from(graph.dfs("A"));
    expect(order[0]).toBe("A");
    expect(order.sort()).toEqual(["A", "B", "C", "D", "E"]);
  });

  it("hasPath", () => {
    const graph = new Graph<string>();
    graph.addEdge("A", "B");
    graph.addEdge("B", "C");
    graph.addEdge("D", "E");

    expect(graph.hasPath("A", "C")).toBe(true);
    expect(graph.hasPath("A", "D")).toBe(false);
    expect(graph.hasPath("A", "A")).toBe(true);
  });

  it("shortestPath", () => {
    const graph = new Graph<string>();
    graph.addEdge("A", "B");
    graph.addEdge("B", "C");
    graph.addEdge("A", "D");
    graph.addEdge("D", "C");

    // A->B->C (2 edges) vs A->D->C (2 edges): both same length
    const path = graph.shortestPath("A", "C");
    expect(path).not.toBeNull();
    expect(path?.[0]).toBe("A");
    expect(path?.[path.length - 1]).toBe("C");

    expect(graph.shortestPath("A", "Z")).toBeNull();
    expect(graph.shortestPath("A", "A")).toEqual(["A"]);
  });

  it("vertices returns all", () => {
    const graph = new Graph<string>();
    graph.addEdge("A", "B");
    graph.addEdge("C", "D");
    graph.addVertex("E");
    expect(graph.vertices().sort()).toEqual(["A", "B", "C", "D", "E"]);
  });
});
