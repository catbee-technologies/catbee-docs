---
id: api-reference
title: API Reference
sidebar_position: 4
---

## LocalStorageService & SessionStorageService

Both services share the same API. The only difference is that `LocalStorageService` persists data across browser sessions, while `SessionStorageService` data is cleared when the browser tab is closed.

## API Summary

- [**`set(key: string, value: string, skipEncoding?: boolean): void`**](#set) - Stores a string value in storage.
- [**`get(key: string, skipDecoding?: boolean): string | null`**](#get) - Retrieves a string value from storage.
- [**`delete(key: string): void`**](#delete) - Removes an item from storage.
- [**`has(key: string): boolean`**](#has) - Checks if a key exists in storage.
- [**`clear(): void`**](#clear) - Removes all items from storage.
- [**`keys(): string[]`**](#keys) - Returns an array of all storage keys.
- [**`values(): (string | null)[]`**](#values) - Returns an array of all storage values.
- [**`entries(): [string, string | null][]`**](#entries) - Returns an array of key-value pairs.
- [**`setJson<T>(key: string, value: T): void`**](#setjson) - Stores an object as JSON.
- [**`getJson<T>(key: string, skipDecoding?: boolean): T | null`**](#getjson) - Retrieves and parses a JSON value.
- [**`getJsonWithDefault<T>(key: string, defaultValue: T): T`**](#getjsonwithdefault) - Retrieves JSON or sets and returns default if missing.
- [**`updateJson<T>(key: string, updates: Partial<T>, defaultValue: T): void`**](#updatejson) - Partially updates a JSON object.
- [**`setArray<T>(key: string, value: T[]): void`**](#setarray) - Stores an array as JSON.
- [**`getArray<T>(key: string, skipDecoding?: boolean): T[] | null`**](#getarray) - Retrieves and parses an array.
- [**`getArrayWithDefault<T>(key: string, defaultValue?: T[]): T[]`**](#getarraywithdefault) - Retrieves array or sets and returns default if missing.
- [**`getBoolean(key: string, skipDecoding?: boolean): boolean | null`**](#getboolean) - Parses a value as boolean.
- [**`getBooleanWithDefault(key: string, defaultValue: boolean): boolean`**](#getbooleanwithdefault) - Parses boolean or sets and returns default if missing.
- [**`getNumber(key: string, skipDecoding?: boolean): number | null`**](#getnumber) - Parses a value as number.
- [**`getNumberWithDefault(key: string, defaultValue: number): number`**](#getnumberwithdefault) - Parses number or sets and returns default if missing.
- [**`getEnum<T extends string>(key: string, enumValues: T[], skipDecoding?: boolean): T | null`**](#getenum) - Gets and validates an enum value.
- [**`getEnumWithDefault<T extends string>(key: string, defaultValue: T, enumValues: T[]): T`**](#getenumwithdefault) - Gets enum or sets and returns default if missing or invalid.
- [**`setIfNotExists(key: string, value: string): void`**](#setifnotexists) - Sets a value only if the key doesn't already exist.
- [**`getWithDefault(key: string, defaultValue: string, allowedValues?: string[]): string`**](#getwithdefault) - Gets value with validation or sets and returns default.
- [**`multiGet(keys: string[]): Map<string, string | null>`**](#multiget) - Retrieves multiple values at once.
- [**`multiSet(entries: Record<string, string>): void`**](#multiset) - Sets multiple values at once.
- [**`deleteMany(keys: string[]): void`**](#deletemany) - Deletes multiple keys at once.
- [**`size(): number`**](#size) - Calculates the total size of all stored items in bytes.
- [**`watch(key: string): Observable<string | null>`**](#watch) - Returns an observable that emits when the specified key changes.
- [**`watchAll(): Observable<StorageChangeEvent>`**](#watchall) - Returns an observable that emits for any storage change.

---

## Types

### `StorageChangeEvent`

Event emitted by `watchAll()`.

```typescript
interface StorageChangeEvent {
  key: string | null;
  oldValue: string | null;
  newValue: string | null;
  storageArea: Storage | null;
}
```

### `StorageConfig`

Configuration interface.

```typescript
interface StorageConfig {
  encoding?: 'default' | 'base64' | 'custom';
  customEncode?: (value: string) => string;
  customDecode?: (value: string) => string;
}
```

---

## Basic Methods

### `set()`

Stores a string value in storage.

**Method Signature:**

```typescript
set(key: string, value: string, skipEncoding?: boolean): void
```

**Parameters:**

- `key` - The storage key
- `value` - The string value to store
- `skipEncoding` - Optional. Skip encoding if true (default: false)

**Example:**

```typescript
localStorage.set('username', 'john_doe');
localStorage.set('rawData', 'value', true); // Skip encoding
```

---

### `get()`

Retrieves a string value from storage.

**Method Signature:**

```typescript
get(key: string, skipDecoding?: boolean): string | null
```

**Parameters:**

- `key` - The storage key
- `skipDecoding` - Optional. Skip decoding if true (default: false)

**Returns:** The stored value or `null` if not found

**Example:**

```typescript
const username = localStorage.get('username');
if (username) {
  console.log('Welcome', username);
}
```

---

### `delete()`

Removes an item from storage.

**Method Signature:**

```typescript
delete(key: string): void
```

**Parameters:**

- `key` - The storage key to remove

**Example:**

```typescript
localStorage.delete('username');
```

---

### `has()`

Checks if a key exists in storage.

**Method Signature:**

```typescript
has(key: string): boolean
```

**Parameters:**

- `key` - The storage key to check

**Returns:** `true` if key exists, `false` otherwise

**Example:**

```typescript
if (localStorage.has('authToken')) {
  console.log('User is authenticated');
}
```

---

### `clear()`

Removes all items from storage.

**Method Signature:**

```typescript
clear(): void
```

**Example:**

```typescript
localStorage.clear();
```

---

### `keys()`

Returns an array of all storage keys.

**Method Signature:**

```typescript
keys(): string[]
```

**Returns:** Array of key strings

**Example:**

```typescript
const allKeys = localStorage.keys();
console.log('Storage contains:', allKeys);
```

---

### `values()`

Returns an array of all storage values.

**Method Signature:**

```typescript
values(): (string | null)[]
```

**Returns:** Array of values

**Example:**

```typescript
const allValues = localStorage.values();
```

---

### `entries()`

Returns an array of key-value pairs.

**Method Signature:**

```typescript
entries(): [string, string | null][]
```

**Returns:** Array of tuples `[key, value]`

**Example:**

```typescript
const entries = localStorage.entries();
for (const [key, value] of entries) {
  console.log(`${key}: ${value}`);
}
```

---

## JSON Methods

### `setJson()`

Stores an object as JSON.

**Method Signature:**

```typescript
setJson<T>(key: string, value: T): void
```

**Parameters:**

- `key` - The storage key
- `value` - The object to store

**Example:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = { id: 1, name: 'John', email: 'john@example.com' };
localStorage.setJson('user', user);
```

---

### `getJson()`

Retrieves and parses a JSON value.

**Method Signature:**

```typescript
getJson<T>(key: string, skipDecoding?: boolean): T | null
```

**Parameters:**

- `key` - The storage key
- `skipDecoding` - Optional. Skip decoding if true

**Returns:** The parsed object or `null` if not found or invalid JSON

**Example:**

```typescript
const user = localStorage.getJson<User>('user');
if (user) {
  console.log(user.name);
}
```

---

### `getJsonWithDefault()`

Retrieves JSON or sets and returns default if missing.

**Method Signature:**

```typescript
getJsonWithDefault<T>(key: string, defaultValue: T): T
```

**Parameters:**

- `key` - The storage key
- `defaultValue` - The default value to use if key doesn't exist

**Returns:** The stored object or default value

**Example:**

```typescript
const settings = localStorage.getJsonWithDefault('settings', {
  theme: 'light',
  language: 'en'
});
```

---

### `updateJson()`

Partially updates a JSON object.

**Method Signature:**

```typescript
updateJson<T>(key: string, updates: Partial<T>, defaultValue: T): void
```

**Parameters:**

- `key` - The storage key
- `updates` - Partial object with properties to update
- `defaultValue` - Default value if key doesn't exist

**Example:**

```typescript
// Only update the theme property
localStorage.updateJson('settings', { theme: 'dark' }, {
  theme: 'light',
  language: 'en'
});
```

---

## Array Methods

### `setArray()`

Stores an array as JSON.

**Method Signature:**

```typescript
setArray<T>(key: string, value: T[]): void
```

**Parameters:**

- `key` - The storage key
- `value` - The array to store

**Example:**

```typescript
localStorage.setArray('tags', ['angular', 'typescript', 'rxjs']);
```

---

### `getArray()`

Retrieves and parses an array.

**Method Signature:**

```typescript
getArray<T>(key: string, skipDecoding?: boolean): T[] | null
```

**Parameters:**

- `key` - The storage key
- `skipDecoding` - Optional. Skip decoding if true

**Returns:** The parsed array or `null` if not found or invalid

**Example:**

```typescript
const tags = localStorage.getArray<string>('tags');
if (tags) {
  console.log('Tags:', tags.join(', '));
}
```

---

### `getArrayWithDefault()`

Retrieves array or sets and returns default if missing.

**Method Signature:**

```typescript
getArrayWithDefault<T>(key: string, defaultValue: T[] = []): T[]
```

**Parameters:**

- `key` - The storage key
- `defaultValue` - The default array (default: `[]`)

**Returns:** The stored array or default value

**Example:**

```typescript
const tags = localStorage.getArrayWithDefault<string>('tags', ['default']);
```

---

## Boolean Methods

### `getBoolean()`

Parses a value as boolean. Recognizes: `true`, `false`, `1`, `0`, `yes`, `no`, `on`, `off`.

**Method Signature:**

```typescript
getBoolean(key: string, skipDecoding?: boolean): boolean | null
```

**Parameters:**

- `key` - The storage key
- `skipDecoding` - Optional. Skip decoding if true

**Returns:** Boolean value or `null` if not found or invalid

**Example:**

```typescript
const isDark = localStorage.getBoolean('darkMode');
if (isDark) {
  document.body.classList.add('dark');
}
```

---

### `getBooleanWithDefault()`

Parses boolean or sets and returns default if missing.

**Method Signature:**

```typescript
getBooleanWithDefault(key: string, defaultValue: boolean): boolean
```

**Parameters:**

- `key` - The storage key
- `defaultValue` - The default boolean value

**Returns:** Boolean value or default

**Example:**

```typescript
const cookiesAccepted = localStorage.getBooleanWithDefault('cookiesAccepted', false);
```

---

## Number Methods

### `getNumber()`

Parses a value as number.

**Method Signature:**

```typescript
getNumber(key: string, skipDecoding?: boolean): number | null
```

**Parameters:**

- `key` - The storage key
- `skipDecoding` - Optional. Skip decoding if true

**Returns:** Number value or `null` if not found or invalid

**Example:**

```typescript
const count = localStorage.getNumber('viewCount');
if (count !== null) {
  console.log('Page views:', count);
}
```

---

### `getNumberWithDefault()`

Parses number or sets and returns default if missing.

**Method Signature:**

```typescript
getNumberWithDefault(key: string, defaultValue: number): number
```

**Parameters:**

- `key` - The storage key
- `defaultValue` - The default number value

**Returns:** Number value or default

**Example:**

```typescript
const retryCount = localStorage.getNumberWithDefault('retryCount', 0);
```

---

## Enum Methods

### `getEnum()`

Gets and validates an enum value.

**Method Signature:**

```typescript
getEnum<T extends string>(key: string, enumValues: T[], skipDecoding?: boolean): T | null
```

**Parameters:**

- `key` - The storage key
- `enumValues` - Array of valid enum values
- `skipDecoding` - Optional. Skip decoding if true

**Returns:** Enum value if valid or `null` if not found or invalid

**Example:**

```typescript
type Theme = 'light' | 'dark' | 'auto';
const theme = localStorage.getEnum<Theme>('theme', ['light', 'dark', 'auto']);
```

---

### `getEnumWithDefault()`

Gets enum or sets and returns default if missing or invalid.

**Method Signature:**

```typescript
getEnumWithDefault<T extends string>(key: string, defaultValue: T, enumValues: T[]): T
```

**Parameters:**

- `key` - The storage key
- `defaultValue` - The default enum value
- `enumValues` - Array of valid enum values

**Returns:** Valid enum value or default

**Example:**

```typescript
type Language = 'en' | 'es' | 'fr';
const lang = localStorage.getEnumWithDefault<Language>('language', 'en', ['en', 'es', 'fr']);
```

---

## Advanced Methods

### `setIfNotExists()`

Sets a value only if the key doesn't already exist.

**Method Signature:**

```typescript
setIfNotExists(key: string, value: string): void
```

**Parameters:**

- `key` - The storage key
- `value` - The value to set

**Example:**

```typescript
// Only set if user hasn't visited before
localStorage.setIfNotExists('firstVisit', new Date().toISOString());
```

---

### `getWithDefault()`

Gets value with validation or sets and returns default.

**Method Signature:**

```typescript
getWithDefault(key: string, defaultValue: string, allowedValues?: string[]): string
```

**Parameters:**

- `key` - The storage key
- `defaultValue` - The default value
- `allowedValues` - Optional. Array of allowed values for validation

**Returns:** The value or default

**Example:**

```typescript
const mode = localStorage.getWithDefault('displayMode', 'grid', ['grid', 'list']);
```

---

### `multiGet()`

Retrieves multiple values at once.

**Method Signature:**

```typescript
multiGet(keys: string[]): Map<string, string | null>
```

**Parameters:**

- `keys` - Array of storage keys

**Returns:** Map of key-value pairs

**Example:**

```typescript
const values = localStorage.multiGet(['username', 'email', 'theme']);
const username = values.get('username');
const email = values.get('email');
```

---

### `multiSet()`

Sets multiple values at once.

**Method Signature:**

```typescript
multiSet(entries: Record<string, string>): void
```

**Parameters:**

- `entries` - Object with key-value pairs

**Example:**

```typescript
localStorage.multiSet({
  username: 'john_doe',
  email: 'john@example.com',
  theme: 'dark'
});
```

---

### `deleteMany()`

Deletes multiple keys at once.

**Method Signature:**

```typescript
deleteMany(keys: string[]): void
```

**Parameters:**

- `keys` - Array of storage keys to delete

**Example:**

```typescript
localStorage.deleteMany(['tempKey1', 'tempKey2', 'cache']);
```

---

### `size()`

Calculates the total size of all stored items in bytes.

**Method Signature:**

```typescript
size(): number
```

**Returns:** Total size in bytes

**Example:**

```typescript
const bytes = localStorage.size();
console.log(`Storage usage: ${bytes} bytes`);
```

---

## Reactive Methods

### `watch()`

Returns an observable that emits when the specified key changes.

**Method Signature:**

```typescript
watch(key: string): Observable<string | null>
```

**Parameters:**

- `key` - The storage key to watch

**Returns:** Observable that emits the new value

**Example:**

```typescript
localStorage.watch('theme').subscribe(theme => {
  console.log('Theme changed to:', theme);
  applyTheme(theme);
});
```

---

### `watchAll()`

Returns an observable that emits for any storage change.

**Method Signature:**

```typescript
watchAll(): Observable<StorageChangeEvent>
```

**Returns:** Observable that emits storage change events

**Example:**

```typescript
localStorage.watchAll().subscribe(event => {
  console.log(`Key "${event.key}" changed from "${event.oldValue}" to "${event.newValue}"`);
});
```
