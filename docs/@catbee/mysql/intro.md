---
id: intro
title: Introduction
sidebar_position: 1
---

# @catbee/mysql

A lightweight, type-safe MySQL client for Node.js with connection pooling, transactions, named parameters, resilience controls, distributed advisory locks, schema migrations, and a fluent query builder.

<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0' }}>
  <img src="https://github.com/catbee-technologies/catbee-mysql/actions/workflows/ci.yml/badge.svg?label=Build" alt="Build Status" />
  <img src="https://codecov.io/gh/catbee-technologies/catbee-mysql/graph/badge.svg?token=XAJHK6R1OQ" alt="Coverage" />
  <img src="https://img.shields.io/node/v/@catbee/mysql" alt="Node Version" />
  <img src="https://img.shields.io/npm/v/@catbee/mysql" alt="NPM Version" />
  <img src="https://img.shields.io/npm/dt/@catbee/mysql" alt="NPM Downloads" />
  <img src="https://img.shields.io/npm/types/@catbee/mysql" alt="TypeScript Types" />
  <img src="https://img.shields.io/npm/l/@catbee/mysql" alt="License" />
</div>

## Features

- **Type-safe queries** with TypeScript support for rows, results, parameters, and transactions.
- **Single connections or pools** through `SqlClient.create()` and `SqlClient.createPool()`.
- **Manual and automatic transactions** with rollback-on-error behavior and configurable isolation levels.
- **Nested transactions** through savepoints, rollback-to, and release helpers.
- **Distributed advisory locks** with dedicated session scoping via `withAdvisoryLock()`.
- **Schema migrations & bootstrap** with `UpgradeManager` for sequential migrations, rollbacks, and instant fresh database bootstrap (`schemaInit`).
- **Fluent query builder** for `SELECT`, `INSERT`, `UPDATE`, `DELETE`, joins, filters, grouping, and pagination.
- **Named parameters** with safe `:name` placeholder compilation.
- **Bulk inserts & arrays** supporting 1D `IN (?)` arrays and 2D bulk `VALUES ?` arrays.
- **Resilience controls** including retries, timeouts, cancellation, and strict statement enforcement.
- **Middleware and events** for timing, observability, and error reporting.
- **Convenience methods** such as `get()`, `all()`, `insert()`, `update()`, `delete()`, `exists()`, and `count()`.
- **UTC date utilities** for consistent MySQL date and timestamp handling.

## Continue learning

- [Basic usage](./usage/basic) - Connect, query, execute statements, advisory locks, and type results
- [Connection pooling](./usage/pooling) - Configure concurrency, retries, timeouts, and cancellation
- [Transactions](./usage/transactions) - Use automatic transactions, manual commit/rollback, isolation levels, and savepoints
- [Schema migrations & bootstrap](./usage/migrations) - Database schema lifecycle, sequential migrations, rollbacks, and fresh database bootstrap
- [Query builder](./usage/query-builder) - Compose parameterized SQL fluently
- [Parameters and dates](./usage/parameters-and-dates) - Use named placeholders, 1D/2D arrays, and UTC date helpers
- [API reference](./api-reference) - Browse exported classes, methods, interfaces, and utilities

## Installation

```bash
npm install @catbee/mysql
```

## Create a client

Connect with a single connection:

```ts
import { SqlClient } from '@catbee/mysql';

const db = await SqlClient.create({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'myapp'
});
```

Or configure connection pooling for concurrent workloads:

```ts
const db = SqlClient.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'myapp',
  connectionLimit: 10
});
```

Close the client during application shutdown:

```ts
await db.close();
```

## Query data

`query()` returns a structured result containing rows, SQL, parameters, duration, and retry information.

```ts
const result = await db.query<{ id: number; name: string }>(
  'SELECT id, name FROM users WHERE active = ?',
  [true]
);

console.log(result.rows);
console.log(result.durationMs);
```

Use convenience methods when you only need rows:

```ts
const user = await db.get<{ id: number; email: string }>(
  'SELECT id, email FROM users WHERE id = ?',
  [userId]
);

const activeUsers = await db.all<{ id: number; name: string }>(
  'SELECT id, name FROM users WHERE active = ?',
  [true]
);

const hasAdmins = await db.exists('SELECT 1 FROM users WHERE role = ?', ['admin']);
const userCount = await db.count('SELECT COUNT(*) FROM users');
```

## Execute statements

Use `execute()` for statements that change data, or use convenience methods for common operations:

```ts
const inserted = await db.insert(
  'INSERT INTO users(name, email) VALUES(?, ?)',
  ['Alice', 'alice@example.com']
);

// Bulk insert using 2D array and VALUES ?
const bulkInserted = await db.insert('INSERT INTO users(name, email) VALUES ?', [
  [
    ['Alice', 'alice@example.com'],
    ['Bob', 'bob@example.com']
  ]
]);

const updated = await db.update(
  'UPDATE users SET active = ? WHERE id = ?',
  [true, userId]
);

const deleted = await db.delete('DELETE FROM users WHERE id = ?', [userId]);
```

Always use parameterized queries. Do not interpolate user input into SQL:

```ts
// Good
await db.query('SELECT * FROM users WHERE id = ?', [userId]);

// Avoid
await db.query(`SELECT * FROM users WHERE id = ${userId}`);
```

## Named parameters

Named parameters make longer queries easier to read while still compiling to bound positional parameters:

```ts
const result = await db.queryNamed(
  `SELECT id, name
   FROM users
   WHERE active = :active
     AND created_at >= :createdAfter`,
  {
    active: true,
    createdAfter: '2025-01-01 00:00:00'
  }
);
```

Use `executeNamed()` for write statements.

## Transactions

Automatic transactions commit on success and roll back when the callback throws. You can also specify transaction options such as `isolationLevel`:

```ts
await db.transaction(async tx => {
  await tx.update('UPDATE users SET active = ? WHERE id = ?', [true, userId]);
  await tx.insert(
    'INSERT INTO audit_logs(action, user_id) VALUES(?, ?)',
    ['activate', userId]
  );
}, { isolationLevel: 'READ COMMITTED' });
```

For explicit control, start and finish a transaction manually:

```ts
const tx = await db.startTransaction({ isolationLevel: 'REPEATABLE READ' });

try {
  await tx.execute('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, fromId]);
  await tx.execute('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, toId]);
  await tx.commit();
} catch (error) {
  await tx.rollback();
  throw error;
}
```

Transactions support the same query and convenience helpers as the client, including `get()`, `all()`, `insert()`, `update()`, and `delete()`.

### Savepoints

Nested work can use savepoints without creating a separate database transaction:

```ts
const savepoint = await tx.savepoint();

try {
  await tx.execute('UPDATE orders SET status = ? WHERE id = ?', ['processed', orderId]);
  await tx.releaseSavepoint(savepoint);
} catch (error) {
  await tx.rollbackTo(savepoint);
  throw error;
}
```

## Distributed advisory locks

Safely synchronize distributed workloads across multiple application instances using MySQL session-scoped advisory locks:

```ts
await db.withAdvisoryLock('nightly_data_aggregation', 15, async lockedClient => {
  // Guaranteed single-instance execution
  await lockedClient.execute('CALL aggregate_daily_metrics()');
});
```

## Schema migrations & bootstrap (UpgradeManager)

Manage database evolution with sequential integer migrations (`1, 2, 3...`) and instant snapshot bootstrap (`schemaInit`):

```ts
import { SqlClient, UpgradeManager } from '@catbee/mysql';

const db = SqlClient.createPool({ /* connection options */ });

const upgradeManager = new UpgradeManager(db, {
  // Snapshot for fresh databases
  schemaInit: {
    version: 2,
    create: async client => {
      await client.execute(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
  },
  // Sequential migrations for existing databases
  migrations: [
    {
      version: 1,
      name: 'create_users',
      up: async client => {
        await client.execute(`
          CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
      }
    },
    {
      version: 2,
      name: 'add_user_roles',
      up: async client => {
        await client.execute('ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT "user";');
      },
      down: async client => {
        await client.execute('ALTER TABLE users DROP COLUMN role;');
      }
    }
  ]
});

// Bootstraps fresh DB or upgrades existing DB safely under advisory lock
const result = await upgradeManager.setup();
console.log(`Current version: ${result.currentVersion}`);
```

## Query builder

Build parameterized SQL fluently:

```ts
import { buildQuery } from '@catbee/mysql';

const query = buildQuery()
  .select('id', 'name', 'email')
  .from('users')
  .where('age', '>', 18)
  .and('active', '=', true)
  .orderBy('name', 'ASC')
  .limit(10);

const { sql, parameters } = query.build();
const { rows } = await db.query(sql, parameters);
```

The builder supports:

- `select()`, `insert()`, `update()`, `delete()`
- `from()` and `join()` for table selection and joins
- `where()`, `and()`, `or()` for conditions
- `whereIn()`, `andIn()`, `orIn()` for lists
- `whereBetween()`, `andBetween()`, `orBetween()` for ranges
- `groupBy()` and `having()` for aggregates
- `orderBy()`, `limit()`, and `offset()` for result ordering and pagination
- `build()`, `getSql()`, `getParameters()`, and `reset()` for output control

Supported operators are `=`, `!=`, `>`, `>=`, `<`, `<=`, and `LIKE`.

## Middleware and events

Register middleware for timing, logging, tracing, or error reporting:

```ts
db.use(async (context, next) => {
  const startedAt = Date.now();
  await next();
  console.log(`${context.kind} took ${Date.now() - startedAt}ms`);
});
```

`SqlClient` extends `EventEmitter` and emits successful query and execute results as well as failure contexts:

```ts
db.on('query', result => {
  metrics.histogram('db.query.duration', result.durationMs);
});

db.on('execute', result => {
  metrics.histogram('db.execute.duration', result.durationMs);
});

db.on('error:query', context => {
  logger.error({ sql: context.sql, error: context.error }, 'Database query failed');
});
```

## Resilience and safety

Retries are disabled by default. Enable them through client options when the workload and operation are safe to retry:

```ts
const db = SqlClient.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'myapp',
  defaultQueryTimeoutMs: 5000,
  retry: {
    maxRetries: 3,
    baseDelayMs: 100,
    maxDelayMs: 1000,
    jitter: true
  },
  enforceStatementKinds: true
});
```

Important behavior:

- `query()` accepts read statements when `enforceStatementKinds` is enabled.
- `execute()` and `executeNamed()` reject `SELECT` statements in strict mode.
- Write retries require `{ idempotent: true }`.
- Per-call retries can be disabled with `{ retry: false }`.
- Timeouts and abort signals actively terminate the server-side connection for cancellation.
- `raw()` remains the escape hatch for any SQL statement.

## Date and UTC handling

MySQL `DATETIME` values do not carry complete timezone context. The client defaults the MySQL connection timezone to `Z` (UTC) so applications behave consistently across environments.

Convert dates before writing:

```ts
import {
  formatDateForMysql,
  getCurrentUtcMysqlTimestamp,
  parseMysqlDateTime
} from '@catbee/mysql';

const createdAt = formatDateForMysql(new Date());
const updatedAt = getCurrentUtcMysqlTimestamp();

await db.execute(
  'INSERT INTO users(name, created_at, updated_at) VALUES(?, ?, ?)',
  ['Alice', createdAt, updatedAt]
);

const user = await db.get<{ created_at: string }>(
  'SELECT created_at FROM users WHERE id = ?',
  [userId]
);

const createdDate = user ? parseMysqlDateTime(user.created_at) : null;
```

Available date helpers include:

- `formatDateForMysql(date, includeMilliseconds?)`
- `getCurrentUtcMysqlTimestamp(includeMilliseconds?)`
- `parseMysqlDateTime(value)`
- `parseMysqlDate(value)`
- `parseMysqlTimestamp(value)`
- `formatDateOnly(date)`
- `formatTimeOnly(date, includeMilliseconds?)`

Use UTC strings for storage and convert to local time only in the presentation layer.

## API overview

### `SqlClient`

- `create(options)` and `createPool(options)`
- `use(middleware)`
- `query()` and `execute()`
- `raw()`
- `queryNamed()` and `executeNamed()`
- `get()`, `all()`, `exists()`, and `count()`
- `insert()`, `update()`, and `delete()`
- `startTransaction()` and `transaction()`
- `withAdvisoryLock()`
- `ping()` and `close()`

### `SqlTransaction`

- `query()`, `execute()`, `get()`, and `all()`
- `insert()`, `update()`, `delete()`, `exists()`, and `count()`
- `commit()` and `rollback()`
- `savepoint()`, `rollbackTo()`, and `releaseSavepoint()`

### `UpgradeManager`

- `setup()`, `upgrade()`, `downgrade()`, `rollback()`, and `bootstrap()`
- `getStatus()`, `getCurrentVersion()`, and `isFreshDatabase()`
- `addMigration()`, `addMigrations()`, and `setSchemaInit()`
- `getRegisteredMigrations()`, `getTableName()`, `getVersionTablePrefix()`, `getVersionTableSuffix()`, and `getLockName()`

Transaction clients do not expose client-only methods such as `raw()`, `queryNamed()`, `executeNamed()`, `withAdvisoryLock()`, `ping()`, or `close()`.

## Links

- [npm package](https://www.npmjs.com/package/@catbee/mysql)
- [Source repository](https://github.com/catbee-technologies/catbee-mysql)
- [Issue tracker](https://github.com/catbee-technologies/catbee-mysql/issues)

## License

MIT © Catbee Technologies
