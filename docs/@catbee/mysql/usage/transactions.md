---
id: transactions
title: Transactions
sidebar_position: 3
---

# Transactions

Transactions use a dedicated connection and expose query helpers plus commit, rollback, and savepoint controls.

## Automatic transactions

Prefer `db.transaction()` when all work belongs to one atomic operation. It commits when the callback resolves and rolls back when the callback throws:

```ts
const userId = await db.transaction(async tx => {
  const result = await tx.execute(
    'INSERT INTO users(name, email) VALUES(?, ?)',
    ['Alice', 'alice@example.com']
  );
  const insertedId = result.result.insertId;

  await tx.execute(
    'INSERT INTO audit_logs(action, user_id) VALUES(?, ?)',
    ['created', insertedId]
  );

  return insertedId;
});
```

The callback result is returned to the caller. Errors are rethrown after rollback.

## Manual transactions

Use `startTransaction()` when the transaction boundary needs to be controlled explicitly:

```ts
const tx = await db.startTransaction();

try {
  await tx.execute('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, fromId]);
  await tx.execute('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, toId]);
  await tx.commit();
} catch (error) {
  await tx.rollback();
  throw error;
}
```

After `commit()` or `rollback()`, the transaction is released and cannot be used again.

## Transaction helpers

`SqlTransaction` supports:

- `query()` and `execute()`
- `get()` and `all()`
- `insert()`, `update()`, and `delete()`
- `exists()` and `count()`
- `commit()` and `rollback()`
- `savepoint()`, `rollbackTo()`, and `releaseSavepoint()`

Client-only methods such as `raw()`, `queryNamed()`, `executeNamed()`, `ping()`, and `close()` are not available on a transaction object.

## Savepoints

Savepoints allow partial rollback while keeping the outer transaction active:

```ts
const savepoint = await tx.savepoint('after_user');

try {
  await tx.execute('INSERT INTO preferences(user_id) VALUES(?)', [userId]);
  await tx.releaseSavepoint(savepoint);
} catch (error) {
  await tx.rollbackTo(savepoint);
  throw error;
}
```

If no name is supplied, the client creates a name such as `sp_1`. Explicit names must match `[A-Za-z_][A-Za-z0-9_]*`.
