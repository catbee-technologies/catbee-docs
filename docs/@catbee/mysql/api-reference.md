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
  UpgradeManager,
  compileNamedParameters,
  formatDateForMysql,
  getCurrentUtcMysqlTimestamp,
  parseMysqlDateTime,
  parseMysqlDate,
  parseMysqlTimestamp,
  formatDateOnly,
  formatTimeOnly
} from '@catbee/mysql';

import type {
  SqlClientOptions,
  PoolOptions,
  SqlScalar,
  SqlScalarValue,
  SqlValue,
  SqlParameters,
  QueryExecutionOptions,
  RetryOptions,
  MiddlewareContext,
  MiddlewareFn,
  SqlQueryResult,
  SqlExecuteResult,
  QueryRows,
  SqlTransaction,
  TransactionIsolationLevel,
  TransactionOptions,
  SqlClientBase,
  NamedSqlParameters,
  CompiledNamedQuery,
  MigrationStep,
  Migration,
  MigrationStatus,
  UpgradeManagerOptions,
  UpgradeLogger,
  UpgradeResult,
  UpgradeStepResult,
  UpgradeStatus,
  SchemaInitializer,
  SchemaInitOption
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

| Method                                                    | Description                                                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `use(fn)`                                                 | Register middleware around every `query()` and `execute()` call. Returns the client for chaining. |
| `query<T>(sql, parameters?, options?)`                    | Execute a `SELECT` query and return `SqlQueryResult<T>`.                                          |
| `execute<T>(sql, parameters?, options?)`                  | Execute a write statement and return `SqlExecuteResult<T>`.                                       |
| `raw<T>(sql, parameters?, options?)`                      | Execute any SQL and return the raw rows/result value. Retries default to disabled.                |
| `queryNamed<T>(sql, namedParameters, options?)`           | Compile named placeholders and execute a query.                                                   |
| `executeNamed<T>(sql, namedParameters, options?)`         | Compile named placeholders and execute a statement.                                               |
| `get<T>(sql, parameters?, options?)`                      | Return one row or `null`; throws if more than one row is returned.                                |
| `all<T>(sql, parameters?, options?)`                      | Return all matching rows.                                                                         |
| `exists(sql, parameters?, options?)`                      | Return whether at least one row matches.                                                          |
| `count(sql, parameters?, options?)`                       | Return the numeric value of the first column in the first row, or `0` (intended for `COUNT(*)`).  |
| `insert(sql, parameters?, options?)`                      | Return `affectedRows` for an INSERT.                                                              |
| `update(sql, parameters?, returnChangedRows?, options?)`  | Return `affectedRows`, or `changedRows` when requested.                                           |
| `delete(sql, parameters?, options?)`                      | Return the deleted row count.                                                                     |
| `startTransaction(options?)`                              | Start a manual `SqlTransaction` with optional isolation level and readOnly settings.              |
| `transaction<T>(callback, options?)`                      | Run a callback with automatic commit and rollback under optional transaction options.             |
| `withAdvisoryLock<T>(lockName, timeoutSeconds, callback)` | Execute an operation under a distributed MySQL session advisory lock (`GET_LOCK`).                |
| `ping()`                                                  | Return `true` when `SELECT 1` succeeds, otherwise `false`.                                        |
| `close()`                                                 | Close the connection or pool.                                                                     |

## `SqlTransaction`

The transaction interface exposes the query, execute, and transaction control helpers below:

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

> While `SqlClient.query()` and `SqlClient.execute()` wrap results in enriched telemetry envelopes (`SqlQueryResult<T>` and `SqlExecuteResult<T>`), `SqlTransaction.query()` and `SqlTransaction.execute()` return query rows (`T extends QueryRows = RowDataPacket[]`) and execution headers (`T extends QueryResult_ = ResultSetHeader`) directly to minimize overhead inside latency-critical transactions.

A completed transaction cannot be used again. Savepoint names must match `[A-Za-z_][A-Za-z0-9_]*`.

Methods not present on `SqlTransaction`: `use`, `raw`, `queryNamed`, `executeNamed`, `withAdvisoryLock`, `ping`, `startTransaction`, `transaction`, `close`.

## `UpgradeManager`

Coordinates schema evolution, sequential migrations, and fresh database bootstrapping under distributed advisory locks.

### Constructor options (`UpgradeManagerOptions`)

```ts
interface UpgradeManagerOptions {
  versionTablePrefix?: string;     // default: '_version'
  versionTableSuffix?: string;     // optional suffix e.g. 'auth' -> '_version_auth'
  tableName?: string;              // full override for version table name
  migrations?: MigrationStep[];    // registered sequential migrations
  lockTimeoutSeconds?: number;     // advisory lock timeout (default: 60)
  autoRollbackOnFailure?: boolean; // attempt step.down() if step.up() throws (default: false)
  schemaInit?: SchemaInitOption;   // snapshot schema initializer for fresh databases
  logger?: UpgradeLogger;          // debug, info, warn, error logger
}
```

### Schema initializer options (`SchemaInitOption`)

`schemaInit` accepts either a declarative object or a direct function shorthand:

```ts
// Form 1: Declarative object with explicit target version
schemaInit: {
  version: 2,
  create: async (client: SqlClient) => {
    await client.execute('CREATE TABLE users (...)');
  }
}

// Form 2: Direct function shorthand (target version inferred from highest registered migration)
schemaInit: async (client: SqlClient) => {
  await client.execute('CREATE TABLE users (...)');
}
```

When using the function shorthand, the target version automatically matches the highest version among registered `migrations` (e.g. `2`). You can also specify an explicit version when calling `upgradeManager.setSchemaInit(createFn, version)`.

### Instance methods

```ts
setup(targetVersion?: number): Promise<UpgradeResult>
upgrade(targetVersion?: number): Promise<UpgradeResult>
bootstrap(targetVersion?: number): Promise<UpgradeResult>
downgrade(targetVersion: number): Promise<UpgradeResult>
rollback(): Promise<UpgradeResult>
getStatus(targetVersion?: number): Promise<UpgradeStatus>
getCurrentVersion(): Promise<number>
isFreshDatabase(client?: SqlClient): Promise<boolean>
resetFailedState(newVersion?: number): Promise<void>
addMigration(migration: MigrationStep): this
addMigrations(migrations: MigrationStep[]): this
setSchemaInit(initializer: SchemaInitOption, version?: number): this
getRegisteredMigrations(): readonly MigrationStep[]
getTableName(): string
getVersionTablePrefix(): string
getVersionTableSuffix(): string | undefined
getLockName(): string
```

## `QueryBuilder`

```ts
class QueryBuilder {
  select(...columns: string[]): this;
  insert(table: string, columns: Record<string, SqlValue>): this;
  update(table: string, updates: Record<string, SqlValue>): this;
  delete(table: string): this;
  from(table: string): this;
  where(column: string, operator: ComparisonOperator, value: SqlValue): this;
  whereIn(column: string, values: readonly SqlValue[]): this;
  whereBetween(column: string, lower: SqlValue, upper: SqlValue): this;
  and(column: string, operator: ComparisonOperator, value: SqlValue): this;
  andIn(column: string, values: readonly SqlValue[]): this;
  andBetween(column: string, lower: SqlValue, upper: SqlValue): this;
  or(column: string, operator: ComparisonOperator, value: SqlValue): this;
  orIn(column: string, values: readonly SqlValue[]): this;
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

All formatting uses UTC. Parsing validates both the input format (including up to 6 microsecond digits) and the resulting calendar date.

## Types

### `SqlScalar`, `SqlValue`, and `SqlParameters`

```ts
type SqlScalar = string | number | boolean | Buffer | null;
type SqlScalarValue = SqlScalar;

type SqlValue =
  | SqlScalar
  | readonly SqlScalar[]
  | SqlScalar[]
  | readonly (readonly SqlScalar[])[]
  | SqlScalar[][];

type SqlParameters = readonly SqlValue[];
```

- Supports scalar primitives.
- Supports 1D arrays for `IN (?)` clauses.
- Supports 2D arrays for bulk `INSERT ... VALUES ?` operations.
- `Date` objects are rejected at runtime in parameters; use `DateUtils` to format as UTC string.

### `TransactionOptions` and `TransactionIsolationLevel`

```ts
type TransactionIsolationLevel =
  | 'READ UNCOMMITTED'
  | 'READ COMMITTED'
  | 'REPEATABLE READ'
  | 'SERIALIZABLE';

interface TransactionOptions {
  isolationLevel?: TransactionIsolationLevel;
  readOnly?: boolean;
}
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
