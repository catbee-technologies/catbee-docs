---
slug: ../type
---

# Type

A set of utility functions for type checking, conversion, and type guards in TypeScript. Includes primitives/type guards, conversion helpers, and type enforcement. All methods are fully typed.

## API Summary

- [**`isPrimitiveType(value: unknown, type: PrimitiveType): boolean`**](#isprimitivetype) - Checks if a value is of a specific primitive type.
- [**`getTypeOf(value: unknown): string`**](#gettypeof) - Returns the primitive type of a value as a string.
- [**`isArrayOf<T>(value, itemTypeGuard): value is T[]`**](#isarrayof) - Type guard for checking if a value is an array of a specific type.
- [**`toStr(value: unknown, defaultValue = ''): string`**](#tostr) - Converts a value to a string.
- [**`toNum(value: unknown, defaultValue = 0): number`**](#tonum) - Converts a value to a number.
- [**`toBool(value: unknown, defaultValue = false): boolean`**](#tobool) - Converts a value to a boolean.
- [**`ensureType<T>(value: unknown, expectedType: string, defaultValue: T): T`**](#ensuretype) - Ensures a value matches the expected type, or provides a default.
- [**`isDefined<T>(value: T | null | undefined): value is T`**](#isdefined) - Checks if a value is neither null nor undefined.
- [**`isEmpty(value: any): boolean`**](#isempty) - Checks if a value is empty.
- [**`isIterable<T>(value: unknown): value is Iterable<T>`**](#isiterable) - Type guard to check if a value is iterable.
- [**`isAsyncIterable<T>(value: unknown): value is AsyncIterable<T>`**](#isasynciterable) - Type guard to check if a value is async iterable.
- [**`assertType<T>(value, guard, message?): asserts value is T`**](#asserttype) - Asserts that a value is of a specific type, throwing an error if not.

---

## Interface & Types

```ts
type PrimitiveType = 'string' | 'number' | 'boolean' | 'symbol' | 'bigint' | 'function' | 'object' | 'array' | 'null' | 'undefined';
```

---

## Function Documentation & Usage Examples

### `isPrimitiveType()`

Checks if a value is of a specific primitive type.

**Method Signature:**

```ts
function isPrimitiveType(value: unknown, type: PrimitiveType): boolean;
```

**Parameters:**

- `value`: The value to check.
- `type`: The primitive type to check against.

**Returns:**

- `true` if the value matches the specified type, otherwise `false`.

**Example:**

```ts
import { isPrimitiveType } from '@catbee/utils/type';

isPrimitiveType('hello', 'string'); // true
isPrimitiveType(42, 'number'); // true
isPrimitiveType([], 'array'); // true
isPrimitiveType(null, 'null'); // true
```

---

### `getTypeOf()`

Returns the primitive type of a value as a string.

**Method Signature:**

```ts
getTypeOf(value: unknown): string;
```

**Parameters:**

- `value`: The value to check.

**Returns:**

- The primitive type of the value as a string.

**Example:**

```ts
import { getTypeOf } from '@catbee/utils/type';

getTypeOf('hello'); // 'string'
getTypeOf(42); // 'number'
getTypeOf([]); // 'array'
getTypeOf(null); // 'null'
```

---

### `isArrayOf()`

Type guard for checking if a value is an array of a specific type.

**Method Signature:**

```ts
function isArrayOf<T>(value: unknown, itemTypeGuard: (item: unknown) => item is T): value is T[];
```

**Parameters:**

- `value`: The value to check.
- `itemTypeGuard`: A type guard function to check each item in the array.

**Returns:**

- `true` if the value is an array and all items pass the type guard, otherwise `false`.

**Example:**

```ts
import { isArrayOf } from '@catbee/utils/type';

isArrayOf([1, 2, 3], (item): item is number => typeof item === 'number'); // true
isArrayOf(['a', 'b'], (item): item is string => typeof item === 'string'); // true
isArrayOf([1, '2'], (item): item is number => typeof item === 'number'); // false
```

---

### `toStr()`

Converts a value to a string. Returns a default value if conversion fails.

**Method Signature:**

```ts
function toStr(value: unknown, defaultValue: string = ''): string;
```

**Parameters:**

- `value`: The value to convert.
- `defaultValue`: The default string to return if conversion fails (default: '').

**Returns:**

- The string representation of the value, or the default value if conversion fails.

**Example:**

```ts
import { toStr } from '@catbee/utils/type';

toStr(42); // '42'
toStr({ a: 1 }); // '{"a":1}'
toStr(undefined, 'N/A'); // 'N/A'
```

---

### `toNum()`

Converts a value to a number. Returns a default value if conversion fails.

**Method Signature:**

```ts
function toNum(value: unknown, defaultValue: number = 0): number;
```

**Parameters:**

- `value`: The value to convert.
- `defaultValue`: The default number to return if conversion fails (default: 0).

**Returns:**

- The number representation of the value, or the default value if conversion fails.

**Example:**

```ts
import { toNum } from '@catbee/utils/type';

toNum('42'); // 42
toNum('abc', 0); // 0
toNum(undefined, 5); // 5
```

---

### `toBool()`

Converts a value to a boolean. Returns a default value if conversion fails.

**Method Signature:**

```ts
function toBool(value: unknown, defaultValue: boolean = false): boolean;
```

**Parameters:**

- `value`: The value to convert.
- `defaultValue`: The default boolean to return if conversion fails (default: false).

**Returns:**

- The boolean representation of the value, or the default value if conversion fails.

**Example:**

```ts
import { toBool } from '@catbee/utils/type';

toBool('true'); // true
toBool('no'); // false
toBool(1); // true
toBool(0); // false
```

---

### `ensureType()`

Ensures a value matches the expected type, or provides a default.

**Method Signature:**

```ts
function ensureType<T>(value: unknown, expectedType: string, defaultValue: T): T;
```

**Parameters:**

- `value`: The value to check.
- `expectedType`: The expected type as a string (e.g., 'string', 'number').
- `defaultValue`: The default value to return if the type does not match.

**Returns:**

- The original value if it matches the expected type, otherwise the default value.

**Example:**

```ts
import { ensureType } from '@catbee/utils/type';
ensureType(42, 'number', 0); // 42
ensureType('42', 'number', 0); // 0
ensureType(undefined, 'string', 'default'); // 'default'
```

---

### `isDefined()`

Checks whether a value is neither null nor undefined. Useful in filter chains and guards.

**Method Signature:**

```ts
function isDefined<T>(value: T | null | undefined): value is T;
```

**Parameters:**

- `value`: The value to check.

**Returns:**

- `true` when value is not null or undefined, otherwise `false`.

**Example:**

```ts
import { isDefined } from '@catbee/utils/type';

isDefined(42); // true
isDefined('hello'); // true
isDefined(null); // false
isDefined(undefined); // false

// Useful in filter chains
const values = [1, null, 2, undefined, 3];
const defined = values.filter(isDefined); // [1, 2, 3]
```

---

### `isEmpty()`

Checks whether a value is empty. Supports strings, arrays, maps, sets, and plain objects.

**Method Signature:**

```ts
function isEmpty(value: any): boolean;
```

**Parameters:**

- `value`: The value to inspect.

**Returns:**

- `true` when value is considered empty, otherwise `false`.

**Example:**

```ts
import { isEmpty } from '@catbee/utils/type';

isEmpty(''); // true
isEmpty('   '); // true (whitespace-only strings)
isEmpty([]); // true
isEmpty({}); // true
isEmpty(new Map()); // true
isEmpty(new Set()); // true
isEmpty(null); // true
isEmpty(undefined); // true

isEmpty('hello'); // false
isEmpty([1, 2, 3]); // false
isEmpty({ key: 'value' }); // false
```

---

### `isIterable()`

Type guard to check if a value is iterable.

**Method Signature:**

```ts
function isIterable<T = any>(value: unknown): value is Iterable<T>;
```

**Parameters:**

- `value`: The value to check.

**Returns:**

- `true` if value is iterable, otherwise `false`.

**Example:**

```ts
import { isIterable } from '@catbee/utils/type';

isIterable([1, 2, 3]); // true
isIterable('hello'); // true
isIterable(new Set([1, 2])); // true
isIterable(new Map([[1, 'a']])); // true
isIterable(42); // false
isIterable({}); // false
```

---

### `isAsyncIterable()`

Type guard to check if a value is async iterable.

**Method Signature:**

```ts
function isAsyncIterable<T = any>(value: unknown): value is AsyncIterable<T>;
```

**Parameters:**

- `value`: The value to check.

**Returns:**

- `true` if value is async iterable, otherwise `false`.

**Example:**

```ts
import { isAsyncIterable } from '@catbee/utils/type';

async function* asyncGenerator() {
  yield 1;
  yield 2;
}

isAsyncIterable(asyncGenerator()); // true
isAsyncIterable([1, 2, 3]); // false
isAsyncIterable('hello'); // false
```

---

### `assertType()`

Asserts that a value is of a specific type, throwing an error if not.

**Method Signature:**

```ts
function assertType<T>(
  value: unknown,
  guard: (value: unknown) => value is T,
  message?: string
): asserts value is T;
```

**Parameters:**

- `value`: The value to assert.
- `guard`: Type guard function to check the value.
- `message`: Optional custom error message if assertion fails.

**Returns:**

- Asserts value is of type T or throws TypeError.

**Example:**

```ts
import { assertType } from '@catbee/utils/type';

function processString(value: unknown) {
  assertType(value, (v): v is string => typeof v === 'string', 'Expected string');
  // TypeScript now knows value is a string
  return value.toUpperCase();
}

processString('hello'); // 'HELLO'
processString(42); // throws TypeError: Expected string
```
