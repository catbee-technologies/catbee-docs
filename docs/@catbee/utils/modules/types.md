---
slug: ../types
---

# Types

TypeScript type utilities and interface definitions for building type-safe applications. Includes utility types for common patterns, API response structures, pagination interfaces, and more.

## API Summary

### Type Utilities

- [**`ToggleConfig<T>`**](#toggleconfigt) - Configurable toggle that can be boolean or custom config object.
- [**`Nullable<T>`**](#nullablet) - Value that can be null or undefined.
- [**`Optional<T>`**](#optionalt) - Value that may or may not be present.
- [**`DeepPartial<T>`**](#deeppartialt) - Makes all properties deeply optional.
- [**`DeepReadonly<T>`**](#deepreadonlyt) - Makes all properties readonly recursively.
- [**`UnionToIntersection<U>`**](#uniontointersectionu) - Converts union types to intersection.
- [**`MaybePromise<T>`**](#maybepromiset) - Value that can be synchronous or promise.
- [**`StringKeyedRecord<T>`**](#stringkeyedrecordt) - Record with string keys.
- [**`Func<A, R>`**](#funca-r) - Generic function type.
- [**`PartialPick<T, K>`**](#partialpickt-k) - Partial pick combination.
- [**`DeepStringifyOrNull<T>`**](#deepstringifyornullt) - Deeply stringifies properties or makes them null.
- [**`NonEmptyArray<T>`**](#nonemptyarrayt) - Array with at least one element.
- [**`ValueOf<T>`**](#valueoft) - Union of all property values.
- [**`Mutable<T>`**](#mutablet) - Removes readonly from all properties.
- [**`KeysOfType<T, U>`**](#keysoftypet-u) - Gets keys whose values match type U.
- [**`RequireAtLeastOne<T, K>`**](#requireatleastonet-k) - Requires at least one key to be present.
- [**`RecordOptional<K, T>`**](#recordoptionalk-t) - Record with optional keys.
- [**`Primitive`**](#primitive) - All primitive TypeScript types.
- [**`Awaited<T>`**](#awaitedt) - Unwraps Promise types.
- [**`PickByType<T, U>`**](#pickbytypet-u) - Picks properties of specific type.
- [**`DeepRequired<T>`**](#deeprequiredt) - Makes all properties required recursively.
- [**`IsEqual<T, U>`**](#isequalt-u) - Type-level equality check.
- [**`Writable<T>`**](#writablet) - Removes readonly modifier.
- [**`Optional2<T, K>`**](#optional2t-k) - Makes specific keys optional.
- [**`Without<T, U>`**](#withoutt-u) - Excludes properties of specific type.

### API Response Types

- [**`ApiResponse<T>`**](#apiresponset) - Generic API response wrapper.
- [**`ApiSuccessResponse<T>`**](#apisuccessresponset) - Strongly typed success response.
- [**`ApiErrorResponse`**](#apierrorresponse) - Error response with metadata.
- [**`Pagination<T>`**](#paginationt) - Generic pagination structure.
- [**`PaginationResponse<T>`**](#paginationresponset) - Alias for paginated response.
- [**`BatchResponse<T>`**](#batchresponset) - Batch operation response.
- [**`AsyncOperationResponse`**](#asyncoperationresponse) - Async operation response.
- [**`StreamResponse`**](#streamresponse) - Streaming operation response.
- [**`PaginationParams`**](#paginationparams) - Pagination parameters.
- [**`WithPagination<T>`**](#withpaginationt) - Combines pagination with additional data.
- [**`SortDirection`**](#sortdirection) - Sort direction enum.

---

## Type Utilities

### `ToggleConfig<T>`

A type representing a configurable toggle that can be `true`, `false`, or a custom configuration object.

**Type Definition:**

```ts
type ToggleConfig<T> = boolean | T;
```

**Examples:**

```ts
import { ToggleConfig } from '@catbee/utils/types';

interface CacheConfig {
  ttl: number;
  maxSize: number;
}

// Can be boolean
const simpleCache: ToggleConfig<CacheConfig> = true;

// Or custom config
const advancedCache: ToggleConfig<CacheConfig> = {
  ttl: 3600,
  maxSize: 1000
};
```

---

### `Nullable<T>`

A type representing a value that can be `null` or `undefined`.

**Type Definition:**

```ts
type Nullable<T> = T | null | undefined;
```

**Examples:**

```ts
import { Nullable } from '@catbee/utils/types';

const userId: Nullable<string> = getUserId(); // string | null | undefined

function processUser(id: Nullable<number>) {
  if (id != null) {
    // id is number here
  }
}
```

---

### `Optional<T>`

A type representing a value that may or may not be present.

**Type Definition:**

```ts
type Optional<T> = T | undefined;
```

**Examples:**

```ts
import { Optional } from '@catbee/utils/types';

const config: Optional<{ apiKey: string }> = loadConfig();

function setTitle(title: Optional<string>) {
  document.title = title ?? 'Default Title';
}
```

---

### `DeepPartial<T>`

Makes all properties of `T` deeply optional, recursively applying `Partial` to nested objects.

**Type Definition:**

```ts
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

**Examples:**

```ts
import { DeepPartial } from '@catbee/utils/types';

interface User {
  id: number;
  profile: {
    name: string;
    address: {
      street: string;
      city: string;
    };
  };
}

const partialUser: DeepPartial<User> = {
  profile: {
    address: {
      city: 'New York' // street is optional
    }
  }
};
```

---

### `DeepReadonly<T>`

Makes all properties of `T` readonly recursively.

**Type Definition:**

```ts
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

**Examples:**

```ts
import { DeepReadonly } from '@catbee/utils/types';

interface Config {
  database: {
    host: string;
    port: number;
  };
}

const config: DeepReadonly<Config> = {
  database: { host: 'localhost', port: 5432 }
};

// config.database.host = 'other'; // Error: Cannot assign to 'host' because it is a read-only property
```

---

### `UnionToIntersection<U>`

Converts a union of types into an intersection.

**Type Definition:**

```ts
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
```

**Examples:**

```ts
import { UnionToIntersection } from '@catbee/utils/types';

type A = { a: string };
type B = { b: number };
type C = A | B;

type Combined = UnionToIntersection<C>; // { a: string } & { b: number }

const obj: Combined = { a: 'test', b: 123 };
```

---

### `MaybePromise<T>`

A type representing a value that can be either synchronous or a promise.

**Type Definition:**

```ts
type MaybePromise<T> = T | Promise<T>;
```

**Examples:**

```ts
import { MaybePromise } from '@catbee/utils/types';

function processData(data: MaybePromise<string>) {
  if (data instanceof Promise) {
    return data.then(str => str.toUpperCase());
  }
  return data.toUpperCase();
}

// Works with both
processData('hello');
processData(Promise.resolve('hello'));
```

---

### `StringKeyedRecord<T>`

A type representing a record with string keys and values of type `T`.

**Type Definition:**

```ts
type StringKeyedRecord<T> = Record<string, T>;
```

**Examples:**

```ts
import { StringKeyedRecord } from '@catbee/utils/types';

const userAges: StringKeyedRecord<number> = {
  alice: 30,
  bob: 25,
  charlie: 35
};
```

---

### `Func<A, R>`

A generic function type that returns `R` and optionally receives arguments `A`.

**Type Definition:**

```ts
type Func<A extends any[] = any[], R = any> = (...args: A) => R;
```

**Examples:**

```ts
import { Func } from '@catbee/utils/types';

const add: Func<[number, number], number> = (a, b) => a + b;

const greet: Func<[string], string> = (name) => `Hello, ${name}`;

const noArgs: Func<[], void> = () => console.log('Called');
```

---

### `PartialPick<T, K>`

A type representing partial pick from `T` (combines `Partial` and `Pick`).

**Type Definition:**

```ts
type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
```

**Examples:**

```ts
import { PartialPick } from '@catbee/utils/types';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Make name and email optional, keep id and age required
type UserUpdate = PartialPick<User, 'name' | 'email'>;

const update: UserUpdate = {
  id: 1,
  age: 30
  // name and email are optional
};
```

---

### `DeepStringifyOrNull<T>`

Deeply stringifies all properties of `T` or makes them null.

**Type Definition:**

```ts
type DeepStringifyOrNull<T> = T extends string | number | bigint | boolean | symbol | null | undefined
  ? string | null
  : T extends Array<infer U>
    ? Array<DeepStringifyOrNull<U>>
    : T extends object
      ? { [K in keyof T]: DeepStringifyOrNull<T[K]> }
      : string | null;
```

**Examples:**

```ts
import { DeepStringifyOrNull } from '@catbee/utils/types';

interface Data {
  id: number;
  items: { name: string; count: number }[];
}

type StringifiedData = DeepStringifyOrNull<Data>;
// { id: string | null; items: { name: string | null; count: string | null }[] }
```

---

### `NonEmptyArray<T>`

A type representing an array with at least one element.

**Type Definition:**

```ts
type NonEmptyArray<T> = [T, ...T[]];
```

**Examples:**

```ts
import { NonEmptyArray } from '@catbee/utils/types';

function getFirst<T>(arr: NonEmptyArray<T>): T {
  return arr[0]; // Safe - array always has at least one element
}

const valid: NonEmptyArray<number> = [1, 2, 3];
// const invalid: NonEmptyArray<number> = []; // Error
```

---

### `ValueOf<T>`

A type representing the union of all property values of `T`.

**Type Definition:**

```ts
type ValueOf<T> = T[keyof T];
```

**Examples:**

```ts
import { ValueOf } from '@catbee/utils/types';

interface Status {
  pending: 'PENDING';
  active: 'ACTIVE';
  completed: 'COMPLETED';
}

type StatusValue = ValueOf<Status>; // 'PENDING' | 'ACTIVE' | 'COMPLETED'

const status: StatusValue = 'ACTIVE';
```

---

### `Mutable<T>`

Makes all properties of `T` mutable (removes readonly).

**Type Definition:**

```ts
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
```

**Examples:**

```ts
import { Mutable } from '@catbee/utils/types';

interface ReadonlyUser {
  readonly id: number;
  readonly name: string;
}

type MutableUser = Mutable<ReadonlyUser>;

const user: MutableUser = { id: 1, name: 'Alice' };
user.name = 'Bob'; // OK - properties are mutable
```

---

### `KeysOfType<T, U>`

Gets the keys of `T` whose values are assignable to `U`.

**Type Definition:**

```ts
type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
```

**Examples:**

```ts
import { KeysOfType } from '@catbee/utils/types';

interface Mixed {
  id: number;
  name: string;
  age: number;
  email: string;
}

type StringKeys = KeysOfType<Mixed, string>; // 'name' | 'email'
type NumberKeys = KeysOfType<Mixed, number>; // 'id' | 'age'
```

---

### `RequireAtLeastOne<T, K>`

Requires at least one of the keys in `K` to be present in `T`.

**Type Definition:**

```ts
type RequireAtLeastOne<T, K extends keyof T = keyof T> = K extends keyof T
  ? { [P in K]-?: T[P] } & Omit<T, K>
  : never;
```

**Examples:**

```ts
import { RequireAtLeastOne } from '@catbee/utils/types';

interface Contact {
  email?: string;
  phone?: string;
}

type ContactRequired = RequireAtLeastOne<Contact, 'email' | 'phone'>;

const valid: ContactRequired = { email: 'test@example.com' };
// const invalid: ContactRequired = {}; // Error - at least one required
```

---

### `RecordOptional<K, T>`

A record type with optional keys.

**Type Definition:**

```ts
type RecordOptional<K extends string | number | symbol, T> = {
  [P in K]?: T;
};
```

**Examples:**

```ts
import { RecordOptional } from '@catbee/utils/types';

type OptionalSettings = RecordOptional<'theme' | 'language' | 'timezone', string>;

const settings: OptionalSettings = {
  theme: 'dark'
  // language and timezone are optional
};
```

---

### `Primitive`

Represents all primitive TypeScript types.

**Type Definition:**

```ts
type Primitive = string | number | boolean | bigint | symbol | undefined | null;
```

**Examples:**

```ts
import { Primitive } from '@catbee/utils/types';

function isPrimitive(value: any): value is Primitive {
  return value !== Object(value);
}

isPrimitive('hello'); // true
isPrimitive(123); // true
isPrimitive({}); // false
```

---

### `Awaited<T>`

Recursively unwraps Promise types to get their resolved value type.

**Type Definition:**

```ts
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;
```

**Examples:**

```ts
import { Awaited } from '@catbee/utils/types';

type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number

async function getData(): Promise<{ id: number }> {
  return { id: 1 };
}

type Data = Awaited<ReturnType<typeof getData>>; // { id: number }
```

---

### `PickByType<T, U>`

Picks properties from `T` that are of type `U`.

**Type Definition:**

```ts
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};
```

**Examples:**

```ts
import { PickByType } from '@catbee/utils/types';

interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

type UserStrings = PickByType<User, string>; // { name: string }
type UserNumbers = PickByType<User, number>; // { id: number; age: number }
```

---

### `DeepRequired<T>`

Makes all properties of `T` required recursively.

**Type Definition:**

```ts
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};
```

**Examples:**

```ts
import { DeepRequired } from '@catbee/utils/types';

interface PartialConfig {
  database?: {
    host?: string;
    port?: number;
  };
}

type RequiredConfig = DeepRequired<PartialConfig>;
// { database: { host: string; port: number } }
```

---

### `IsEqual<T, U>`

Type-level equality check that returns `true` or `false` as a type.

**Type Definition:**

```ts
type IsEqual<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2 ? true : false;
```

**Examples:**

```ts
import { IsEqual } from '@catbee/utils/types';

type Test1 = IsEqual<string, string>; // true
type Test2 = IsEqual<string, number>; // false
type Test3 = IsEqual<{ a: string }, { a: string }>; // true
```

---

### `Writable<T>`

Makes all properties of an object writable (removes readonly).

**Type Definition:**

```ts
type Writable<T> = { -readonly [P in keyof T]: T[P] };
```

**Examples:**

```ts
import { Writable } from '@catbee/utils/types';

interface ReadonlyConfig {
  readonly apiKey: string;
  readonly timeout: number;
}

type WritableConfig = Writable<ReadonlyConfig>;

const config: WritableConfig = { apiKey: 'abc', timeout: 5000 };
config.apiKey = 'xyz'; // OK
```

---

### `Optional2<T, K>`

Makes specific keys `K` of type `T` optional.

**Type Definition:**

```ts
type Optional2<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

**Examples:**

```ts
import { Optional2 } from '@catbee/utils/types';

interface User {
  id: number;
  name: string;
  email: string;
}

type UserWithOptionalEmail = Optional2<User, 'email'>;

const user: UserWithOptionalEmail = {
  id: 1,
  name: 'Alice'
  // email is optional
};
```

---

### `Without<T, U>`

Creates a type with all properties of `T` except those with types assignable to `U`.

**Type Definition:**

```ts
type Without<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};
```

**Examples:**

```ts
import { Without } from '@catbee/utils/types';

interface Mixed {
  id: number;
  name: string;
  count: number;
  active: boolean;
}

type WithoutNumbers = Without<Mixed, number>; // { name: string; active: boolean }
```

---

## API Response Types

### `ApiResponse<T>`

Generic API response format used to wrap any successful or failed response from the server.

**Interface Definition:**

```ts
interface ApiResponse<T = any> {
  data: T | null;
  error: boolean;
  message: string;
  requestId: string;
  timestamp: string;
}
```

**Properties:**

- `data`: Payload returned from the API (any shape depending on endpoint).
- `error`: Indicates whether an error occurred (`true` = error, `false` = success).
- `message`: Success message describing the result of the operation.
- `requestId`: Unique request ID for traceability in logs.
- `timestamp`: ISO timestamp when the response was generated.

**Examples:**

```ts
import { ApiResponse } from '@catbee/utils/types';

const response: ApiResponse<{ id: number; name: string }> = {
  data: { id: 1, name: 'Item' },
  error: false,
  message: 'Success',
  requestId: 'req-123',
  timestamp: '2026-01-02T10:00:00Z'
};
```

---

### `ApiSuccessResponse<T>`

Success response structure with strongly typed data.

**Interface Definition:**

```ts
interface ApiSuccessResponse<T = any> extends ApiResponse<T> {
  error: false;
  status?: number;
}
```

**Properties:**

- Extends `ApiResponse<T>`
- `error`: Always `false` for success responses.
- `status`: HTTP status code (usually 200).

**Examples:**

```ts
import { ApiSuccessResponse } from '@catbee/utils/types';

const success: ApiSuccessResponse<{ userId: string }> = {
  data: { userId: 'user-123' },
  error: false,
  message: 'User created successfully',
  requestId: 'req-456',
  timestamp: '2026-01-02T10:00:00Z',
  status: 201
};
```

---

### `ApiErrorResponse`

Error response structure with additional metadata.

**Interface Definition:**

```ts
interface ApiErrorResponse extends Omit<ApiResponse<never>, 'data'> {
  error: true;
  status: number;
  path: string;
  stack?: string[];
}
```

**Properties:**

- `error`: Always `true` for error responses.
- `status`: HTTP status code.
- `path`: Path to the resource that caused the error.
- `stack`: Stack trace of the error (if available).
- Inherits `message`, `requestId`, `timestamp` from `ApiResponse`.

**Examples:**

```ts
import { ApiErrorResponse } from '@catbee/utils/types';

const error: ApiErrorResponse = {
  error: true,
  status: 404,
  message: 'User not found',
  path: '/api/users/123',
  requestId: 'req-789',
  timestamp: '2026-01-02T10:00:00Z',
  stack: ['Error: User not found', 'at getUserById...']
};
```

---

### `Pagination<T>`

Generic pagination structure used for paged lists.

**Interface Definition:**

```ts
interface Pagination<T = any> {
  content: T[];
  pagination: {
    totalRecords: number;
    totalPages: number;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}
```

**Properties:**

- `content`: List of records for the current page.
- `pagination`: Metadata about the pagination state:
  - `totalRecords`: Total number of records across all pages.
  - `totalPages`: Total number of pages available.
  - `page`: Current page number (1-based index).
  - `limit`: Number of records per page.
  - `sortBy`: Field by which the data is sorted.
  - `sortOrder`: Sort order (ascending or descending).

**Examples:**

```ts
import { Pagination } from '@catbee/utils/types';

const users: Pagination<{ id: number; name: string }> = {
  content: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ],
  pagination: {
    totalRecords: 100,
    totalPages: 10,
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'asc'
  }
};
```

---

### `PaginationResponse<T>`

Alias for paginated API response. Allows semantic naming like `PaginationResponse<User>`.

**Type Definition:**

```ts
type PaginationResponse<T = any> = Pagination<T>;
```

**Examples:**

```ts
import { PaginationResponse } from '@catbee/utils/types';

const response: PaginationResponse<User> = {
  content: users,
  pagination: {
    totalRecords: 50,
    totalPages: 5,
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }
};
```

---

### `BatchResponse<T>`

Response structure for batch operations when multiple operations are performed in a single request.

**Interface Definition:**

```ts
interface BatchResponse<T = any> {
  success: boolean;
  total: number;
  successful: number;
  failed: number;
  results: Array<{
    id: string | number;
    success: boolean;
    data?: T;
    error?: {
      message: string;
      code?: string;
    };
  }>;
}
```

**Properties:**

- `success`: Overall success/failure indicator.
- `total`: Total number of operations.
- `successful`: Number of successful operations.
- `failed`: Number of failed operations.
- `results`: Array of individual operation results.

**Examples:**

```ts
import { BatchResponse } from '@catbee/utils/types';

const batch: BatchResponse<{ id: number }> = {
  success: true,
  total: 3,
  successful: 2,
  failed: 1,
  results: [
    { id: 1, success: true, data: { id: 1 } },
    { id: 2, success: true, data: { id: 2 } },
    { id: 3, success: false, error: { message: 'Validation failed' } }
  ]
};
```

---

### `AsyncOperationResponse`

Response structure for asynchronous operations that will complete in the future.

**Interface Definition:**

```ts
interface AsyncOperationResponse {
  async: true;
  jobId: string;
  estimatedTime?: number;
  statusUrl: string;
}
```

**Properties:**

- `async`: Always `true` for async operations.
- `jobId`: Job or task ID to check status later.
- `estimatedTime`: Estimated completion time in seconds (if known).
- `statusUrl`: URL to check status.

**Examples:**

```ts
import { AsyncOperationResponse } from '@catbee/utils/types';

const asyncOp: AsyncOperationResponse = {
  async: true,
  jobId: 'job-abc-123',
  estimatedTime: 300,
  statusUrl: '/api/jobs/job-abc-123/status'
};
```

---

### `StreamResponse`

Response structure for streaming operations when data is returned as a stream.

**Interface Definition:**

```ts
interface StreamResponse {
  streamId: string;
  streamType: string;
  totalSize?: number;
  chunkSize: number;
}
```

**Properties:**

- `streamId`: Stream identifier.
- `streamType`: Stream type (e.g., 'json', 'binary').
- `totalSize`: Total size in bytes (if known).
- `chunkSize`: Chunk size in bytes.

**Examples:**

```ts
import { StreamResponse } from '@catbee/utils/types';

const stream: StreamResponse = {
  streamId: 'stream-xyz-789',
  streamType: 'json',
  totalSize: 1024000,
  chunkSize: 8192
};
```

---

### `PaginationParams`

Pagination parameters for API requests.

**Interface Definition:**

```ts
interface PaginationParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortDirection;
  search?: string;
}
```

**Properties:**

- `page`: Current page number (1-based index).
- `limit`: Number of records per page.
- `sortBy`: Field by which the data is sorted.
- `sortOrder`: Sort order (ascending or descending).
- `search`: Optional search query.

**Examples:**

```ts
import { PaginationParams } from '@catbee/utils/types';

const params: PaginationParams = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: SortDirection.DESC,
  search: 'john'
};
```

---

### `WithPagination<T>`

Type that combines pagination parameters with additional data.

**Type Definition:**

```ts
type WithPagination<T = {}> = PaginationParams & T;
```

**Examples:**

```ts
import { WithPagination } from '@catbee/utils/types';

interface UserFilters {
  role: string;
  active: boolean;
}

type UserQuery = WithPagination<UserFilters>;

const query: UserQuery = {
  page: 1,
  limit: 20,
  sortBy: 'name',
  sortOrder: SortDirection.ASC,
  role: 'admin',
  active: true
};
```

---

### `SortDirection`

Sort direction enumeration.

**Enum Definition:**

```ts
enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}
```

**Examples:**

```ts
import { SortDirection } from '@catbee/utils/types';

const ascending = SortDirection.ASC; // 'asc'
const descending = SortDirection.DESC; // 'desc'

function sortData(direction: SortDirection) {
  // ...
}

sortData(SortDirection.DESC);
```
