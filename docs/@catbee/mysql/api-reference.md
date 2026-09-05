---
id: api-reference
title: API Reference
sidebar_position: 6
---

# API Reference

Complete public API documentation for `@catbee/mysql`.

## Exports

```ts
import {
  SqlClient,
  TransactionClient,
  ConnectionManager,
  QueryBuilder,
  buildQuery,
  compileNamedParameters,
  formatDateForMysql,
  getCurrentUtcMysqlTimestamp,
  parseMysqlDateTime,
  parseMysqlDate,
  parseMysqlTimestamp,
  formatDateOnly,
  formatTimeOnly
} from '@catbee/mysql';
```

## `SqlClient`

The main client for single-connection and pooled database access.

### Static methods

```ts
static create(options: SqlClientOptions): Promise<SqlClient>
static createPool(options: PoolOptions): SqlClient
```

`create()` opens one persistent connection before resolving. `createPool()` creates a pool lazily for concurrent workloads.

### Client methods

| Method                                            | Description                                                                                       |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `use(fn)`                                         | Register middleware around every `query()` and `execute()` call. Returns the client for chaining. |
| `query<T>(sql, parameters?, options?)`            | Execute a `SELECT` query and return `SqlQueryResult<T>`.                                          |
| `execute<T>(sql, parameters?, options?)`          | Execute a write statement and return `SqlExecuteResult<T>`.                                       |
| `raw<T>(sql, parameters?, options?)`              | Execute any SQL and return the raw rows/result value. Retries default to disabled.                |
| `queryNamed<T>(sql, namedParameters, options?)`   | Compile named placeholders and execute a query.                                                   |
| `executeNamed<T>(sql, namedParameters, options?)` | Compile named placeholders and execute a statement.                                               |
| `get<T>(sql, parameters?)`                        | Return one row or `null`; throws if more than one row is returned.                                |
| `all<T>(sql, parameters?)`                        | Return all matching rows.                                                                         |
| `exists(sql, parameters?, options?)`              | Return whether at least one row matches.                                                          |
| `count(sql, parameters?, options?)`               | Return the numeric value of the first column in the first row, or `0`.                            |
| `insert(sql, parameters?)`                        | Return `affectedRows` for an INSERT.                                                              |
| `update(sql, parameters?, returnChangedRows?)`    | Return `affectedRows`, or `changedRows` when requested.                                           |
| `delete(sql, parameters?)`                        | Return the deleted row count.                                                                     |
| `startTransaction()`                              | Start a manual `SqlTransaction`.                                                                  |
| `transaction<T>(callback)`                        | Run a callback with automatic commit and rollback.                                                |
| `ping()`                                          | Return `true` when `SELECT 1` succeeds, otherwise `false`.                                        |
| `close()`                                         | Close the connection or pool.                                                                     |

## `SqlTransaction`

The transaction interface exposes the query and execute helpers below:

```ts
query<T>(sql: string, parameters?: SqlParameters): Promise<T>
execute<T>(sql: string, parameters?: SqlParameters): Promise<T>
get<T>(sql: string, parameters?: SqlParameters): Promise<T | null>
all<T>(sql: string, parameters?: SqlParameters): Promise<T[]>
insert(sql: string, parameters?: SqlParameters): Promise<number>
update(sql: string, parameters?: SqlParameters, returnChangedRows?: boolean): Promise<number>
delete(sql: string, parameters?: SqlParameters): Promise<number>
exists(sql: string, parameters?: SqlParameters): Promise<boolean>
count(sql: string, parameters?: SqlParameters): Promise<number>
commit(): Promise<void>
rollback(): Promise<void>
savepoint(name?: string): Promise<string>
rollbackTo(name: string): Promise<void>
releaseSavepoint(name: string): Promise<void>
```

A completed transaction cannot be used again. Savepoint names must match `[A-Za-z_][A-Za-z0-9_]*`.

## `QueryBuilder`

```ts
class QueryBuilder {
  select(...columns: string[]): this;
  insert(table: string, columns: Record<string, SqlValue>): this;
  update(table: string, updates: Record<string, SqlValue>): this;
  delete(table: string): this;
  from(table: string): this;
  where(column: string, operator: ComparisonOperator, value: SqlValue): this;
  and(column: string, operator: ComparisonOperator, value: SqlValue): this;
  or(column: string, operator: ComparisonOperator, value: SqlValue): this;
  whereIn(column: string, values: readonly SqlValue[]): this;
  andIn(column: string, values: readonly SqlValue[]): this;
  orIn(column: string, values: readonly SqlValue[]): this;
  whereBetween(column: string, lower: SqlValue, upper: SqlValue): this;
  andBetween(column: string, lower: SqlValue, upper: SqlValue): this;
  orBetween(column: string, lower: SqlValue, upper: SqlValue): this;
  join(type: 'INNER' | 'LEFT' | 'RIGHT', table: string, condition: string, ...params: SqlValue[]): this;
  groupBy(...columns: string[]): this;
  having(column: string, operator: ComparisonOperator, value: SqlValue): this;
  havingIn(column: string, values: readonly SqlValue[]): this;
  havingBetween(column: string, lower: SqlValue, upper: SqlValue): this;
  orderBy(column: string, direction?: 'ASC' | 'DESC'): this;
  limit(count: number): this;
  offset(count: number): this;
  build(): { sql: string; parameters: SqlParameters };
  getSql(): string;
  getParameters(): SqlParameters;
  reset(): this;
}
```

The factory is equivalent to `new QueryBuilder()`:

```ts
function buildQuery(): QueryBuilder;
```

The builder escapes table and column identifiers and binds values. `In` methods reject empty arrays.

## Named parameters

```ts
 type NamedSqlParameters = Readonly<Record<string, SqlValue>>;

 interface CompiledNamedQuery {
   sql: string;
   parameters: SqlParameters;
 }

 function compileNamedParameters(
   sql: string,
   namedParameters: NamedSqlParameters
 ): CompiledNamedQuery;
```

Named placeholders are compiled only in normal SQL text. String literals, identifiers, and comments are preserved. Missing values throw an error.

## Connection management

`ConnectionManager` is exported for advanced integrations:

```ts
class ConnectionManager {
  constructor(options: ConnectionOptions | PoolOptions, isPooled?: boolean);
  isPoolMode(): boolean;
}
```

Most applications should use `SqlClient.create()` or `SqlClient.createPool()` instead.

## Date utilities

```ts
function formatDateForMysql(date: Date, includeMilliseconds?: boolean): string;
function getCurrentUtcMysqlTimestamp(includeMilliseconds?: boolean): string;
function parseMysqlDateTime(value: string): Date;
function parseMysqlDate(value: string): Date;
function parseMysqlTimestamp(value: string): Date;
function formatDateOnly(date: Date): string;
function formatTimeOnly(date: Date, includeMilliseconds?: boolean): string;
```

All formatting uses UTC. Parsing validates both the input format and the resulting calendar date.

## Types

### `SqlValue` and `SqlParameters`

```ts
type SqlValue = string | number | boolean | Buffer | null;
type SqlParameters = readonly SqlValue[];
```

### `QueryExecutionOptions`

```ts
interface QueryExecutionOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
  retry?: boolean;
  idempotent?: boolean;
}
```

`idempotent` enables write retries for operations that are safe to repeat.

### `RetryOptions`

```ts
interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  retryableErrorCodes?: readonly string[];
}
```

### Client options

```ts
interface SqlClientAdvancedOptions {
  defaultQueryTimeoutMs?: number;
  retry?: RetryOptions;
  enforceStatementKinds?: boolean;
}

interface SqlClientOptions extends ConnectionOptions, SqlClientAdvancedOptions {}
interface PoolOptions extends ConnectionOptions, SqlClientAdvancedOptions {}
```

### Result envelopes

```ts
interface SqlQueryResult<T> {
  rows: T;
  sql: string;
  parameters: SqlParameters;
  durationMs: number;
  attempt: number;
}

interface SqlExecuteResult<T> {
  result: T;
  sql: string;
  parameters: SqlParameters;
  durationMs: number;
  attempt: number;
}
```

### Middleware

```ts
interface MiddlewareContext {
  readonly kind: 'query' | 'execute';
  readonly sql: string;
  readonly parameters: SqlParameters;
  readonly attempt: number;
  readonly timeoutMs?: number;
  result?: unknown;
  durationMs?: number;
  error?: unknown;
}

type MiddlewareFn = (
  context: MiddlewareContext,
  next: () => Promise<void>
) => Promise<void>;
```
