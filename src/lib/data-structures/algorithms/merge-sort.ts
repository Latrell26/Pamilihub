/**
 * Merge Sort implementation from scratch.
 *
 * Stable, O(n log n) time, O(n) space comparison sort.
 * Works on any array type with an optional comparator.
 *
 * @param array - The array to sort (mutated and returned).
 * @param comparator - Optional comparison function; defaults to ascending for primitives.
 */
export function mergeSort<T>(
  array: T[],
  comparator?: (a: T, b: T) => number
): T[] {
  if (array.length <= 1) return array;

  const cmp = comparator ?? ((a: T, b: T) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  const middle = Math.floor(array.length / 2);
  const left = array.slice(0, middle);
  const right = array.slice(middle);

  mergeSort(left, cmp);
  mergeSort(right, cmp);

  merge(array, left, right, cmp);
  return array;
}

function merge<T>(
  result: T[],
  left: T[],
  right: T[],
  cmp: (a: T, b: T) => number
): void {
  let i = 0;
  let j = 0;
  let k = 0;

  while (i < left.length && j < right.length) {
    if (cmp(left[i], right[j]) <= 0) {
      result[k++] = left[i++];
    } else {
      result[k++] = right[j++];
    }
  }

  while (i < left.length) {
    result[k++] = left[i++];
  }

  while (j < right.length) {
    result[k++] = right[j++];
  }
}
