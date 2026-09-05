---
id: query-builder
title: Query builder
sidebar_position: 4
---

# Query builder

`buildQuery()` creates a new `QueryBuilder`. Every clause is chainable and values are emitted as bound parameters rather than interpolated into SQL.

## Select queries

```ts
import { buildQuery } from '@catbee/mysql';

const query = buildQuery()
  .select('id', 'name', 'email')
  .from('users')
  .where('age', '>', 18)
  .and('active', '=', true)
  .orderBy('name', 'ASC')
  .limit(10)
  .offset(20);

const { sql, parameters } = query.build();
const result = await db.query(sql, parameters);
```

Table and qualified identifiers are escaped with MySQL backticks. Table references may include one alias, such as `users u` or `app.users u`.

## Insert, update, and delete

```ts
const insertQuery = buildQuery().insert('users', {
  name: 'Alice',
  email: 'alice@example.com'
});

const updateQuery = buildQuery()
  .update('users', { active: true })
  .where('id', '=', userId);

const deleteQuery = buildQuery()
  .delete('users')
  .where('id', '=', userId);
```

Use `build()` and pass both values to the client:

```ts
const { sql, parameters } = updateQuery.build();
await db.execute(sql, parameters);
```

## Joins and aggregates

```ts
const query = buildQuery()
  .select('u.id', 'u.name', 'COUNT(p.id) AS post_count')
  .from('users u')
  .join('LEFT', 'posts p', 'u.id = p.user_id')
  .where('u.active', '=', true)
  .groupBy('u.id', 'u.name')
  .having('post_count', '>', 5)
  .orderBy('u.name', 'ASC');
```

Join conditions are supplied as SQL text and optional values:

```ts
buildQuery()
  .select('*')
  .from('users u')
  .join('INNER', 'teams t', 'u.team_id = t.id AND t.region = ?', region);
```

Supported join types are `INNER`, `LEFT`, and `RIGHT`.

## Filters

Comparison methods support `=`, `!=`, `>`, `>=`, `<`, `<=`, and `LIKE`:

```ts
buildQuery()
  .select('*')
  .from('users')
  .where('role', '=', 'admin')
  .or('role', '=', 'owner')
  .andBetween('age', 18, 40)
  .whereIn('status', ['active', 'pending']);
```

Available filter families are `where`, `and`, `or`, `having`, plus their `In` and `Between` variants. `In` lists must contain at least one value.

## Inspect and reuse a builder

```ts
const query = buildQuery().select('*').from('users');

console.log(query.getSql());
console.log(query.getParameters());

const built = query.build();
query.reset().select('*').from('posts');
```
