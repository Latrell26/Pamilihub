/**
 * Binary Search implementation from scratch.
 *
 * Searches a sorted array for a target value using an optional comparator.
 * Returns the index of the target, or -1 if not found.
 *
 * Time complexity: O(log n)
 * Space complexity: O(1)
 *
 * @param array - Sorted array to search.
 * @param target - Value to find.
 * @param comparator - Optional comparison function; defaults to ascending for primitives.
 * @returns Index of target, or -1 if not found.
 */
export function binarySearch<T>(
  array: readonly T[],
  target: T,
  comparator?: (a: T, b: T) => number
): number {
  const cmp = comparator ?? ((a: T, b: T) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  let low = 0;
  let high = array.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const c = cmp(array[mid], target);

    if (c === 0) return mid;
    if (c < 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}
