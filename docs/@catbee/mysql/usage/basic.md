---
id: basic
title: Basic usage
sidebar_position: 1
---

# Basic usage

## Create a client

`SqlClient.create()` opens and verifies one persistent connection before returning the client:

```ts
import { SqlClient } from '@catbee/mysql';

const db = await SqlClient.create({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'myapp'
});
```

Close it during application shutdown:

```ts
await db.close();
```

## Query rows

`query()` returns an envelope with `rows`, executed SQL, bound parameters, duration, and retry attempt:

```ts
interface UserRow {
  id: number;
  name: string;
  email: string;
}

const result = await db.query<UserRow[]>(
  'SELECT id, name, email FROM users WHERE active = ?',
  [true]
);

console.log(result.rows);
console.log(`${result.durationMs}ms`);
```

Use `get()` for zero or one row. It returns `null` when no rows exist and throws if multiple rows are returned:

```ts
const user = await db.get<UserRow>('SELECT * FROM users WHERE id = ?', [userId]);
```

Use `all()` when an array is expected:

```ts
const users = await db.all<UserRow>('SELECT * FROM users ORDER BY name');
```

## Execute statements

`execute()` returns the underlying MySQL result in an `SqlExecuteResult` envelope:

```ts
const result = await db.execute(
  'INSERT INTO users(name, email) VALUES(?, ?)',
  ['Alice', 'alice@example.com']
);

console.log(result.result.insertId);
console.log(result.result.affectedRows);
```

Convenience helpers return counts directly:

```ts
const inserted = await db.insert('INSERT INTO users(name) VALUES(?)', ['Alice']);
const updated = await db.update('UPDATE users SET active = ? WHERE id = ?', [true, userId]);
const changed = await db.update('UPDATE users SET active = ? WHERE id = ?', [true, userId], true);
const deleted = await db.delete('DELETE FROM users WHERE id = ?', [userId]);
```

`exists()` checks whether a query returns at least one row. `count()` converts the first value in the first row to a number and returns `0` for no rows:

```ts
const emailTaken = await db.exists('SELECT 1 FROM users WHERE email = ?', [email]);
const total = await db.count('SELECT COUNT(*) FROM users');
```

## Health checks and raw results

```ts
if (!(await db.ping())) {
  throw new Error('Database is unavailable');
}
```

Use `raw()` only when you need the raw rows/result shape or intentionally want to bypass the query/execute distinction:

```ts
const rawRows = await db.raw('SHOW TABLES');
```

## Parameter safety

Only pass supported values as parameters: `string`, `number`, `boolean`, `Buffer`, or `null`. Always bind user input:

```ts
// Good
await db.query('SELECT * FROM users WHERE id = ?', [userId]);

// Never interpolate untrusted input
await db.query(`SELECT * FROM users WHERE id = ${userId}`);
```
