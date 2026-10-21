---
id: parameters-and-dates
title: Parameters and dates
sidebar_position: 5
---

# Parameters and dates

## Named parameters

`queryNamed()` and `executeNamed()` accept a readonly object and compile named tokens into positional `?` parameters:

```ts
const result = await db.queryNamed(
  `SELECT id, name
   FROM users
   WHERE account_id = :accountId
     AND status = :status`,
  { accountId: 42, status: 'active' }
);
```

The compiler does not replace tokens inside:

- Single-quoted string literals (properly handling escaped backslashes, e.g. `'C:\\'`)
- Double-quoted string literals
- Backtick identifiers
- Line comments
- Block comments

A named token that is not present in the parameter object throws an error.

You can use the compiler directly when integrating with another executor:

```ts
import { compileNamedParameters } from '@catbee/mysql';

const compiled = compileNamedParameters(
  'SELECT * FROM users WHERE id = :id',
  { id: 7 }
);

console.log(compiled.sql); // SELECT * FROM users WHERE id = ?
console.log(compiled.parameters); // [7]
```

## Supported values

`SqlValue` supports scalar primitives as well as arrays:

- **Scalar values**: `string | number | boolean | Buffer | null`
- **1D arrays**: For `IN (?)` clauses or positional lists
- **2D arrays**: For bulk `INSERT ... VALUES ?` operations

```ts
// 1. IN clause list
const roles = ['admin', 'editor'];
const users = await db.all('SELECT * FROM users WHERE role IN (?)', [roles]);

// 2. Bulk insert with 2D array
const batch = [
  ['Alice', 'alice@example.com'],
  ['Bob', 'bob@example.com']
];
await db.insert('INSERT INTO users(name, email) VALUES ?', [batch]);
```

Dates are intentionally not accepted as raw SQL parameters. Convert them to explicit UTC strings first.

## UTC date handling

The connection manager defaults the MySQL timezone to `Z`. Store UTC strings and convert them to local time only at the presentation boundary.

```ts
import {
  formatDateForMysql,
  getCurrentUtcMysqlTimestamp,
  parseMysqlDateTime
} from '@catbee/mysql';

const createdAt = formatDateForMysql(new Date());
const updatedAt = getCurrentUtcMysqlTimestamp(true);

await db.execute(
  'INSERT INTO events(created_at, updated_at) VALUES(?, ?)',
  [createdAt, updatedAt]
);

const event = await db.get<{ created_at: string }>(
  'SELECT created_at FROM events WHERE id = ?',
  [eventId]
);

const createdDate = event ? parseMysqlDateTime(event.created_at) : null;
```

## Date utility reference

- `formatDateForMysql(date, includeMilliseconds?)` returns `YYYY-MM-DD HH:mm:ss[.SSS]` in UTC.
- `getCurrentUtcMysqlTimestamp(includeMilliseconds?)` returns the current UTC DATETIME string.
- `parseMysqlDateTime(value)` parses a UTC DATETIME (supporting 1 to 6 fractional microsecond digits, e.g. `YYYY-MM-DD HH:mm:ss.ffffff`) and validates calendar ranges.
- `parseMysqlDate(value)` parses `YYYY-MM-DD` at midnight UTC.
- `parseMysqlTimestamp(value)` parses a TIMESTAMP using the DATETIME format.
- `formatDateOnly(date)` returns `YYYY-MM-DD` in UTC.
- `formatTimeOnly(date, includeMilliseconds?)` returns `HH:mm:ss[.SSS]` in UTC.

Invalid formats and impossible calendar values throw descriptive errors.
