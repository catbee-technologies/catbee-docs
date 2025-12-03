---
id: api-reference
title: API Reference
sidebar_position: 4
---

## CatbeeIndexedDBService

The main service for managing IndexedDB operations with type safety and RxJS observables.

:::tip Service Aliases

```typescript
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
```

You can also import the service using the shorter alias:

```typescript
import { IndexedDBService } from '@ng-catbee/indexed-db';
```

Both `CatbeeIndexedDBService` and `IndexedDBService` refer to the same service.
:::

## API Summary

- ### Observables
  - [**`events: Observable<DatabaseEvent>`**](#events) - Stream of database change events
  - [**`dbState: Observable<DatabaseState>`**](#dbstate) - Database connection state

- ### Methods
  - [**`add<T>(store: string, value: T, key?: IDBValidKey): Observable<T & WithID>`**](#add) - Adds a new entry to the specified object store.
  - [**`bulkAdd<T>(store: string, values: T[]): Observable<number[]>`**](#bulkadd) - Adds multiple entries to the object store at once.
  - [**`getByKey<T>(store: string, key: IDBValidKey): Observable<T>`**](#getbykey) - Retrieves an entry by its key.
  - [**`getByID<T>(store: string, id: number): Observable<T>`**](#getbyid) - Retrieves an entry by its ID (convenience method for numeric keys).
  - [**`getAll<T>(store: string): Observable<T[]>`**](#getall) - Retrieves all entries from the object store.
  - [**`bulkGet<T>(store: string, keys: IDBValidKey[]): Observable<T[]>`**](#bulkget) - Retrieves multiple entries by their keys.
  - [**`update<T>(store: string, value: T): Observable<T>`**](#update) - Updates an existing entry (or adds if it doesn't exist).
  - [**`bulkPut<T>(store: string, items: T[]): Observable<IDBValidKey>`**](#bulkput) - Updates multiple entries at once.
  - [**`deleteByKey(store: string, key: IDBValidKey): Observable<void>`**](#deletebykey) - Deletes an entry by its key.
  - [**`bulkDelete(store: string, keys: IDBValidKey[]): Observable<number[]>`**](#bulkdelete) - Deletes multiple entries by their keys.
  - [**`delete<T>(store: string, query: (item: T) => boolean): Observable<T[]>`**](#delete) - Deletes entries matching a query function and returns remaining entries.
  - [**`clear(store: string): Observable<void>`**](#clear) - Removes all entries from the object store.
  - [**`count(store: string, query?: (item: T) => boolean): Observable<number>`**](#count) - Counts entries in the object store, optionally filtered by query.
  - [**`getByIndex<T>(store: string, indexName: string, key: IndexKey): Observable<T>`**](#getbyindex) - Retrieves a single entry by index value.
  - [**`getAllByIndex<T>(store: string, indexName: string, query?: IDBKeyRange, direction?: IDBCursorDirection): Observable<T[]>`**](#getallbyindex) - Retrieves all entries matching an index value.
  - [**`countByIndex(store: string, indexName: string, query?: IDBKeyRange): Observable<number>`**](#countbyindex) - Counts entries matching an index value.
  - [**`deleteAllByIndex(store: string, indexName: string, query?: IDBKeyRange, direction?: IDBCursorDirection): Observable<void>`**](#deleteallbyindex) - Deletes all entries matching an index value.
  - [**`getAllKeysByIndex(store: string, indexName: string, query?: IDBKeyRange, direction?: IDBCursorDirection): Observable<IndexKey[]>`**](#getallkeysbyindex) - Retrieves all keys for entries matching an index value.
  - [**`openCursor<T>(options: CursorOptions): Observable<IDBCursorWithValue>`**](#opencursor) - Opens a cursor for iterating over entries.
  - [**`openCursorByIndex<T>(options: CursorByIndexOptions): Observable<IDBCursorWithValue>`**](#opencursorbyindex) - Opens a cursor for iterating over entries by index.
  - [**`initialize(config?: CatbeeIndexedDBConfig): Observable<void>`**](#initialize) - Manually initializes the database (usually not needed as it initializes lazily).
  - [**`getDatabaseVersion(): Observable<number | string>`**](#getdatabaseversion) - Gets the current database version.
  - [**`deleteDatabase(): Observable<void>`**](#deletedatabase) - Deletes the entire database.
  - [**`getAllObjectStoreNames(): Observable<string[]>`**](#getallobjectstorenames) - Gets all object store names in the database.
  - [**`createObjectStore(schema: ObjectStoreMeta, migrations?: Record<number, MigrationFunction>): Promise<void>`**](#createobjectstore) - Creates a new object store (increases database version).
  - [**`createDynamicObjectStore(schema: ObjectStoreMeta, migrations?: Record<number, MigrationFunction>): Promise<void>`**](#createdynamicobjectstore) - Creates a new object store dynamically at runtime.
  - [**`deleteObjectStore(storeName: string): Observable<void>`**](#deleteobjectstore) - Deletes an object store from the database.
  - [**`close(): void`**](#close) - Closes the database connection.
  - [**`transaction<T>(store: string, mode: DBMode, operations: (store: IDBObjectStore) => void): Observable<T>`**](#transaction) - Executes atomic transaction with multiple operations.
  - [**`query<T>(store: string): QueryBuilder<T>`**](#query) - Creates a query builder for complex queries.
  - [**`batch<T>(store: string, operations: BatchOperation[]): Observable<void>`**](#batch) - Performs multiple operations in a single transaction.
  - [**`export<T>(store: string): Observable<T[]>`**](#export) - Exports all data from the specified object store.
  - [**`import<T>(store: string, data: T[]): Observable<void>`**](#import) - Imports data into the specified object store.
  - [**`cached<T>(store: string, key: IDBValidKey, fetcher: () => Observable<T>): Observable<T>`**](#cached) - Retrieves data with caching mechanism.
  - [**`invalidateCache(store?: string): void`**](#invalidatecache) - Invalidates cached data for a specific store or all stores.

---

## Types and Enums

### `DBMode`

Transaction mode enum:

```typescript
enum DBMode {
  ReadOnly = 'readonly',
  ReadWrite = 'readwrite'
}
```

### `QueryOperator`

Query comparison operators:

```typescript
type QueryOperator = '=' | '!=' | '>' | '>=' | '<' | '<=';
```

### `DatabaseEvent`

Database change event:

```typescript
export interface DatabaseEvent {
  /** Action type executed */
  type: 'add' | 'update' | 'delete' | 'clear' | 'batch' | 'import' | 'bulkAdd' | 'bulkUpdate' | 'bulkDelete';
  /** Object store impacted */
  storeName: string;
  /** Additional payload for event consumers */
  data?: any;
}
```

### `BatchOperation`

Batch operation definition:

```typescript
interface BatchOperation {
  type: 'add' | 'update' | 'delete';
  value?: any;
  key?: IDBValidKey;
}
```

---

## Observables

### `events`

Stream of all database change events.

**Value Type:** `Observable<DatabaseEvent>`

**Example:**

```typescript
db.events.subscribe(event => {
  console.log(`${event.type} in ${event.storeName}:`, event.data);
});
```

---

### `dbState`

Database connection state observable.

**Value Type:** `Observable<DatabaseState>`

**Example:**

```typescript
db.dbState.subscribe(state => {
  console.log('Database state:', state);
  // 'opening', 'open', 'closing', 'closed', 'error'
});
```

---

## Basic Operations

### `add()`

Adds a new entry to the specified object store.

**Method Signature:**

```typescript
add<T>(store: string, value: T, key?: IDBValidKey): Observable<T & WithID>
```

**Parameters:**

- `store` - Object store name
- `value` - Data to add
- `key` - Optional key (if not using auto-increment)

**Returns:** Observable with the added item including its ID

**Example:**

```typescript
interface User {
  id?: number;
  name: string;
  email: string;
}

const newUser: User = {
  name: 'John Doe',
  email: 'john@example.com'
};

db.add('users', newUser).subscribe(user => {
  console.log('User added with ID:', user.id);
});
```

---

### `bulkAdd()`

Adds multiple entries to the object store at once.

**Method Signature:**

```typescript
bulkAdd<T>(store: string, values: T[]): Observable<number[]>
```

**Parameters:**

- `store` - Object store name
- `values` - Array of data to add

**Returns:** Observable with array of generated keys

**Example:**

```typescript
const users = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' }
];

db.bulkAdd('users', users).subscribe(keys => {
  console.log('Added users with IDs:', keys);
});
```

---

### `getByKey()`

Retrieves an entry by its key.

**Method Signature:**

```typescript
getByKey<T>(store: string, key: IDBValidKey): Observable<T>
```

**Parameters:**

- `store` - Object store name
- `key` - Key to search for

**Returns:** Observable with the found item or `undefined`

**Example:**

```typescript
db.getByKey<User>('users', 123).subscribe(user => {
  if (user) {
    console.log('Found user:', user);
  }
});
```

---

### `getByID()`

Retrieves an entry by its ID (convenience method for numeric keys).

**Method Signature:**

```typescript
getByID<T>(store: string, id: number): Observable<T>
```

**Parameters:**

- `store` - Object store name
- `id` - Numeric ID

**Returns:** Observable with the found item

**Example:**

```typescript
db.getByID<User>('users', 123).subscribe(user => {
  console.log('User:', user);
});
```

---

### `getAll()`

Retrieves all entries from the object store.

**Method Signature:**

```typescript
getAll<T>(store: string): Observable<T[]>
```

**Parameters:**

- `store` - Object store name

**Returns:** Observable with array of all items

**Example:**

```typescript
db.getAll<User>('users').subscribe(users => {
  console.log('All users:', users);
});
```

---

### `bulkGet()`

Retrieves multiple entries by their keys.

**Method Signature:**

```typescript
bulkGet<T>(store: string, keys: IDBValidKey[]): Observable<T[]>
```

**Parameters:**

- `store` - Object store name
- `keys` - Array of keys to retrieve

**Returns:** Observable with array of found items

**Example:**

```typescript
db.bulkGet<User>('users', [1, 2, 3]).subscribe(users => {
  console.log('Fetched users:', users);
});
```

---

### `update()`

Updates an existing entry (or adds if it doesn't exist).

**Method Signature:**

```typescript
update<T>(store: string, value: T): Observable<T>
```

**Parameters:**

- `store` - Object store name
- `value` - Data to update (must include key)

**Returns:** Observable with the updated item

**Example:**

```typescript
const updatedUser: User = {
  id: 123,
  name: 'John Updated',
  email: 'john.new@example.com'
};

db.update('users', updatedUser).subscribe(user => {
  console.log('Updated user:', user);
});
```

---

### `bulkPut()`

Updates multiple entries at once.

**Method Signature:**

```typescript
bulkPut<T>(store: string, items: T[]): Observable<IDBValidKey>
```

**Parameters:**

- `store` - Object store name
- `items` - Array of data to update

**Returns:** Observable with the last key

**Example:**

```typescript
const users = [
  { id: 1, name: 'Alice Updated', email: 'alice@example.com' },
  { id: 2, name: 'Bob Updated', email: 'bob@example.com' }
];

db.bulkPut('users', users).subscribe(lastKey => {
  console.log('Updated users, last key:', lastKey);
});
```

---

### `deleteByKey()`

Deletes an entry by its key.

**Method Signature:**

```typescript
deleteByKey(store: string, key: IDBValidKey): Observable<void>
```

**Parameters:**

- `store` - Object store name
- `key` - Key of entry to delete

**Returns:** Observable that completes when deleted

**Example:**

```typescript
db.deleteByKey('users', 123).subscribe(() => {
  console.log('User deleted');
});
```

---

### `bulkDelete()`

Deletes multiple entries by their keys.

**Method Signature:**

```typescript
bulkDelete(store: string, keys: IDBValidKey[]): Observable<number[]>
```

**Parameters:**

- `store` - Object store name
- `keys` - Array of keys to delete

**Returns:** Observable with remaining item count

**Example:**

```typescript
db.bulkDelete('users', [1, 2, 3]).subscribe(remaining => {
  console.log('Remaining items:', remaining);
});
```

---

### `delete()`

Deletes entries matching a query function and returns remaining entries.

**Method Signature:**

```typescript
delete<T>(store: string, query: (item: T) => boolean): Observable<T[]>
```

**Parameters:**

- `store` - Object store name
- `query` - Function to test each item

**Returns:** Observable with array of remaining items

**Example:**

```typescript
db.delete<User>('users', user => user.role === 'guest').subscribe(remaining => {
  console.log('Deleted guest users, remaining:', remaining);
});
```

---

### `clear()`

Removes all entries from the object store.

**Method Signature:**

```typescript
clear(store: string): Observable<void>
```

**Parameters:**

- `store` - Object store name

**Returns:** Observable that completes when cleared

**Example:**

```typescript
db.clear('users').subscribe(() => {
  console.log('All users cleared');
});
```

---

### `count()`

Counts entries in the object store, optionally filtered by query.

**Method Signature:**

```typescript
count(store: string, query?: (item: T) => boolean): Observable<number>
```

**Parameters:**

- `store` - Object store name
- `query` - Optional filter function

**Returns:** Observable with count

**Example:**

```typescript
// Count all users
db.count('users').subscribe(count => {
  console.log('Total users:', count);
});

// Count admin users
db.count<User>('users', user => user.role === 'admin').subscribe(count => {
  console.log('Admin users:', count);
});
```

---

## Index Operations

### `getByIndex()`

Retrieves a single entry by index value.

**Method Signature:**

```typescript
getByIndex<T>(store: string, indexName: string, key: IndexKey): Observable<T>
```

**Parameters:**

- `store` - Object store name
- `indexName` - Index name
- `key` - Value to search for in the index

**Returns:** Observable with the found item

**Example:**

```typescript
// Find user by email (unique index)
db.getByIndex<User>('users', 'email', 'john@example.com').subscribe(user => {
  console.log('Found user:', user);
});
```

---

### `getAllByIndex()`

Retrieves all entries matching an index value.

**Method Signature:**

```typescript
getAllByIndex<T>(store: string, indexName: string, query?: IDBKeyRange, direction?: IDBCursorDirection): Observable<T[]>
```

**Parameters:**

- `store` - Object store name
- `indexName` - Index name
- `query` - Optional key range or specific value
- `direction` - Optional cursor direction (`'next'`, `'prev'`, `'nextunique'`, `'prevunique'`)

**Returns:** Observable with array of matching items

**Example:**

```typescript
// Get all users with role 'admin'
db.getAllByIndex<User>('users', 'role', 'admin').subscribe(admins => {
  console.log('Admin users:', admins);
});

// Get products in price range
const priceRange = IDBKeyRange.bound(10, 50);
db.getAllByIndex<Product>('products', 'price', priceRange).subscribe(products => {
  console.log('Products $10-$50:', products);
});
```

---

### `countByIndex()`

Counts entries matching an index value.

**Method Signature:**

```typescript
countByIndex(store: string, indexName: string, query?: IDBKeyRange): Observable<number>
```

**Parameters:**

- `store` - Object store name
- `indexName` - Index name
- `query` - Optional key range

**Returns:** Observable with count

**Example:**

```typescript
db.countByIndex('users', 'role', 'admin').subscribe(count => {
  console.log('Admin count:', count);
});
```

---

### `deleteAllByIndex()`

Deletes all entries matching an index value.

**Method Signature:**

```typescript
deleteAllByIndex(store: string, indexName: string, query?: IDBKeyRange, direction?: IDBCursorDirection): Observable<void>
```

**Parameters:**

- `store` - Object store name
- `indexName` - Index name
- `query` - Optional key range
- `direction` - Optional cursor direction

**Returns:** Observable that completes when deleted

**Example:**

```typescript
db.deleteAllByIndex('users', 'role', 'guest').subscribe(() => {
  console.log('Deleted all guest users');
});
```

---

### `getAllKeysByIndex()`

Retrieves all keys for entries matching an index value.

**Method Signature:**

```typescript
getAllKeysByIndex<P extends IDBValidKey = IDBValidKey, K extends IDBValidKey = IDBValidKey>(
  storeName: string,
  indexName: string,
  query?: IDBValidKey | IDBKeyRange | null,
  direction?: IDBCursorDirection
): Observable<IndexKey<P, K>[]>
```

**Parameters:**

- `store` - Object store name
- `indexName` - Index name
- `query` - Optional key range
- `direction` - Optional cursor direction

**Returns:** Observable with array of keys

**Example:**

```typescript
db.getAllKeysByIndex('users', 'role', 'admin').subscribe(keys => {
  console.log('Admin user IDs:', keys);
});
```

---

## Cursor Operations

### `openCursor()`

Opens a cursor for iterating over entries.

**Method Signature:**

```typescript
openCursor<T>(options: CursorOptions): Observable<IDBCursorWithValue>
```

**Parameters:**

- `options.storeName` - Object store name
- `options.mode` - Transaction mode (`DBMode.ReadOnly` or `DBMode.ReadWrite`)
- `options.query` - Optional key range
- `options.direction` - Optional cursor direction

**Returns:** Observable emitting cursor for each entry

**Example:**

```typescript
import { DBMode } from '@ng-catbee/indexed-db';

db.openCursor({
  storeName: 'users',
  mode: DBMode.ReadOnly
}).subscribe({
  next: (cursor) => {
    console.log('User:', cursor.value);
    cursor.continue();
  },
  complete: () => console.log('Iteration complete')
});
```

---

### `openCursorByIndex()`

Opens a cursor for iterating over entries by index.

**Method Signature:**

```typescript
openCursorByIndex<T>(options: CursorByIndexOptions): Observable<IDBCursorWithValue>
```

**Parameters:**

- `options.storeName` - Object store name
- `options.indexName` - Index name
- `options.mode` - Transaction mode
- `options.query` - Optional key range
- `options.direction` - Optional cursor direction

**Returns:** Observable emitting cursor for each matching entry

**Example:**

```typescript
db.openCursorByIndex({
  storeName: 'users',
  indexName: 'role',
  mode: DBMode.ReadOnly,
  query: 'admin'
}).subscribe({
  next: (cursor) => {
    console.log('Admin user:', cursor.value);
    cursor.continue();
  }
});
```

---

## Database Management

### `initialize()`

Manually initializes the database (usually not needed as it initializes lazily).

**Method Signature:**

```typescript
initialize(config?: CatbeeIndexedDBConfig): Observable<void>
```

**Parameters:**

- `config` - Optional configuration (uses provided config if not specified)

**Returns:** Observable that completes when initialized

**Example:**

```typescript
db.initialize().subscribe(() => {
  console.log('Database initialized');
});
```

---

### `getDatabaseVersion()`

Gets the current database version.

**Method Signature:**

```typescript
getDatabaseVersion(): Observable<number | string>
```

**Returns:** Observable with version number

**Example:**

```typescript
db.getDatabaseVersion().subscribe(version => {
  console.log('Database version:', version);
});
```

---

### `deleteDatabase()`

Deletes the entire database.

**Method Signature:**

```typescript
deleteDatabase(): Observable<void>
```

**Returns:** Observable that completes when deleted

**Example:**

```typescript
db.deleteDatabase().subscribe(() => {
  console.log('Database deleted');
});
```

---

### `getAllObjectStoreNames()`

Gets all object store names in the database.

**Method Signature:**

```typescript
getAllObjectStoreNames(): Observable<string[]>
```

**Returns:** Observable with array of store names

**Example:**

```typescript
db.getAllObjectStoreNames().subscribe(names => {
  console.log('Available stores:', names);
});
```

---

### `createObjectStore()`

Creates a new object store (increases database version).

**Method Signature:**

```typescript
createObjectStore(schema: ObjectStoreMeta, migrations?: Record<number, MigrationFunction>): Promise<void>
```

**Parameters:**

- `schema` - Object store configuration
- `migrations` - Optional migration functions

**Returns:** Promise that resolves when created

**Example:**

```typescript
await db.createObjectStore({
  store: 'settings',
  storeConfig: { keyPath: 'key' },
  storeSchema: [
    { name: 'category', keypath: 'category', options: { unique: false } }
  ]
});
```

---

### `createDynamicObjectStore()`

Creates a new object store dynamically at runtime.

**Method Signature:**

```typescript
createDynamicObjectStore(schema: ObjectStoreMeta, migrations?: Record<number, MigrationFunction>): Promise<void>
```

**Parameters:**

- `schema` - Object store configuration
- `migrations` - Optional migration functions

**Returns:** Promise that resolves when created

**Example:**

```typescript
await db.createDynamicObjectStore({
  store: 'cache',
  storeConfig: { keyPath: 'id', autoIncrement: true },
  storeSchema: []
});
```

---

### `deleteObjectStore()`

Deletes an object store from the database.

**Method Signature:**

```typescript
deleteObjectStore(storeName: string): Observable<void>
```

**Parameters:**

- `storeName` - Store name to delete

**Returns:** Observable that completes when deleted

**Example:**

```typescript
db.deleteObjectStore('oldStore').subscribe(() => {
  console.log('Store deleted');
});
```

---

### `close()`

Closes the database connection.

**Method Signature:**

```typescript
close(): void
```

**Example:**

```typescript
db.close();
```

---

## Advanced Operations

### `transaction()`

Executes atomic transaction with multiple operations.

**Method Signature:**

```typescript
transaction<T>(store: string, mode: DBMode, operations: (store: IDBObjectStore) => void): Observable<T>
```

**Parameters:**

- `store` - Object store name
- `mode` - Transaction mode (`DBMode.ReadOnly` or `DBMode.ReadWrite`)
- `operations` - Function to perform operations

**Returns:** Observable that completes when transaction succeeds

**Example:**

```typescript
import { DBMode } from '@ng-catbee/indexed-db';

db.transaction('users', DBMode.ReadWrite, (store) => {
  const getRequest = store.get(1);
  getRequest.onsuccess = () => {
    const user = getRequest.result;
    user.credits += 100;
    store.put(user);
  };
}).subscribe({
  next: () => console.log('Transaction completed'),
  error: (err) => console.error('Transaction failed, rolled back')
});
```

---

### `query()`

Creates a query builder for complex queries.

**Method Signature:**

```typescript
query<T>(store: string): QueryBuilder<T>
```

**Parameters:**

- `store` - Object store name

**Returns:** QueryBuilder instance

**Example:**

```typescript
db.query<User>('users')
  .where('role', '=', 'admin')
  .orderBy('name', 'asc')
  .limit(10)
  .execute()
  .subscribe(users => {
    console.log('Admin users:', users);
  });
```

See [Advanced Queries](./usage/advanced-queries) for more details.

---

### `batch()`

Performs multiple operations in a single transaction.

**Method Signature:**

```typescript
batch<T>(store: string, operations: BatchOperation[]): Observable<void>
```

**Parameters:**

- `store` - Object store name
- `operations` - Array of operations (`{ type: 'add'|'update'|'delete', value?, key? }`)

**Returns:** Observable that completes when batch succeeds

**Example:**

```typescript
db.batch('users', [
  { type: 'add', value: { name: 'New User', email: 'new@example.com' } },
  { type: 'update', value: { id: 1, name: 'Updated' } },
  { type: 'delete', key: 5 }
]).subscribe(() => {
  console.log('Batch completed');
});
```

---

### `export()`

Exports all data from an object store.

**Method Signature:**

```typescript
export<T>(store: string): Observable<T[]>
```

**Parameters:**

- `store` - Object store name

**Returns:** Observable with all data

**Example:**

```typescript
db.export<User>('users').subscribe(data => {
  const json = JSON.stringify(data, null, 2);
  // Save to file or send to server
});
```

---

### `import()`

Imports data into an object store.

**Method Signature:**

```typescript
import<T>(store: string, data: T[]): Observable<void>
```

**Parameters:**

- `store` - Object store name
- `data` - Array of data to import

**Returns:** Observable that completes when imported

**Example:**

```typescript
const importedData = [/* ... */];
db.import('users', importedData).subscribe(() => {
  console.log('Data imported');
});
```

---

### `cached()`

Gets cached data or fetches and caches it.

**Method Signature:**

```typescript
cached<T>(store: string, key: IDBValidKey, fetcher: () => Observable<T>): Observable<T>
```

**Parameters:**

- `store` - Object store name
- `key` - Cache key
- `fetcher` - Function to fetch data if not cached

**Returns:** Observable with cached or fresh data

**Example:**

```typescript
db.cached(
  'users',
  'user-123',
  () => db.getByID<User>('users', 123)
).subscribe(user => {
  console.log('User (possibly from cache):', user);
});
```

---

### `invalidateCache()`

Invalidates cache for a store or all stores.

**Method Signature:**

```typescript
invalidateCache(store?: string): void
```

**Parameters:**

- `store` - Optional store name (omit to invalidate all)

**Example:**

```typescript
db.invalidateCache('users');  // Invalidate users cache
db.invalidateCache();         // Invalidate all cache
```

---
