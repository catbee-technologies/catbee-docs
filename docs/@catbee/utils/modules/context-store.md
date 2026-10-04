---
slug: ../context-store
---

# Context Store

Per-request context using AsyncLocalStorage. Provides a type-safe API for storing and retrieving request-scoped data (such as request ID, logger, user, etc.) across async calls. Includes helpers for Express integration, context extension, and symbol-based keys. All methods are fully typed.

## API Summary

- [**`ContextStore`**](#express-middleware) – The main class for managing context.
  - [**`getInstance(): AsyncLocalStorage<Store>`**](#getinstance) – Returns the underlying AsyncLocalStorage instance.
  - [**`getAll(): Store | undefined`**](#getall) – Retrieves the entire context store object for the current async context.
  - [**`run<T>(store: Store, callback: () => T): T`**](#run) – Initializes a new async context and executes a callback within it.
  - [**`set<T>(key: ContextKey<T>, value: T): void`**](#set) – Sets a value in the current context store by key.
  - [**`get<T>(key: ContextKey<T>): T | undefined`**](#get) – Retrieves a value from the async context store by key.
  - [**`has(key: ContextKey): boolean`**](#has) – Checks if a key exists in the current context store.
  - [**`delete(key: ContextKey): boolean`**](#delete) – Removes a value from the current context store by key.
  - [**`patch(values: Partial<Store>): void`**](#patch) – Updates multiple values in the current context store at once.
  - [**`withValue<T, V>(key: ContextKey<V>, value: V, callback: () => T): T`**](#withvalue) – Executes a callback within a branched context with a temporary value.
  - [**`extend(newValues: Partial<Store>, callback: () => void): void`**](#extend) – Creates a new context that inherits values and adds/overrides new ones.
  - [**`createExpressMiddleware(initialValuesFactory?: () => Partial<Store>): express.RequestHandler`**](#createexpressmiddleware) – Creates Express middleware that initializes a context for each request.

Other exports:

- [**`TypedStoreKeys`**](#typedstorekeys) – Pre-instantiated, type-safe `TypedContextKey` objects for core and messaging keys.
- [**`StoreKeys`**](#storekeys) – Predefined symbols for context keys.
- [**`ContextKey<T>`**](#contextkey) – Type alias for `symbol | TypedContextKey<T>`.
- [**`TypedContextKey<T>`**](#typedcontextkey) – Type-safe wrapper class for accessing and modifying context values.
- [**`getRequestId(): string | undefined`**](#getrequestid) – Retrieves the current request ID from context.
- [**`getFromContext<T>(key: ContextKey<T>): T | undefined`**](#getfromcontext) – Type-safe getter for context values.

---

## Interface & Types

### `ContextKey`

Union type accepted by all `ContextStore` methods, allowing transparent use of raw symbols or `TypedContextKey<T>` instances:

```ts
export type ContextKey<T = unknown> = symbol | TypedContextKey<T>;
```

### `StoreKeys`

Predefined symbols used as keys in `AsyncLocalStorage`:

```ts
export const StoreKeys = {
  LOGGER: Symbol('LOGGER'),
  REQUEST_ID: Symbol('REQUEST_ID'),
  CORRELATION_ID: Symbol('CORRELATION_ID'),
  USER_ID: Symbol('USER_ID'),
  TRANSACTION_ID: Symbol('TRANSACTION_ID'),
  TENANT_ID: Symbol('TENANT_ID'),
  TRACE_ID: Symbol('TRACE_ID'),
  SPAN_ID: Symbol('SPAN_ID'),
  MESSAGE_ID: Symbol('MESSAGE_ID'),
  MESSAGE_TYPE: Symbol('MESSAGE_TYPE'),
  QUEUE_NAME: Symbol('QUEUE_NAME')
} as const;
```

### `TypedStoreKeys`

Pre-configured, strongly typed `TypedContextKey` instances providing autocomplete and automatic type resolution without manual casting:

```ts
export const TypedStoreKeys = {
  LOGGER: new TypedContextKey<Logger>(StoreKeys.LOGGER),
  REQUEST_ID: new TypedContextKey<string>(StoreKeys.REQUEST_ID),
  CORRELATION_ID: new TypedContextKey<string>(StoreKeys.CORRELATION_ID),
  USER_ID: new TypedContextKey<string>(StoreKeys.USER_ID),
  TRANSACTION_ID: new TypedContextKey<string>(StoreKeys.TRANSACTION_ID),
  TENANT_ID: new TypedContextKey<string>(StoreKeys.TENANT_ID),
  TRACE_ID: new TypedContextKey<string>(StoreKeys.TRACE_ID),
  SPAN_ID: new TypedContextKey<string>(StoreKeys.SPAN_ID),
  MESSAGE_ID: new TypedContextKey<string>(StoreKeys.MESSAGE_ID),
  MESSAGE_TYPE: new TypedContextKey<string>(StoreKeys.MESSAGE_TYPE),
  QUEUE_NAME: new TypedContextKey<string>(StoreKeys.QUEUE_NAME)
} as const;
```

### `Store`

```ts
export interface Store {
  [key: symbol]: unknown;
}
```

---

## Example Usage

### Express Middleware

```ts
import { ContextStore, StoreKeys, getLogger } from '@catbee/utils/context-store';
import express from 'express';
import crypto from 'crypto';

const app = express();

// Set up request context middleware
app.use((req, res, next) => {
  // Generate request ID from header or create a new one
  const requestId = req.headers['x-request-id']?.toString() || crypto.randomUUID();

  // Run request in context with request ID
  ContextStore.run({ [StoreKeys.REQUEST_ID]: requestId }, () => {
    // Create a logger with request ID and store it in context
    const logger = getLogger().child({ requestId });
    ContextStore.set(StoreKeys.LOGGER, logger);

    logger.info('Request started', {
      method: req.method,
      path: req.path
    });

    next();
  });
});

// Access context in route handlers
app.get('/api/items', (req, res) => {
  // Get request ID from anywhere in the request lifecycle
  const requestId = getRequestId();

  // Get logger from context
  const logger = ContextStore.get<ReturnType<typeof getLogger>>(StoreKeys.LOGGER);

  logger.info('Getting items', { count: 10 });

  res.json({ items: [], requestId });
});

// Or use the built-in middleware
app.use(
  ContextStore.createExpressMiddleware(() => ({
    [StoreKeys.REQUEST_ID]: crypto.randomUUID()
  }))
);
```

---

## Function Documentation & Usage Examples

### `getInstance()`

Returns the underlying AsyncLocalStorage instance for advanced access.

**Method Signature:**

```ts
getInstance(): AsyncLocalStorage<Store>
```

**Returns:**

- The AsyncLocalStorage instance.

**Examples:**

```ts
import { ContextStore } from '@catbee/utils/context-store';

const storage = ContextStore.getInstance();
const store = storage.getStore();
```

---

### `getAll()`

Retrieves the entire context store object for the current async context.

**Method Signature:**

```ts
getAll(): Store | undefined
```

**Returns:**

- The current context store object or `undefined` if no context is active.

**Examples:**

```ts
import { ContextStore } from '@catbee/utils/context-store';

const allValues = ContextStore.getAll();
```

---

### `run()`

Initializes a new async context and executes a callback within it.

**Method Signature:**

```ts
run(store: Store, callback: () => T): T
```

**Parameters:**

- `store`: An object containing initial key-value pairs for the context.
- `callback`: A function to execute within the new context.

**Returns:**

- The return value of the callback.

**Examples:**

```ts
import { ContextStore } from '@catbee/utils/context-store';

ContextStore.run({ [StoreKeys.REQUEST_ID]: 'id' }, () => {
  // Context is active here
  const requestId = ContextStore.get<string>(StoreKeys.REQUEST_ID);
  console.log(requestId); // "id"
});
```

---

### `set()`

Sets a value in the current context store by key. Accepts a `symbol` or a `TypedContextKey<T>`.

**Method Signature:**

```ts
set<T>(key: ContextKey<T>, value: T): void
```

**Parameters:**

- `key`: A `symbol` or `TypedContextKey<T>` identifying the value.
- `value`: The value to store.

**Throws:**

- `Error` if called outside an active context (not within a `.run()` call).

**Examples:**

```ts
import { ContextStore, StoreKeys, TypedStoreKeys } from '@catbee/utils/context-store';

// Using TypedStoreKeys
ContextStore.set(TypedStoreKeys.REQUEST_ID, 'req_12345');
ContextStore.set(TypedStoreKeys.USER_ID, 'usr_98765');
ContextStore.set(TypedStoreKeys.QUEUE_NAME, 'orders.processing');

// Using raw Symbol
ContextStore.set(StoreKeys.TRANSACTION_ID, 'tx_9999');
```

---

### `get()`

Retrieves a value from the async context store by key. Accepts a `symbol` or a `TypedContextKey<T>`.

**Method Signature:**

```ts
get<T>(key: ContextKey<T>): T | undefined
```

**Parameters:**

- `key`: A `symbol` or `TypedContextKey<T>` identifying the value.

**Returns:**

- The value associated with the key or `undefined` if not found.

**Examples:**

```ts
import { ContextStore, StoreKeys, TypedStoreKeys } from '@catbee/utils/context-store';

// Type is inferred automatically when using TypedStoreKeys: string | undefined
const userId = ContextStore.get(TypedStoreKeys.USER_ID);
const queueName = ContextStore.get(TypedStoreKeys.QUEUE_NAME);

// Using raw symbol with explicit type argument
const txId = ContextStore.get<string>(StoreKeys.TRANSACTION_ID);
```

---

### `has()`

Checks if a key exists in the current context store. Accepts a `symbol` or a `TypedContextKey`.

**Method Signature:**

```ts
has(key: ContextKey): boolean
```

**Parameters:**

- `key`: A `symbol` or `TypedContextKey` to check.

**Returns:**

- `true` if the key exists, otherwise `false`.

```ts
import { ContextStore, TypedStoreKeys } from '@catbee/utils/context-store';

if (ContextStore.has(TypedStoreKeys.USER_ID)) {
  // user ID exists in context
}
```

---

### `delete()`

Removes a value from the current context store by key. Accepts a `symbol` or a `TypedContextKey`.

**Method Signature:**

```ts
delete(key: ContextKey): boolean
```

**Parameters:**

- `key`: A `symbol` or `TypedContextKey` to remove.

**Returns:**

- `true` if the key was found and deleted, otherwise `false`.

**Throws:**

- `Error` if called outside an active context.

**Examples:**

```ts
import { ContextStore, TypedStoreKeys } from '@catbee/utils/context-store';

ContextStore.delete(TypedStoreKeys.USER_ID);
```

---

### `patch()`

Updates multiple values in the current context store at once.

**Method Signature:**

```ts
patch(values: Partial<Record<symbol, unknown>>): void
```

**Parameters:**

- `values`: An object containing key-value pairs to update in the context.

**Throws:**

- `Error` if called outside an active context.

**Examples:**

```ts
import { ContextStore, StoreKeys } from '@catbee/utils/context-store';

ContextStore.patch({
  [StoreKeys.USER_ID]: 'usr_123',
  [StoreKeys.TENANT_ID]: 'tenant_abc',
  [StoreKeys.MESSAGE_ID]: 'msg_456'
});
```

---

### `withValue()`

Executes a callback within a branched async context containing a temporary value. Built with full async boundary safety via `AsyncLocalStorage.run`—the parent context remains untouched and cannot be corrupted by nested async work.

**Method Signature:**

```ts
withValue<T, V>(key: ContextKey<V>, value: V, callback: () => T): T
```

**Parameters:**

- `key`: A `symbol` or `TypedContextKey<V>` identifying the value.
- `value`: The temporary value to set for the duration of the callback.
- `callback`: A function to execute within the branched context.

**Returns:**

- The return value of the callback.

**Throws:**

- `Error` if called outside an active context.

**Examples:**

```ts
import { ContextStore, TypedStoreKeys } from '@catbee/utils/context-store';

ContextStore.withValue(TypedStoreKeys.USER_ID, 'temporary-system-user', () => {
  // USER_ID is 'temporary-system-user' within this async branch
  console.log(TypedStoreKeys.USER_ID.get()); // 'temporary-system-user'
});

// Original USER_ID is unaffected outside the callback
```

---

### `extend()`

Creates a new context that inherits values from the current context and adds/overrides new ones.

**Method Signature:**

```ts
extend<T>(newValues: Partial<Record<symbol, unknown>>, callback: () => T): T
```

**Parameters:**

- `newValues`: An object containing key-value pairs to add or override in the new context.
- `callback`: A function to execute within the new context.

**Returns:**

- The return value of the callback.

**Examples:**

```ts
import { ContextStore } from "@catbee/utils";

ContextStore.extend({ [StoreKeys.TENANT_ID]: "tenant-42" }, () => {
  // context includes TENANT_ID here
});
```

---

### `createExpressMiddleware()`

Creates Express middleware that initializes a context for each request.

**Method Signature:**

```ts
createExpressMiddleware(initialValuesFactory?: (req: any) => Partial<Record<symbol, unknown>>): express.RequestHandler
```

**Parameters:**

- `initialValuesFactory`: An optional function that takes the request object and returns an object of initial key-value pairs for the context.

**Returns:**

- An Express middleware function.

```ts
import { ContextStore } from '@catbee/utils/context-store';
import crypto from 'crypto';

app.use(
  ContextStore.createExpressMiddleware(req => ({
    [StoreKeys.REQUEST_ID]: req.headers['x-request-id']?.toString() || crypto.randomUUID()
  }))
);
```

---

### `getRequestId()`

Retrieves the current request ID from the async context, if available.

**Method Signature:**

```ts
getRequestId(): string | undefined
```

**Returns:**

- The current request ID or `undefined` if not set.

**Examples:**

```ts
import { getRequestId } from '@catbee/utils/context-store';

const requestId = getRequestId();
```

---

### `getFromContext()`

Type-safe getter for context values. Accepts either a raw `symbol` or a `TypedContextKey<T>`.

**Method Signature:**

```ts
getFromContext<T>(key: ContextKey<T>): T | undefined
```

**Parameters:**

- `key`: The `ContextKey` (symbol or `TypedContextKey<T>`) to retrieve.

**Returns:**

- The typed value from the store or `undefined` if not found.

**Examples:**

```ts
import { getFromContext, StoreKeys, TypedStoreKeys } from '@catbee/utils/context-store';

// Automatically typed via TypedStoreKeys
const requestId = getFromContext(TypedStoreKeys.REQUEST_ID);
const queueName = getFromContext(TypedStoreKeys.QUEUE_NAME);

// Or with raw symbol and explicit type parameter
const correlationId = getFromContext<string>(StoreKeys.CORRELATION_ID);
```

---

### `TypedContextKey`

Type-safe wrapper class for accessing and modifying context values with specific types.

**Class Definition:**

```ts
class TypedContextKey<T> {
  constructor(symbol: symbol, defaultValue?: T);
  get(): T | undefined;
  set(value: T): void;
  exists(): boolean;
  delete(): boolean;
  getSymbol(): symbol;
}
```

**Constructor Parameters:**

- `symbol`: The unique symbol for this key.
- `defaultValue`: Optional default value returned by `get()` if key is not found in context.

**Methods:**

- **`get()`**: Gets the current value for this key, or the default value if not found.
- **`set(value: T)`**: Sets the value for this key in the current context.
- **`exists()`**: Checks if this key exists in the context.
- **`delete()`**: Deletes this key from the context.
- **`getSymbol()`**: Returns the underlying `symbol` for this key.

**Examples:**

```ts
import { TypedContextKey, TypedStoreKeys, StoreKeys } from '@catbee/utils/context-store';

interface UserProfile {
  id: string;
  roles: string[];
}

// 1. Create a custom typed key
const USER_PROFILE_KEY = Symbol('USER_PROFILE');
const UserProfileKey = new TypedContextKey<UserProfile>(USER_PROFILE_KEY);

// 2. Type-safe operations
UserProfileKey.set({ id: 'u_123', roles: ['admin'] });
const profile = UserProfileKey.get(); // Type: UserProfile | undefined

if (UserProfileKey.exists()) {
  console.log('User profile is in context');
}

// Retrieve underlying symbol
const rawSymbol = UserProfileKey.getSymbol();

// 3. Or use built-in pre-configured TypedStoreKeys directly
TypedStoreKeys.USER_ID.set('usr_9999');
const currentUserId = TypedStoreKeys.USER_ID.get();
```
