---
id: pooling
title: Connection pooling
sidebar_position: 2
---

# Connection pooling

Use `SqlClient.createPool()` for web servers, APIs, workers, and other concurrent applications. The pool acquires and releases connections for ordinary operations automatically.

```ts
import { SqlClient } from '@catbee/mysql';

const db = SqlClient.createPool({
  host: 'db.example.com',
  user: 'appuser',
  password: process.env.DB_PASSWORD,
  database: 'production',
  connectionLimit: 20,
  waitForConnections: true,
  queueLimit: 100,
  enableKeepAlive: true
});
```

Pool options extend `mysql2` connection and pool options. The library also accepts:

- `defaultQueryTimeoutMs` - Default timeout for operations.
- `retry` - Transient-error retry policy.
- `enforceStatementKinds` - Require `query()` for `SELECT` and `execute()` for writes.

## Timeouts and cancellation

Override the default timeout for an individual call:

```ts
const result = await db.query(
  'SELECT id, name FROM users WHERE active = ?',
  [true],
  { timeoutMs: 2000 }
);
```

Pass an `AbortSignal` to cancel a long-running operation. The active connection is terminated so the database operation does not continue on the server:

```ts
const controller = new AbortController();
const request = db.query('SELECT * FROM large_table', [], { signal: controller.signal });

controller.abort();
await request;
```

## Retry policy

Retries are disabled by default. Enable them for transient failures that are safe to retry:

```ts
const db = SqlClient.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'myapp',
  retry: {
    maxRetries: 3,
    baseDelayMs: 50,
    maxDelayMs: 1000,
    jitter: true,
    retryableErrorCodes: ['ER_LOCK_DEADLOCK', 'ER_LOCK_WAIT_TIMEOUT']
  }
});
```

Write operations retry only when the call is explicitly marked idempotent:

```ts
await db.execute(
  'UPDATE jobs SET claimed = ? WHERE id = ?',
  [true, jobId],
  { idempotent: true }
);
```

Disable retries for a single call with `{ retry: false }`.

## Strict statement mode

Set `enforceStatementKinds: true` to catch accidental API misuse:

```ts
const db = SqlClient.createPool({
  host: 'localhost',
  user: 'root',
  database: 'myapp',
  enforceStatementKinds: true
});
```

In strict mode:

- `query()` accepts only `SELECT` statements.
- `execute()` and `executeNamed()` reject `SELECT` statements.
- `raw()` remains available as the any-SQL escape hatch.

## Shutdown

Close the client when the process stops:

```ts
process.on('SIGTERM', async () => {
  await db.close();
  process.exit(0);
});
```
