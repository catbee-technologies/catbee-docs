---
slug: ../object
---

# Object

Helpers for manipulating objects. Includes methods for picking/omitting keys, deep merging, flattening, path-based access, deep equality, filtering, mapping, freezing, and more. All methods are fully typed.

## API Summary

- [**`isObjEmpty(obj)`**](#isobjempty) - checks if an object is empty.
- [**`pick(obj, keys)`**](#pick) - picks specific keys from an object.
- [**`omit(obj, keys)`**](#omit) - omits specific keys from an object.
- [**`deepObjMerge(target, ...sources)`**](#deepobjmerge) - deeply merges multiple objects into the target object.
- [**`isPlainObject(value)`**](#isplainobject) - checks if a value is a plain object.
- [**`flattenObject(obj, prefix = '')`**](#flattenobject) - flattens a nested object.
- [**`getValueByPath(obj, path)`**](#getvaluebypath) - gets a value by a dot/bracket notation path.
- [**`setValueByPath(obj, path, value)`**](#setvaluebypath) - sets a value by a dot/bracket notation path.
- [**`isEqual(a, b)`**](#isequal) - performs deep equality check between two values.
- [**`filterObject(obj, predicate)`**](#filterobject) - filters object properties based on a predicate function.
- [**`mapObject(obj, mapFn)`**](#mapobject) - maps object values using a mapping function.
- [**`deepClone(value)`**](#deepclone) - deeply clones any value.
- [**`deepFreeze(obj)`**](#deepfreeze) - deeply freezes an object.
- [**`isObject(value)`**](#isobject) - checks if a value is an object.
- [**`getAllPaths(obj, parentPath = '')`**](#getallpaths) - gets all paths in an object using dot notation.
- [**`invert(obj)`**](#invert) - inverts an object's keys and values.
- [**`invertBy(obj, keyFn)`**](#invertby) - inverts an object using a function to generate keys.
- [**`transform(obj, fn)`**](#transform) - transforms object values using a mapping function.

---

## Function Documentation & Usage Examples

### `isObjEmpty()`

Checks if an object has no own enumerable properties.

**Method Signature:**

```ts
function isObjEmpty(obj: Record<any, any>): boolean;
```

**Parameters:**

- `obj`: The object to check.

**Returns:**

- `true` if the object is empty, otherwise `false`.

**Examples:**

```ts
import { isObjEmpty } from '@catbee/utils/object';

isObjEmpty({}); // true
isObjEmpty({ a: 1 }); // false
```

---

### `pick()`

Returns a new object with only the specified keys.

**Method Signature:**

```ts
function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
```

**Parameters:**

- `obj`: The source object.
- `keys`: An array of keys to pick from the object.

**Returns:**

- A new object containing only the picked keys.

**Examples:**

```ts
import { pick } from '@catbee/utils/object';

pick({ a: 1, b: 2 }, ['a']); // { a: 1 }
```

---

### `omit()`

Returns a new object with the specified keys omitted.

**Method Signature:**

```ts
function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
```

**Parameters:**

- `obj`: The source object.
- `keys`: An array of keys to omit from the object.

**Returns:**

- A new object containing all keys except the omitted ones.

**Examples:**

```ts
import { omit } from '@catbee/utils/object';

omit({ a: 1, b: 2 }, ['a']); // { b: 2 }
```

---

### `deepObjMerge()`

Deeply merges multiple objects into the target object (mutates and returns target).

**Method Signature:**

```ts
function deepObjMerge<T extends object>(target: T, ...sources: any[]): T;
```

**Parameters:**

- `target`: The target object to merge into.
- `sources`: One or more source objects to merge from.

**Returns:**

- The mutated target object.

**Examples:**

```ts
import { deepObjMerge } from '@catbee/utils/object';

const a = { x: 1, y: { z: 2 } };
const b = { y: { w: 3 } };
deepObjMerge(a, b); // { x: 1, y: { z: 2, w: 3 } }
```

---

### `isPlainObject()`

Checks if a value is a plain object (not array, not null, not built-in).

**Method Signature:**

```ts
function isPlainObject(value: any): value is Record<string, any>;
```

**Parameters:**

- `value`: The value to check.

**Returns:**

- `true` if the value is a plain object, otherwise `false`.

**Examples:**

```ts
import { isPlainObject } from '@catbee/utils/object';

isPlainObject({});         // true
isPlainObject([]);         // false
isPlainObject(new Date()); // false
```

---

### `flattenObject()`

Flattens a nested object using dot notation for keys.

**Method Signature:**

```ts
function flattenObject<T extends Record<string, any>>(obj: T, prefix = ''): Record<string, any>;
```

**Parameters:**

- `obj`: The object to flatten.
- `prefix` (optional): A prefix to prepend to all keys (default: '').

**Returns:**

- A new flattened object.

**Examples:**

```ts
import { flattenObject } from '@catbee/utils/object';

flattenObject({ a: { b: 1 } }); // { 'a.b': 1 }
```

---

### `getValueByPath()`

Safely gets the value of a deeply nested key using dot/bracket notation.

**Method Signature:**

```ts
function getValueByPath<T extends object>(obj: T, path: string): any;
```

**Parameters:**

- `obj`: The source object.
- `path`: The path string (e.g. 'a.b[0].c').

**Returns:**

- The value at the specified path, or `undefined` if not found.

**Examples:**

```ts
import { getValueByPath } from '@catbee/utils/object';

getValueByPath({ a: { b: [{ c: 5 }] } }, 'a.b[0].c'); // 5
```

---

### `setValueByPath()`

Sets a value at a deeply nested key using dot/bracket notation. Returns a new object with the value set (does not mutate the original).

**Method Signature:**

```ts
function setValueByPath<T extends object>(obj: T, path: string, value: any): T;
```

**Parameters:**

- `obj`: The target object.
- `path`: The path string (e.g. 'a.b[0].c').
- `value`: The value to set at the specified path.

**Returns:**

- The new object with the value set (original object is not mutated).

**Examples:**

```ts
import { setValueByPath } from '@catbee/utils/object';

const obj = { a: {} };
const result = setValueByPath(obj, 'a.b.c', 10);
// result is { a: { b: { c: 10 } } }
// obj remains { a: {} } (not mutated)
```

---

### `isEqual()`

Performs a deep equality check between two values.

**Method Signature:**

```ts
function isEqual(a: any, b: any): boolean;
```

**Parameters:**

- `a`: The first value to compare.
- `b`: The second value to compare.

**Returns:**

- `true` if the values are deeply equal, otherwise `false`.

**Examples:**

```ts
import { isEqual } from '@catbee/utils/object';

isEqual({ x: [1, 2] }, { x: [1, 2] }); // true
isEqual({ x: 1 }, { x: 2 });           // false
```

---

### `filterObject()`

Filters object properties based on a predicate function.

**Method Signature:**

```ts
function filterObject<T extends object>(obj: T, predicate: (value: any, key: string, obj: T) => boolean): Partial<T>;
```

**Parameters:**

- `obj`: The source object.
- `predicate`: A function that returns `true` to keep the property, or `false` to omit it.
  - `value`: The current property value.
  - `key`: The current property key.
  - `obj`: The original object.

**Returns:**

- A new object containing only the properties that passed the predicate.

**Examples:**

```ts
import { filterObject } from '@catbee/utils/object';

filterObject({ a: 1, b: 2 }, v => v > 1); // { b: 2 }
```

---

### `mapObject()`

Maps object values to new values using a mapping function.

**Method Signature:**

```ts
function mapObject<T extends object, U>(obj: T, mapFn: (value: any, key: string, obj: T) => U): Record<keyof T, U>;
```

**Parameters:**

- `obj`: The source object.
- `mapFn`: A function that transforms each value.
  - `value`: The current property value.
  - `key`: The current property key.
  - `obj`: The original object.

**Returns:**

- A new object with the same keys but transformed values.

**Examples:**

```ts
import { mapObject } from '@catbee/utils/object';

mapObject({ a: 1, b: 2 }, v => v * 2); // { a: 2, b: 4 }
```

---

### `deepClone()`

Deeply clones any value, including objects, arrays, and built-in types.

**Method Signature:**

```ts
function deepClone<T>(value: T): T;
```

**Parameters:**

- `value`: The value to deeply clone.

**Returns:**

- A fully deep-cloned copy of the input.

**Examples:**

```ts
import { deepClone } from '@catbee/utils/object';

const original = { a: { b: [1, 2, 3] }, date: new Date() };
const cloned = deepClone(original);
cloned.a.b.push(4);
// original.a.b is still [1, 2, 3]
```

---

### `deepFreeze()`

Recursively freezes an object and all its properties.

**Method Signature:**

```ts
function deepFreeze<T extends object>(obj: T): Readonly<T>;
```

**Parameters:**

- `obj`: The object to deeply freeze.

**Returns:**

- The deeply frozen object.

**Examples:**

```ts
import { deepFreeze } from '@catbee/utils/object';

const frozen = deepFreeze({ a: { b: 2 } });
// frozen.a.b = 3 // Throws error in strict mode
```

---

### `isObject()`

Safely checks if a value is an object (not null, not array).

**Method Signature:**

```ts
function isObject(value: unknown): value is Record<string, any>;
```

**Parameters:**

- `value`: The value to check.

**Returns:**

- `true` if the value is an object, otherwise `false`.

**Examples:**

```ts
import { isObject } from '@catbee/utils/object';

isObject({});   // true
isObject(null); // false
isObject([]);   // false
```

---

### `getAllPaths()`

Gets all paths in an object using dot notation.

**Method Signature:**

```ts
function getAllPaths(obj: Record<string, any>, parentPath = ''): string[];
```

**Parameters:**

- `obj`: The object to extract paths from.
- `parentPath` (optional): A prefix to prepend to all paths (default: '').

**Returns:**

- An array of strings representing all paths in the object.

**Examples:**

```ts
import { getAllPaths } from '@catbee/utils/object';

getAllPaths({ a: { b: 1 }, c: 2 }); // ['a', 'a.b', 'c']
```

---

### `invert()`

Inverts an object's keys and values.

**Method Signature:**

```ts
function invert<T extends Record<string, any>>(obj: T): Record<string, string>;
```

**Parameters:**

- `obj`: The object to invert.

**Returns:**

- A new object with keys and values swapped.

**Examples:**

```ts
import { invert } from '@catbee/utils/object';

invert({ a: 'x', b: 'y' }); // { x: 'a', y: 'b' }
```

---

### `invertBy()`

Inverts an object using a function to generate keys from values.

**Method Signature:**

```ts
function invertBy<T extends Record<string, any>>(
  obj: T,
  keyFn: (value: any) => string
): Record<string, string[]>;
```

**Parameters:**

- `obj`: The object to invert.
- `keyFn`: A function that generates new keys from values.

**Returns:**

- An inverted object with arrays of keys grouped by the generated key.

**Examples:**

```ts
import { invertBy } from '@catbee/utils/object';

invertBy({ a: 1, b: 2, c: 1 }, v => String(v));
// { '1': ['a', 'c'], '2': ['b'] }
```

---

### `transform()`

Transforms object values using a mapping function.

**Method Signature:**

```ts
function transform<T extends Record<string, any>, U>(
  obj: T,
  fn: (value: any, key: string) => U
): Record<string, U>;
```

**Parameters:**

- `obj`: The source object.
- `fn`: A transformation function that takes a value and key, returning the transformed value.

**Returns:**

- A new object with transformed values.

**Examples:**

```ts
import { transform } from '@catbee/utils/object';

transform({ a: 1, b: 2 }, v => v * 2); // { a: 2, b: 4 }
```
