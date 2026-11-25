# Data Structures and Algorithms (DSA) Technical Documentation
**Project Title:** (SP) Pamilihub: A Web-Based Local Food Delicacies E-Commerce Platform for San Pablo City, Laguna  
**Course:** Data Structures and Algorithms (Final Project)  
**Implementation Language:** TypeScript (Node.js / Next.js)  

---

## 1. System Overview & Objectives
**(SP) Pamilihub** is a localized e-commerce web platform and Progressive Web App (PWA) designed for the traditional food producers and culinary artisans of San Pablo City, Laguna (e.g., *buko pie*, *espasol*, *kakanin*, and *barako coffee*).

To ensure high performance, algorithmic efficiency, and decoupled business logic, all core data structures and algorithms have been implemented **from scratch** (without relying on pre-packaged third-party libraries) under `src/lib/data-structures/` and directly integrated into production application features.

---

## 2. Data Structure & Algorithm Requirement Matrix

The system satisfies and exceeds the curriculum requirement of implementing the fundamental data structures, embedding each into an active system module:

| # | Data Structure / Algorithm | Source File Location | Time Complexity (Avg / Worst) | Space Complexity | Practical Application Feature |
|---|---|---|---|---|---|
| **1** | **Dynamic Array (`ArrayList<T>`)** | [`src/lib/data-structures/array-list.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/data-structures/array-list.ts) | Push: $O(1)$ amortized<br>Insert/Remove: $O(n)$<br>Access: $O(1)$ | $O(n)$ | Accumulating scored search predictions dynamically in [`src/app/api/search/route.ts`](file:///c:/DEV/LSPU/PRINCE/src/app/api/search/route.ts#L211). |
| **2** | **Singly Linked List (`SinglyLinkedList<T>`)** | [`src/lib/data-structures/linked-list.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/data-structures/linked-list.ts) | Prepend/Append: $O(1)$<br>Index Lookup: $O(n)$ | $O(n)$ | Foundational memory engine backing `Stack`, `Queue`, and `HashSet` collision bucket chains. |
| **3** | **Hash Set (`HashSet<T>`)** | [`src/lib/data-structures/hash-set.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/data-structures/hash-set.ts) | Add/Has/Delete: $O(1)$ avg<br>Rehash: $O(n)$ | $O(n)$ | Deduplicating category IDs in [`src/modules/catalog/queries.ts`](file:///c:/DEV/LSPU/PRINCE/src/modules/catalog/queries.ts#L62) & preventing duplicate search hits. |
| **4** | **Stack (`Stack<T>`)** | [`src/lib/data-structures/stack.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/data-structures/stack.ts) | Push: $O(1)$<br>Pop: $O(1)$<br>Peek: $O(1)$ | $O(n)$ | LIFO Cart Undo mechanism: restoring deleted items in [`src/lib/cart/cart-context.tsx`](file:///c:/DEV/LSPU/PRINCE/src/lib/cart/cart-context.tsx#L67) & [`src/app/(customer)/cart/page.tsx`](file:///c:/DEV/LSPU/PRINCE/src/app/(customer)/cart/page.tsx#L471). |
| **5** | **Queue (`Queue<T>`)** | [`src/lib/data-structures/queue.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/data-structures/queue.ts) | Enqueue: $O(1)$<br>Dequeue: $O(1)$<br>Peek: $O(1)$ | $O(n)$ | FIFO Seller Fulfillment Queue: chronological ticket priority assignment in [`src/modules/orders/queries.ts`](file:///c:/DEV/LSPU/PRINCE/src/modules/orders/queries.ts#L245) & [`OrderCard.tsx`](file:///c:/DEV/LSPU/PRINCE/src/components/seller/orders/OrderCard.tsx#L99). |
| **6** | **Binary Search Tree (`BinarySearchTree<K,V>`)** | [`src/lib/data-structures/binary-search-tree.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/data-structures/binary-search-tree.ts) | Insert/Search: $O(\log n)$ avg<br>Traversal: $O(n)$ | $O(n)$ | Store menu food price sorting via in-order traversal in [`src/components/catalog/store-menu-view.tsx`](file:///c:/DEV/LSPU/PRINCE/src/components/catalog/store-menu-view.tsx#L97). |
| **7** | **Trie (`Trie`)** | [`src/lib/data-structures/trie.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/data-structures/trie.ts) | Insert/Search: $O(m)$<br>Prefix Match: $O(m + k)$ | $O(\Sigma \cdot m)$ | Search autocomplete indexing & prefix relevance score bonus in [`src/app/api/search/route.ts`](file:///c:/DEV/LSPU/PRINCE/src/app/api/search/route.ts#L198). |
| **8** | **Directed Graph (`Graph<T>`)** | [`src/lib/data-structures/graph.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/data-structures/graph.ts) | Add Edge: $O(1)$<br>Neighbors: $O(1)$<br>BFS/DFS: $O(V + E)$ | $O(V + E)$ | Order status finite state machine enforcing legal order transitions in [`src/modules/orders/status-machine.ts`](file:///c:/DEV/LSPU/PRINCE/src/modules/orders/status-machine.ts#L27) & [`OrderDetailPanel.tsx`](file:///c:/DEV/LSPU/PRINCE/src/components/seller/orders/OrderDetailPanel.tsx#L177). |
| **9** | **Merge Sort (`mergeSort<T>`)** | [`src/lib/data-structures/algorithms/merge-sort.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/data-structures/algorithms/merge-sort.ts) | Best/Avg/Worst: $O(n \log n)$ (Stable) | $O(n)$ | Ranking live search predictions by descending relevance score in [`src/app/api/search/route.ts`](file:///c:/DEV/LSPU/PRINCE/src/app/api/search/route.ts#L259). |
| **10**| **Binary Search (`binarySearch<T>`)** | [`src/lib/data-structures/algorithms/binary-search.ts`](file:///c:/DEV/LSPU/PRINCE/src/lib/data-structures/algorithms/binary-search.ts) | Best: $O(1)$<br>Avg/Worst: $O(\log n)$ | $O(1)$ | Exact delicacy name match detection for score bonuses on sorted titles in [`src/app/api/search/route.ts`](file:///c:/DEV/LSPU/PRINCE/src/app/api/search/route.ts#L206). |

---

## 3. Detailed Architecture & Integration Points

### 3.1 Graph — Order Status Lifecycle State Machine
* **Class:** `Graph<T>` (Directed adjacency list)
* **Files:** [`src/modules/orders/status-machine.ts`](file:///c:/DEV/LSPU/PRINCE/src/modules/orders/status-machine.ts), [`src/components/seller/orders/OrderDetailPanel.tsx`](file:///c:/DEV/LSPU/PRINCE/src/components/seller/orders/OrderDetailPanel.tsx)
* **Design & Flow:**
  Orders strictly follow this directed pathway:
  $$\text{pending} \longrightarrow \text{accepted} \longrightarrow \text{preparing} \longrightarrow \text{delivering} \longrightarrow \text{completed}$$
  With $\text{rejected}$ (from `pending`) and $\text{cancelled}$ (from `accepted`, `preparing`, or `delivering`) serving as terminal exits.
* **UI Integration:** The seller's master-detail control panel invokes `getAllowedTransitions(order.order_status)` which queries `graph.neighbors(currentStatus)`. The UI generates action buttons exclusively for valid edges. Terminal statuses automatically hide all modification controls.

---

### 3.2 Queue — First-In, First-Out (FIFO) Order Fulfillment Priority
* **Class:** `Queue<T>` (Backed by `SinglyLinkedList`)
* **Files:** [`src/modules/orders/queries.ts`](file:///c:/DEV/LSPU/PRINCE/src/modules/orders/queries.ts#L245-L295), [`src/components/seller/orders/OrderCard.tsx`](file:///c:/DEV/LSPU/PRINCE/src/components/seller/orders/OrderCard.tsx#L99-L103)
* **Design & Flow:**
  When a merchant checks their incoming orders, pending orders are enqueued oldest-first. As orders are dequeued, sequential priority tokens (`Queue #1`, `Queue #2`, ...) are attached.
* **UI Integration:** `OrderCard.tsx` renders an amber badge `Queue #X` on pending orders, ensuring sellers prepare food based on strict customer arrival time.

---

### 3.3 Stack — Last-In, First-Out (LIFO) Cart Item Removal Undo
* **Class:** `Stack<T>` (Backed by `SinglyLinkedList`)
* **Files:** [`src/lib/cart/cart-context.tsx`](file:///c:/DEV/LSPU/PRINCE/src/lib/cart/cart-context.tsx#L67-L137), [`src/app/(customer)/cart/page.tsx`](file:///c:/DEV/LSPU/PRINCE/src/app/(customer)/cart/page.tsx#L471-L485)
* **Design & Flow:**
  Whenever a customer removes a food item from their cart, `undoStackRef.push({ ...removedItem })` records the state.
* **UI Integration:** The cart page listens to `canUndo`. When true, an interactive banner appears: *"Item removed from cart — [Undo]"*. Clicking **Undo** pops the top item off the Stack and restores it to the cart.

---

### 3.4 Binary Search Tree — In-Order Price Traversal
* **Class:** `BinarySearchTree<K, V>`
* **Files:** [`src/components/catalog/store-menu-view.tsx`](file:///c:/DEV/LSPU/PRINCE/src/components/catalog/store-menu-view.tsx#L97-L113)
* **Design & Flow:**
  When a customer activates the price sort toggle (`ArrowUpDown` icon), menu items are inserted into a BST keyed by their numeric price.
* **Algorithmic Traversal:** An in-order traversal (`Left -> Root -> Right`) visits keys in strictly ascending mathematical order in $O(n)$ time, sorting all delicacies from cheapest to most expensive without triggering extra database requests.

---

### 3.5 Trie & Binary Search — Prefix & Exact Match Search Optimization
* **Classes:** `Trie`, `mergeSort`, `binarySearch`
* **File:** [`src/app/api/search/route.ts`](file:///c:/DEV/LSPU/PRINCE/src/app/api/search/route.ts#L198-L260)
* **Design & Flow:**
  1. Product names are inserted into a `Trie`. For query string $q$, `trie.startsWith(q)` executes in $O(m)$ time (where $m = |q|$), granting a +10 relevance bonus to prefix matches.
  2. Distinct product titles are sorted alphabetically using `mergeSort`.
  3. `binarySearch` searches for exact title matches in $O(\log n)$, granting an extra +15 score bonus.
  4. Scored predictions are accumulated in an `ArrayList` and sorted descending by final score with `mergeSort(results, (a, b) => b.score - a.score)`.

---

### 3.6 Hash Set — Data Deduplication via Separate Chaining
* **Class:** `HashSet<T>`
* **Files:** [`src/modules/catalog/queries.ts`](file:///c:/DEV/LSPU/PRINCE/src/modules/catalog/queries.ts#L195, L304, L400), [`src/app/api/search/route.ts`](file:///c:/DEV/LSPU/PRINCE/src/app/api/search/route.ts#L208)
* **Design & Flow:**
  Calculates string polynomial hashes (`hash * 31 + charCode`) across an array of linked list buckets. Automatically rehashes and doubles bucket capacity when the load factor exceeds 0.75. Used to deduplicate category filter pills and search result records.

---

## 4. Verification & Testing

### 4.1 Automated Unit Tests
The project features a dedicated test suite with 100% pass rate:
```bash
pnpm test:unit
```
**Results:**
* **18 Test Files Passed**
* **172 Tests Passed (0 Failures)**
* Test files located in `tests/unit/data-structures/`:
  - `array-list.test.ts`
  - `linked-list.test.ts`
  - `hash-set.test.ts`
  - `stack.test.ts`
  - `queue.test.ts`
  - `binary-search-tree.test.ts`
  - `trie.test.ts`
  - `graph.test.ts`
  - `algorithms.test.ts`
  - `status-machine.test.ts`

### 4.2 Terminal Demonstration Script
Run the built-in live benchmark and inspection tool:
```bash
pnpm demo:ds
```
*(Runs `scripts/data-structures-demo.ts` outputting detailed file references, line numbers, and live execution outputs for each data structure).*

---

## 5. Teacher System-Checking Walkthrough Checklist

During the direct system inspection with the instructor, use the following guide:

1. **Verify Source Code:**
   Open `src/lib/data-structures/` and show that classes are written from scratch with TypeScript generics and no external libraries.
2. **Run Demo Script:**
   Execute `pnpm demo:ds` in the terminal to demonstrate all structures, Big-O complexities, and mapped files.
3. **Run Unit Tests:**
   Execute `pnpm test:unit` to show 172/172 tests passing.
4. **Live UI Inspection:**
   - **Cart Undo (Stack):** Delete an item on `/cart`, show the Undo banner, click **Undo** to restore it.
   - **Queue Badges (Queue):** Visit `/seller/orders` to display `Queue #1` priority on pending orders.
   - **Price Sort (BST):** Open any store page (`/stores/<id>`), click the `ArrowUpDown` button to sort by price via in-order BST traversal.
   - **Order Transitions (Graph):** Click an order on `/seller/orders` to demonstrate how button actions conform to the directed graph neighbors.
   - **Search Optimization (Trie + Merge Sort):** Search for delicacy prefixes in the search bar and inspect network score ranking.
