---
id: api-reference
title: API Reference
sidebar_position: 4
---

# CatbeeCookieService

The main service for managing browser cookies with type safety and SSR compatibility.

:::tip Service Aliases

```typescript
import { CatbeeCookieService, CatbeeSsrCookieService } from '@ng-catbee/cookie';
```

You can also import the services using the shorter aliases:

```typescript
import { CookieService, SsrCookieService } from '@ng-catbee/cookie';
```

Both pairs refer to the same services respectively.
:::

:::warning
Use `CatbeeSsrCookieService` or `SsrCookieService` for server-side rendering (SSR) scenarios.

`CatbeeSsrCookieService` provides only getting cookies from the request headers and does not support setting cookies.
:::

## API Summary

- [**`set(name: string, value: string, options?: CookieOptions): void`**](#set) - sets a cookie.
- [**`get(name: string): string | null`**](#get) - retrieves a cookie value.
- [**`delete(name: string, options?: CookieOptions): void`**](#delete) - deletes a cookie.
- [**`has(name: string): boolean`**](#has) - checks if a cookie exists.
- [**`deleteAll(options?: CookieOptions): void`**](#deleteall) - deletes all cookies.
- [**`setJson<T>(name: string, value: T, options?: CookieOptions): void`**](#setjson) - stores a JSON-serializable value as a cookie.
- [**`getJson<T>(name: string): T | null`**](#getjson) - retrieves and parses a JSON cookie.
- [**`getJsonWithDefault<T>(name: string, defaultValue: T, options?: CookieOptions): T`**](#getjsonwithdefault) - retrieves a JSON cookie with default setting.
- [**`updateJson<T>(name: string, updates: Partial<T>, defaultValue: T, options?: CookieOptions): void`**](#updatejson) - partially updates a JSON cookie.
- [**`setArray<T>(name: string, value: T[], options?: CookieOptions): void`**](#setarray) - stores an array as a JSON cookie.
- [**`getArray<T>(name: string): T[] | null`**](#getarray) - retrieves an array cookie.
- [**`getArrayWithDefault<T>(name: string, defaultValue: T[], options?: CookieOptions): T[]`**](#getarraywithdefault) - retrieves an array cookie with default setting.
- [**`getBoolean(name: string): boolean`**](#getboolean) - parses a cookie as a boolean.
- [**`getBooleanWithDefault(name: string, defaultValue: boolean, options?: CookieOptions): boolean`**](#getbooleanwithdefault) - retrieves a boolean cookie with default setting.
- [**`getNumber(name: string): number`**](#getnumber) - parses a cookie as a number.
- [**`getNumberWithDefault(name: string, defaultValue: number, options?: CookieOptions): number`**](#getnumberwithdefault) - retrieves a number cookie with default setting.
- [**`getEnum<T>(name: string, enumValues: readonly T[]): T | null`**](#getenum) - retrieves a validated enum value.
- [**`getEnumWithDefault<T>(name: string, defaultValue: T, enumValues: readonly T[], options?: CookieOptions): T`**](#getenumwithdefault) - retrieves a validated enum cookie with default setting.
- [**`setIfNotExists(name: string, value: string, options?: CookieOptions): void`**](#setifnotexists) - sets a cookie only if it doesn't exist.
- [**`getWithDefault(name: string, defaultValue: string, allowedValues?: readonly string[], options?: CookieOptions): string`**](#getwithdefault) - retrieves a cookie with validation and default setting.
- [**`getAll(): Record<string, string>`**](#getall) - retrieves all cookies as a key-value object.
- [**`keys(): string[]`**](#keys) - gets an array of all cookie names.
- [**`values(): string[]`**](#values) - gets an array of all cookie values.
- [**`entries(): [string, string][]`**](#entries) - gets an array of all cookie entries as key-value tuples.
- [**`deleteMany(names: string[], options?: CookieOptions): void`**](#deletemany) - deletes multiple cookies at once.

---

## CookieOptions Interface

```typescript
interface CookieOptions {
  /** Expiration date or number of days from now */
  expires?: Date | number;
  /** Cookie path @default '/' */
  path?: string;
  /** Cookie domain @default current domain */
  domain?: string;
  /** Requires HTTPS @default false */
  secure?: boolean;
  /** CSRF protection @default 'Lax' */
  sameSite?: 'Lax' | 'Strict' | 'None';
  /** Partitioned cookie (CHIPS) @default undefined */
  partitioned?: boolean;
  /** Cookie priority (Chrome-specific) @default 'Medium' */
  priority?: 'Low' | 'Medium' | 'High';
}
```

### Priority Attribute

The `priority` attribute is a Chrome-specific extension that allows you to specify the priority of a cookie. This helps browsers decide which cookies to keep when storage limits are reached.

**Values:**

- `'Low'` - Cookie will be evicted first when storage is full
- `'Medium'` - Default priority (balanced approach)
- `'High'` - Cookie will be kept as long as possible

**Example:**

```typescript
// Set a high-priority authentication cookie
cookieService.set('authToken', 'xyz789', {
  priority: 'High',
  secure: true,
  sameSite: 'Strict'
});

// Set a low-priority tracking cookie
cookieService.set('analytics', 'track123', {
  priority: 'Low',
  expires: 30
});
```

---

## Basic Methods

### `set()`

Sets a cookie with the specified name and value.

**Method Signature:**

```typescript
set(name: string, value: string, options?: CookieOptions): void
```

**Parameters:**

- `name` - Cookie name
- `value` - Cookie value
- `options` - Optional cookie configuration

**Example:**

```typescript
cookieService.set('username', 'john_doe');

// With options
cookieService.set('sessionId', 'abc123', {
  expires: 7,        // 7 days from now
  secure: true,
  sameSite: 'Strict'
});

// With specific expiration date
cookieService.set('promo', 'SAVE20', {
  expires: new Date('2025-12-31'),
  path: '/shop'
});
```

---

### `get()`

Retrieves a cookie value.

**Method Signature:**

```typescript
get(name: string): string | null
```

**Parameters:**

- `name` - Cookie name

**Returns:** Cookie value or `null` if not found

**Example:**

```typescript
const username = cookieService.get('username');
if (username) {
  console.log('User:', username);
}
```

---

### `delete()`

Deletes a cookie by setting its expiration to the past.

**Method Signature:**

```typescript
delete(name: string, options?: CookieOptions): void
```

**Parameters:**

- `name` - Cookie name
- `options` - Optional cookie configuration (must match the path/domain used when setting)

**Example:**

```typescript
cookieService.delete('username');

// Delete cookie with specific path/domain
cookieService.delete('sessionId', {
  path: '/',
  domain: '.example.com'
});
```

---

### `has()`

Checks if a cookie exists.

**Method Signature:**

````typescript
has(name: string): boolean

**Parameters:**

- `name` - Cookie name

**Returns:** `true` if cookie exists, `false` otherwise

**Example:**

```typescript
if (cookieService.has('authToken')) {
  console.log('User is authenticated');
}
````

---

### `deleteAll()`

Deletes all accessible cookies.

**Method Signature:**

```typescript
deleteAll(options?: CookieOptions): void
```

**Parameters:**

- `options` - Optional cookie configuration applied to all deletions

**Example:**

```typescript
// Clear all cookies
cookieService.deleteAll();

// Clear all cookies for specific path
cookieService.deleteAll({ path: '/' });
```

---

## JSON Methods

### `setJson()`

Stores a JSON-serializable value as a cookie.

**Method Signature:**

```typescript
setJson<T>(name: string, value: T, options?: CookieOptions): void
```

**Parameters:**

- `name` - Cookie name
- `value` - JSON-serializable value of type `T`
- `options` - Optional cookie configuration

**Example:**

```typescript
interface UserPreferences {
  theme: string;
  language: string;
  notifications: boolean;
}

const prefs: UserPreferences = {
  theme: 'dark',
  language: 'en',
  notifications: true
};

cookieService.setJson('userPrefs', prefs, { expires: 30 });
```

---

### `getJson()`

Retrieves and parses a JSON cookie (read-only, doesn't set defaults).

**Method Signature:**

```typescript
getJson<T>(name: string): T | null
```

**Parameters:**

- `name` - Cookie name

**Returns:** Parsed value of type `T`, or `null` if not found or invalid JSON

**Example:**

```typescript
interface UserPreferences {
  theme: string;
  language: string;
  notifications: boolean;
}

const prefs = cookieService.getJson<UserPreferences>('userPrefs');
if (prefs) {
  console.log('Theme:', prefs.theme);
}
```

---

### `getJsonWithDefault()`

Retrieves a JSON cookie, automatically setting the default value if missing or invalid.

**Method Signature:**

```typescript
getJsonWithDefault<T>(name: string, defaultValue: T, options?: CookieOptions): T
```

**Parameters:**

- `name` - Cookie name
- `defaultValue` - Default value to return and set if cookie is missing/invalid
- `options` - Optional cookie configuration for setting the default

**Returns:** Parsed value of type `T`, or default value

**Example:**

```typescript
const defaultPrefs = {
  theme: 'light',
  language: 'en',
  notifications: false
};

// Returns existing prefs, or sets and returns defaultPrefs if missing
const prefs = cookieService.getJsonWithDefault('userPrefs', defaultPrefs, {
  expires: 30
});
```

---

### `updateJson()`

Performs a partial update of a JSON cookie, merging updates with existing values.

**Method Signature:**

```typescript
updateJson<T>(name: string, updates: Partial<T>, defaultValue: T, options?: CookieOptions): void
```

**Parameters:**

- `name` - Cookie name
- `updates` - Partial object with properties to update
- `defaultValue` - Default value if cookie doesn't exist
- `options` - Optional cookie configuration

**Example:**

```typescript
const defaultPrefs = {
  theme: 'light',
  language: 'en',
  notifications: false
};

// Only update the theme, keeping other properties unchanged
cookieService.updateJson('userPrefs', { theme: 'dark' }, defaultPrefs);
```

---

## Array Methods

### `setArray()`

Stores an array as a JSON cookie.

**Method Signature:**

```typescript
setArray<T>(name: string, value: T[], options?: CookieOptions): void
```

**Parameters:**

- `name` - Cookie name
- `value` - Array of type `T[]`
- `options` - Optional cookie configuration

**Example:**

```typescript
const recentItems = ['item1', 'item2', 'item3'];
cookieService.setArray('recentItems', recentItems, { expires: 7 });
```

---

### `getArray()`

Retrieves an array cookie (read-only, doesn't set defaults).

**Method Signature:**

```typescript
getArray<T>(name: string): T[] | null
```

**Parameters:**

- `name` - Cookie name

**Returns:** Array of type `T[]`, or `null` if not found or invalid

**Example:**

```typescript
const items = cookieService.getArray<string>('recentItems');
if (items) {
  console.log('Recent items:', items);
}
```

---

### `getArrayWithDefault()`

Retrieves an array cookie, automatically setting the default if missing or invalid.

**Method Signature:**

```typescript
getArrayWithDefault<T>(name: string, defaultValue: T[], options?: CookieOptions): T[]
```

**Parameters:**

- `name` - Cookie name
- `defaultValue` - Default array to return and set if cookie is missing/invalid
- `options` - Optional cookie configuration for setting the default

**Returns:** Array of type `T[]`, or default array

**Example:**

```typescript
const items = cookieService.getArrayWithDefault('recentItems', ['default-item'], {
  expires: 7
});
```

---

## Boolean Methods

### `getBoolean()`

Parses a cookie as a boolean value (read-only, returns `false` if missing).

Recognizes: `true`, `false`, `1`, `0`, `yes`, `no`, `on`, `off` (case-insensitive)

**Method Signature:**

```typescript
getBoolean(name: string): boolean
```

**Parameters:**

- `name` - Cookie name

**Returns:** Boolean value, or `false` if not found

**Example:**

```typescript
const accepted = cookieService.getBoolean('cookiesAccepted');
if (accepted) {
  console.log('User accepted cookies');
}
```

---

### `getBooleanWithDefault()`

Parses a boolean cookie, automatically setting the default if missing or invalid.

**Method Signature:**

```typescript
getBooleanWithDefault(name: string, defaultValue: boolean, options?: CookieOptions): boolean
```

**Parameters:**

- `name` - Cookie name
- `defaultValue` - Default boolean to return and set if cookie is missing/invalid
- `options` - Optional cookie configuration for setting the default

**Returns:** Boolean value, or default value

**Example:**

```typescript
// Sets to true if cookie doesn't exist
const accepted = cookieService.getBooleanWithDefault('cookiesAccepted', true, {
  expires: 365
});
```

---

## Number Methods

### `getNumber()`

Parses a cookie as a number (read-only, returns `NaN` if missing or invalid).

**Method Signature:**

```typescript
getNumber(name: string): number
```

**Parameters:**

- `name` - Cookie name

**Returns:** Numeric value, or `NaN` if not found or invalid

**Example:**

```typescript
const count = cookieService.getNumber('viewCount');
if (!isNaN(count)) {
  console.log('View count:', count);
}
```

---

### `getNumberWithDefault()`

Parses a number cookie, automatically setting the default if missing or invalid.

**Method Signature:**

```typescript
getNumberWithDefault(name: string, defaultValue: number, options?: CookieOptions): number
```

**Parameters:**

- `name` - Cookie name
- `defaultValue` - Default number to return and set if cookie is missing/invalid
- `options` - Optional cookie configuration for setting the default

**Returns:** Numeric value, or default value

**Example:**

```typescript
// Initialize counter to 0 if it doesn't exist
const count = cookieService.getNumberWithDefault('viewCount', 0);

// Increment and save
cookieService.set('viewCount', (count + 1).toString());
```

---

## Enum Methods

### `getEnum()`

Retrieves a validated enum value (read-only, returns `null` if missing or invalid).

**Method Signature:**

```typescript
getEnum<T>(name: string, enumValues: readonly T[]): T | null
```

**Parameters:**

- `name` - Cookie name
- `enumValues` - Array of allowed values

**Returns:** Valid enum value of type `T`, or `null` if not found or invalid

**Example:**

```typescript
type Theme = 'light' | 'dark' | 'auto';
const themes: readonly Theme[] = ['light', 'dark', 'auto'];

const theme = cookieService.getEnum('theme', themes);
if (theme) {
  console.log('Theme:', theme);
}
```

---

### `getEnumWithDefault()`

Retrieves a validated enum cookie, automatically setting the default if missing or invalid.

**Method Signature:**

```typescript
getEnumWithDefault<T>(name: string, defaultValue: T, enumValues: readonly T[], options?: CookieOptions): T
```

**Parameters:**

- `name` - Cookie name
- `defaultValue` - Default enum value to return and set if cookie is missing/invalid
- `enumValues` - Array of allowed values
- `options` - Optional cookie configuration for setting the default

**Returns:** Valid enum value of type `T`, or default value

**Example:**

```typescript
type Theme = 'light' | 'dark' | 'auto';
const themes: readonly Theme[] = ['light', 'dark', 'auto'];

// Sets to 'light' if cookie doesn't exist or has invalid value
const theme = cookieService.getEnumWithDefault('theme', 'light', themes, {
  expires: 365
});
```

---

## Advanced Methods

### `setIfNotExists()`

Sets a cookie only if it doesn't already exist.

**Method Signature:**

```typescript
setIfNotExists(name: string, value: string, options?: CookieOptions): void
```

**Parameters:**

- `name` - Cookie name
- `value` - Cookie value
- `options` - Optional cookie configuration

**Example:**

```typescript
// Set first visit timestamp only once
cookieService.setIfNotExists('firstVisit', new Date().toISOString(), {
  expires: 365
});
```

---

### `getWithDefault()`

Retrieves a cookie with validation and automatic default setting.

**Method Signature:**

```typescript
getWithDefault(name: string, defaultValue: string, allowedValues?: readonly string[], options?: CookieOptions): string
```

**Parameters:**

- `name` - Cookie name
- `defaultValue` - Default value to return and set if cookie is missing/invalid
- `allowedValues` - Optional array of allowed values for validation
- `options` - Optional cookie configuration for setting the default

**Returns:** Cookie value or default value

**Example:**

```typescript
// With validation
const allowedValues = ['option1', 'option2', 'option3'];
const setting = cookieService.getWithDefault(
  'userSetting',
  'option1',
  allowedValues
);

// Without validation
const sessionId = cookieService.getWithDefault(
  'sessionId',
  generateId(),
  undefined,
  { expires: 1 }
);
```

---

### `getAll()`

Retrieves all accessible cookies as a key-value object.

**Method Signature:**

```typescript
getAll(): Record<string, string>
```

**Returns:** Object with cookie names as keys and values as strings

**Example:**

```typescript
const allCookies = cookieService.getAll();
console.log('All cookies:', allCookies);
// { username: 'john', theme: 'dark', sessionId: 'abc123' }
```

---

### `keys()`

Gets an array of all cookie names.

**Method Signature:**

```typescript
keys(): string[]
```

**Returns:** Array of cookie names

**Example:**

```typescript
const cookieNames = cookieService.keys();
console.log('Cookie names:', cookieNames);
// ['username', 'theme', 'sessionId']
```

---

### `values()`

Gets an array of all cookie values.

**Method Signature:**

```typescript
values(): string[]
```

**Returns:** Array of cookie values

**Example:**

```typescript
const cookieValues = cookieService.values();
console.log('Cookie values:', cookieValues);
// ['john', 'dark', 'abc123']
```

---

### `entries()`

Gets an array of all cookie entries as key-value tuples.

**Method Signature:**

```typescript
entries(): [string, string][]
```

**Returns:** Array of `[name, value]` tuples

**Example:**

```typescript
const cookieEntries = cookieService.entries();
console.log('Cookie entries:', cookieEntries);
// [['username', 'john'], ['theme', 'dark'], ['sessionId', 'abc123']]

// Iterate over entries
for (const [name, value] of cookieService.entries()) {
  console.log(`${name}: ${value}`);
}
```

---

### `deleteMany()`

Deletes multiple cookies at once.

**Method Signature:**

```typescript
deleteMany(names: string[], options?: CookieOptions): void
```

**Parameters:**

- `names` - Array of cookie names to delete
- `options` - Optional cookie configuration applied to all deletions

**Example:**

```typescript
// Clear user-related cookies on logout
cookieService.deleteMany(['username', 'sessionId', 'authToken', 'preferences']);

// With specific path
cookieService.deleteMany(['cookie1', 'cookie2'], { path: '/' });
```
