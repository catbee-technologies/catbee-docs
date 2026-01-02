---
slug: ../array
---

# Array

A collection of functions for handling arrays with type-safety and efficiency. Includes chunking, deduplication, flattening, grouping, sorting, partitioning, and more. All methods are fully typed.

## API Summary

- [**`chunk<T>(array: readonly T[], size: number): T[][]`**](#chunk) - splits an array into chunks of the specified size.
- [**`unique<T>(array: readonly T[], keyFn?: (item: T) => unknown): T[]`**](#unique) - removes duplicate items from an array, optionally by a key function.
- [**`flattenDeep<T>(array: readonly unknown[]): T[]`**](#flattendeep) - deeply flattens a nested array (iterative, stack-based).
- [**`random<T>(array: readonly T[]): T | undefined`**](#random) - returns a crypto-secure random element from an array.
- [**`groupBy<T>(array: readonly T[], keyOrFn: keyof T | ((item: T) => string | number | symbol)): Record<string, readonly T[]>`**](#groupby) - groups array items by a key or function (supports nested keys).
- [**`shuffle<T>(array: readonly T[]): T[]`**](#shuffle) - shuffles array elements using crypto-secure randomness (Fisher-Yates).
- [**`pluck<T, K extends keyof T>(array: readonly T[], key: K): T[K][]`**](#pluck) - extracts values for a given key from an array of objects.
- [**`difference<T>(a: readonly T[], b: readonly T[]): T[]`**](#difference) - returns elements in array `a` not present in array `b`.
- [**`intersect<T>(a: readonly T[], b: readonly T[]): T[]`**](#intersect) - returns elements common to both arrays.
- [**`mergeSort<T>(array: readonly T[], key: string | ((item: T) => unknown), direction?: "asc" | "desc", compareFn?: (a: T, b: T) => number): T[]`**](#mergesort) - sorts array by key or function using merge sort (supports nested keys).
- [**`zip<T>(...arrays: ReadonlyArray<T>[]): T[][]`**](#zip) - combines multiple arrays element-wise.
- [**`partition<T>(array: readonly T[], predicate: (item: T, index: number, array: readonly T[]) => boolean): [T[], T[]]`**](#partition) - splits array into two arrays based on a predicate function.
- [**`range(start: number, end: number, step?: number): number[]`**](#range) - creates an array of numbers in a range.
- [**`take<T>(array: readonly T[], n?: number): T[]`**](#take) - takes the first `n` elements from an array.
- [**`takeWhile<T>(array: readonly T[], predicate: (item: T, index: number) => boolean): T[]`**](#takewhile) - takes elements from array while predicate is true.
- [**`compact<T>(array: readonly T[]): NonNullable<T>[]`**](#compact) - removes falsy values from an array.
- [**`countBy<T>(array: readonly T[], keyFn: (item: T) => string | number | symbol): Record<string, number>`**](#countby) - counts occurrences of items in an array by a key function.
- [**`toggle<T>(array: readonly T[], item: T): T[]`**](#toggle) - toggles an item in array (adds if not present, removes if present).
- [**`secureIndex(max: number): number`**](#secureindex) - returns a cryptographically secure random index.
- [**`secureRandom<T>(array: readonly T[]): T | undefined`**](#securerandom) - returns a secure random element from an array.
- [**`findLast<T>(array: readonly T[], predicate: (item: T, index: number, array: readonly T[]) => boolean): T | undefined`**](#findlast) - returns the last element matching predicate.
- [**`findLastIndex<T>(array: readonly T[], predicate: (item: T, index: number, array: readonly T[]) => boolean): number`**](#findlastindex) - returns the index of the last element matching predicate.
- [**`chunkBy<T>(array: readonly T[], predicate: (item: T, index: number, array: readonly T[]) => boolean): T[][]`**](#chunkby) - splits array into chunks based on predicate.
- [**`remove<T>(array: readonly T[], value: T): T[]`**](#remove) - removes all occurrences of a value.
- [**`isSorted<T>(array: readonly T[], direction?: 'asc' | 'desc', compareFn?: (a: T, b: T) => number): boolean`**](#issorted) - checks if array is sorted.
- [**`headOfArr<T>(array: readonly T[]): T | undefined`**](#headofarr) - returns the first element of an array.
- [**`lastOfArr<T>(array: readonly T[]): T | undefined`**](#lastofarr) - returns the last element of an array.
- [**`drop<T>(array: readonly T[], n: number): T[]`**](#drop) - drops the first n elements from an array.
- [**`dropWhile<T>(array: readonly T[], predicate: (item: T, index: number) => boolean): T[]`**](#dropwhile) - drops elements from the start while predicate returns true.
- [**`maxBy<T>(array: readonly T[], keyOrFn: keyof T | ((item: T) => number)): T | undefined`**](#maxby) - finds the element with the maximum value.
- [**`minBy<T>(array: readonly T[], keyOrFn: keyof T | ((item: T) => number)): T | undefined`**](#minby) - finds the element with the minimum value.

---

## Function Documentation & Usage Examples

### `chunk()`

Splits an array into chunks of the specified size.

**Method Signature:**

```ts
function chunk<T>(array: readonly T[], size: number): T[][];
```

**Parameters:**

- `array`: The input array to be chunked.
- `size`: The size of each chunk (must be a positive integer).

**Returns:**

- An array of chunks, each containing up to `size` elements.

**Throws:**

- `TypeError` if array is not an array.
- `Error` if chunk size is not a positive integer.

**Examples:**

```ts
import { chunk } from '@catbee/utils/array';

chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
```

---

### `unique()`

Removes duplicate items from an array, optionally by a key function.

**Method Signature:**

```ts
function unique<T>(array: readonly T[], keyFn?: (item: T) => unknown): T[];
```

**Parameters:**

- `array`: The input array to remove duplicates from.
- `keyFn`: An optional function to determine the key for each item.

**Returns:**

- A new array with unique items. Does not mutate the original array.

**Examples:**

```ts
import { unique } from '@catbee/utils/array';

unique([1, 2, 2, 3, 1]); // [1, 2, 3]
unique(users, user => user.id); // [{ id: 1, ... }, { id: 2, ... }]
```

---

### `flattenDeep()`

Deeply flattens a nested array to a single-level array using an iterative, stack-based approach.

**Method Signature:**

```ts
function flattenDeep<T>(array: readonly unknown[]): T[];
```

**Parameters:**

- `array`: The input array to deeply flatten.

**Returns:**

- A new flattened array of type `T[]`. Does not mutate the original array.

**Examples:**

```ts
import { flattenDeep } from '@catbee/utils/array';

flattenDeep([1, [2, [3, [4]], 5]]); // [1, 2, 3, 4, 5]
```

---

### `random()`

Returns a cryptographically secure random element from an array using Node.js crypto.

**Method Signature:**

```ts
function random<T>(array: readonly T[]): T | undefined;
```

**Parameters:**

- `array`: The input array to select a random element from.

**Returns:**

- A random element of type `T` or `undefined` if the array is empty.

**Examples:**

```ts
import { random } from '@catbee/utils/array';

random(['a', 'b', 'c']); // 'a' or 'b' or 'c'
```

---

### `groupBy()`

Groups array items by a key or function. Supports nested keys using dot notation (e.g., `'user.profile.age'`).

**Method Signature:**

```ts
function groupBy<T>(array: readonly T[], key: keyof T): Record<string, readonly T[]>;
```

```ts
function groupBy<T, K extends string | number | symbol>(array: readonly T[], keyFn: (item: T) => K): Record<K, readonly T[]>;
```

```ts
function groupBy<T>(array: readonly T[], keyOrFn: keyof T | ((item: T) => string | number | symbol)): Record<string, readonly T[]>;
```

**Parameters:**

- `array`: The input array to group items from.
- `keyOrFn`: The key (supports nested dot notation) or function to group items by.

**Returns:**

- An object where keys are the group identifiers and values are readonly arrays of grouped items.

**Examples:**

```ts
import { groupBy } from '@catbee/utils/array';

const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' }
];
groupBy(users, 'role'); // { admin: [...], user: [...] }
groupBy(users, user => user.name[0]); // { A: [...], B: [...], ... }
```

---

### `shuffle()`

Shuffles array elements using the Fisher-Yates algorithm with cryptographically secure randomness.

**Method Signature:**

```ts
function shuffle<T>(array: readonly T[]): T[];
```

**Parameters:**

- `array`: The input array to shuffle.

**Returns:**

- A new shuffled array of type `T[]`. Does not mutate the original array.

**Throws:**

- `TypeError` if array is not an array.

**Examples:**

```ts
import { shuffle } from '@catbee/utils/array';

shuffle([1, 2, 3, 4]); // [3, 1, 4, 2] (order will vary)
```

---

### `pluck()`

Extracts values for a given key from an array of objects.

**Method Signature:**

```ts
function pluck<T, K extends keyof T>(array: readonly T[], key: K): T[K][];
```

**Parameters:**

- `array`: The input array to pluck values from.
- `key`: The key to pluck values for.

**Returns:**

- An array of plucked values. Returns undefined for missing properties.

**Examples:**

```ts
import { pluck } from '@catbee/utils/array';

const users = [{ name: 'Alice' }, { name: 'Bob' }];
pluck(users, 'name'); // ['Alice', 'Bob']
```

---

### `difference()`

Returns elements in array `a` not present in array `b`.

**Method Signature:**

```ts
function difference<T>(a: readonly T[], b: readonly T[]): T[];
```

**Parameters:**

- `a`: The first array to compare.
- `b`: The second array to compare.

**Examples:**

```ts
import { difference } from '@catbee/utils/array';

difference([1, 2, 3, 4], [2, 4]); // [1, 3]
```

---

### `intersect()`

Returns elements common to both arrays.

**Method Signature:**

```ts
function intersect<T>(a: readonly T[], b: readonly T[]): T[];
```

**Parameters:**

- `a`: The first array to compare.
- `b`: The second array to compare.

**Examples:**

```ts
import { intersect } from '@catbee/utils/array';

intersect([1, 2, 3], [2, 3, 4]); // [2, 3]
```

---

### `mergeSort()`

Sorts array by key or function using merge sort (O(n log n)). Supports nested keys using dot notation (e.g., `'profile.age'`). Missing/undefined keys are sorted to the end (asc) or start (desc).

**Method Signature:**

```ts
function mergeSort<T>(
  array: readonly T[],
  key: string | ((item: T) => unknown),
  direction?: 'asc' | 'desc',
  compareFn?: (a: T, b: T) => number
): T[];
```

**Parameters:**

- `array`: The input array to sort.
- `key`: The key (supports nested dot notation) or function to sort by.
- `direction`: The sort direction, either "asc" or "desc" (default: "asc").
- `compareFn`: Optional custom compare function.

**Returns:**

- A new sorted array of type `T[]`. Does not mutate the original array.

**Throws:**

- `TypeError` if array is not an array.

**Examples:**

```ts
import { mergeSort } from '@catbee/utils/array';

const items = [{ value: 3 }, { value: 1 }, { value: 2 }];
mergeSort(items, item => item.value); // [{ value: 1 }, { value: 2 }, { value: 3 }]
mergeSort(items, item => item.value, 'desc'); // [{ value: 3 }, { value: 2 }, { value: 1 }]
```

---

### `zip()`

Combines multiple arrays element-wise.

**Method Signature:**

```ts
function zip<T>(...arrays: ReadonlyArray<T>[]): T[][];
```

**Parameters:**

- `arrays`: The input arrays to combine.

**Returns:**

- A new array of type `T[][]`. Output length equals the length of the shortest input array. Does not mutate the original arrays.

**Throws:**

- `TypeError` if any argument is not an array.

**Examples:**

```ts
import { zip } from '@catbee/utils/array';

zip([1, 2], ['a', 'b'], [true, false]); // [[1, 'a', true], [2, 'b', false]]
```

---

### `partition()`

Splits array into two arrays based on a predicate function. Supports type-guard narrowing.

**Method Signature:**

```ts
// Type guard overload
function partition<T, U extends T>(
  array: readonly T[],
  predicate: (item: T, index: number, array: readonly T[]) => item is U
): [U[], Exclude<T, U>[]]

// Boolean predicate overload
function partition<T>(
  array: readonly T[],
  predicate: (item: T, index: number, array: readonly T[]) => boolean
): [T[], T[]]
```

**Parameters:**

- `array`: The input array to partition.
- `predicate`: A function that returns true to include the item in the first array.
  - `item`: The current item being processed.
  - `index`: The index of the current item.
  - `array`: The original array being processed.

**Returns:**

- A tuple of two arrays: `[matched, unmatched]`. Does not mutate the original array.

**Examples:**

```ts
import { partition } from '@catbee/utils/array';

partition([1, 2, 3, 4], n => n % 2 === 0); // [[2, 4], [1, 3]]
```

---

### `range()`

Creates an array of numbers in a range.

**Method Signature:**

```ts
function range(start: number, end: number, step?: number): number[];
```

**Parameters:**

- `start`: The starting number of the range (inclusive).
- `end`: The ending number of the range (exclusive).
- `step`: The increment between numbers in the range (default is 1).

**Returns:**

- An array of numbers in the specified range.

**Throws:**

- `TypeError` if arguments are not finite numbers.
- `Error` if step is zero.

**Examples:**

```ts
import { range } from '@catbee/utils/array';

range(0, 5); // [0, 1, 2, 3, 4]
range(2, 10, 2); // [2, 4, 6, 8]
```

---

### `take()`

Takes the first `n` elements from an array.

**Method Signature:**

```ts
function take<T>(array: readonly T[], n?: number): T[];
```

**Parameters:**

- `array`: The input array to take elements from.
- `n`: The number of elements to take (default is 1).

**Returns:**

- A new array containing the first `n` elements. Does not mutate the original array.

**Examples:**

```ts
import { take } from '@catbee/utils/array';

take([1, 2, 3, 4], 2); // [1, 2]
```

---

### `takeWhile()`

Takes elements from array while predicate is true.

**Method Signature:**

```ts
function takeWhile<T>(array: readonly T[], predicate: (item: T, index: number) => boolean): T[];
```

**Parameters:**

- `array`: The input array to take elements from.
- `predicate`: A function that returns true to keep taking elements.
  - `item`: The current item being processed.
  - `index`: The index of the current item.

**Returns:**

- A new array containing the leading elements that satisfy the predicate. Does not mutate the original array.

**Examples:**

```ts
import { takeWhile } from '@catbee/utils/array';

takeWhile([1, 2, 3, 2, 1], n => n < 3); // [1, 2]
```

---

### `compact()`

Removes falsy values from an array. Falsy values are: `false`, `null`, `0`, `""`, `undefined`, and `NaN`.

**Method Signature:**

```ts
function compact<T>(array: readonly T[]): NonNullable<T>[];
```

**Parameters:**

- `array`: The input array to compact.

**Returns:**

- A new array with all falsy values removed. Does not mutate the original array.

**Examples:**

```ts
import { compact } from '@catbee/utils/array';

compact([0, 1, false, 2, '', 3, null, undefined]); // [1, 2, 3]
```

---

### `countBy()`

Counts occurrences by key or function.

**Method Signature:**

```ts
function countBy<T>(array: readonly T[], keyFn: (item: T) => string | number | symbol): Record<string, number>;
```

**Parameters:**

- `array`: The input array to count occurrences from.
- `keyFn`: A function that returns the key to count by.

**Returns:**

- An object where keys are the counted identifiers and values are their counts.

**Examples:**

```ts
import { countBy } from '@catbee/utils/array';

countBy(['cat', 'dog', 'cat'], pet => pet); // { cat: 2, dog: 1 }
```

---

### `toggle()`

Toggles an item in array (adds if not present, removes if present).

**Method Signature:**

```ts
function toggle<T>(array: readonly T[], item: T): T[];
```

**Parameters:**

- `array`: The input array.
- `item`: The item to toggle.

**Returns:**

- A new array with the item toggled.

**Examples:**

```ts
import { toggle } from '@catbee/utils/array';

toggle([1, 2, 3], 2); // [1, 3]
toggle([1, 3], 2); // [1, 3, 2]
```

---

### `secureIndex()`

Returns a cryptographically secure random index for an array. Used internally for secure pick/shuffle operations.

**Method Signature:**

```ts
function secureIndex(max: number): number;
```

**Parameters:**

- `max`: Upper bound (exclusive).

**Returns:**

- A secure random integer in range `[0, max)`.

**Throws:**

- `RangeError` if `max` is not a positive integer.

**Examples:**

```ts
import { secureIndex } from '@catbee/utils/array';

secureIndex(10); // 3 (unpredictable)
```

---

### `secureRandom()`

Returns a secure random element from an array using Node.js crypto.

**Method Signature:**

```ts
function secureRandom<T>(array: readonly T[]): T | undefined;
```

**Parameters:**

- `array`: The input array.

**Returns:**

- A random element or undefined if array is empty.

**Examples:**

```ts
import { secureRandom } from '@catbee/utils/array';

secureRandom(['a', 'b', 'c']); // 'b' (cryptographically secure)
```

---

### `findLast()`

Returns the last element in the array that satisfies the provided testing function.

**Method Signature:**

```ts
function findLast<T>(
  array: readonly T[],
  predicate: (item: T, index: number, array: readonly T[]) => boolean
): T | undefined;
```

**Parameters:**

- `array`: The input array.
- `predicate`: Function to test each element.

**Returns:**

- The found element, or undefined if not found.

**Examples:**

```ts
import { findLast } from '@catbee/utils/array';

findLast([1, 2, 3, 4], n => n > 2); // 4
```

---

### `findLastIndex()`

Returns the index of the last element in the array that satisfies the provided testing function.

**Method Signature:**

```ts
function findLastIndex<T>(
  array: readonly T[],
  predicate: (item: T, index: number, array: readonly T[]) => boolean
): number;
```

**Parameters:**

- `array`: The input array.
- `predicate`: Function to test each element.

**Returns:**

- The index, or -1 if not found.

**Examples:**

```ts
import { findLastIndex } from '@catbee/utils/array';

findLastIndex([1, 2, 3, 4], n => n > 2); // 3
```

---

### `chunkBy()`

Splits an array into chunks based on a predicate function. Each chunk starts when predicate returns true.

**Method Signature:**

```ts
function chunkBy<T>(
  array: readonly T[],
  predicate: (item: T, index: number, array: readonly T[]) => boolean
): T[][];
```

**Parameters:**

- `array`: The input array.
- `predicate`: Function to determine chunk boundaries.

**Returns:**

- Array of chunked arrays.

**Examples:**

```ts
import { chunkBy } from '@catbee/utils/array';

chunkBy([1, 2, 1, 3, 1], n => n === 1); // [[1, 2], [1, 3], [1]]
```

---

### `remove()`

Removes all occurrences of a value from an array.

**Method Signature:**

```ts
function remove<T>(array: readonly T[], value: T): T[];
```

**Parameters:**

- `array`: The input array.
- `value`: Value to remove.

**Returns:**

- New array with value removed.

**Examples:**

```ts
import { remove } from '@catbee/utils/array';

remove([1, 2, 3, 2, 1], 2); // [1, 3, 1]
```

---

### `isSorted()`

Checks if an array is sorted in ascending or descending order.

**Method Signature:**

```ts
function isSorted<T>(
  array: readonly T[],
  direction?: 'asc' | 'desc',
  compareFn?: (a: T, b: T) => number
): boolean;
```

**Parameters:**

- `array`: The input array.
- `direction`: Sort direction (default: 'asc').
- `compareFn`: Optional compare function.

**Returns:**

- True if sorted, false otherwise.

**Examples:**

```ts
import { isSorted } from '@catbee/utils/array';

isSorted([1, 2, 3, 4]); // true
isSorted([4, 3, 2, 1], 'desc'); // true
isSorted([1, 3, 2]); // false
```

---

### `headOfArr()`

Returns the first element of an array, or undefined if empty.

**Method Signature:**

```ts
function headOfArr<T>(array: readonly T[]): T | undefined;
```

**Parameters:**

- `array`: The input array.

**Returns:**

- The first element or undefined.

**Examples:**

```ts
import { headOfArr } from '@catbee/utils/array';

headOfArr([1, 2, 3]); // 1
headOfArr([]); // undefined
```

---

### `lastOfArr()`

Returns the last element of an array, or undefined if empty.

**Method Signature:**

```ts
function lastOfArr<T>(array: readonly T[]): T | undefined;
```

**Parameters:**

- `array`: The input array.

**Returns:**

- The last element or undefined.

**Examples:**

```ts
import { lastOfArr } from '@catbee/utils/array';

lastOfArr([1, 2, 3]); // 3
lastOfArr([]); // undefined
```

---

### `drop()`

Drops the first n elements from an array.

**Method Signature:**

```ts
function drop<T>(array: readonly T[], n: number): T[];
```

**Parameters:**

- `array`: The source array.
- `n`: Number of elements to drop.

**Returns:**

- Array with first n elements removed.

**Examples:**

```ts
import { drop } from '@catbee/utils/array';

drop([1, 2, 3, 4, 5], 2); // [3, 4, 5]
```

---

### `dropWhile()`

Drops elements from the start of an array while predicate returns true.

**Method Signature:**

```ts
function dropWhile<T>(array: readonly T[], predicate: (item: T, index: number) => boolean): T[];
```

**Parameters:**

- `array`: The source array.
- `predicate`: Condition function.

**Returns:**

- Array with elements dropped.

**Examples:**

```ts
import { dropWhile } from '@catbee/utils/array';

dropWhile([1, 2, 3, 4, 1], x => x < 3); // [3, 4, 1]
```

---

### `maxBy()`

Finds the element with the maximum value for a given key or function.

**Method Signature:**

```ts
function maxBy<T>(array: readonly T[], keyOrFn: keyof T | ((item: T) => number)): T | undefined;
```

**Parameters:**

- `array`: The source array.
- `keyOrFn`: Property key or function.

**Returns:**

- Element with maximum value.

**Examples:**

```ts
import { maxBy } from '@catbee/utils/array';

maxBy([{a: 1}, {a: 5}, {a: 3}], 'a'); // {a: 5}
maxBy([{a: 1}, {a: 5}, {a: 3}], x => x.a); // {a: 5}
```

---

### `minBy()`

Finds the element with the minimum value for a given key or function.

**Method Signature:**

```ts
function minBy<T>(array: readonly T[], keyOrFn: keyof T | ((item: T) => number)): T | undefined;
```

**Parameters:**

- `array`: The source array.
- `keyOrFn`: Property key or function.

**Returns:**

- Element with minimum value.

**Examples:**

```ts
import { minBy } from '@catbee/utils/array';

minBy([{a: 1}, {a: 5}, {a: 3}], 'a'); // {a: 1}
minBy([{a: 1}, {a: 5}, {a: 3}], x => x.a); // {a: 1}
```
