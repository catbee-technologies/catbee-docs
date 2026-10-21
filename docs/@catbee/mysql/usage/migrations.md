---
id: migrations
title: Schema migrations & bootstrap
sidebar_position: 6
---

# Schema migrations & bootstrap

`UpgradeManager` coordinates schema evolution, incremental migrations, and fresh database bootstrapping under distributed MySQL advisory locks (`GET_LOCK`).

## Why UpgradeManager?

- **Sequential Integer Versioning**: Strict `1, 2, 3...` ordering with gap validation, missing step detection, and bidirectional rollback support (`up`/`down`).
- **Instant Snapshot Bootstrap (`schemaInit`)**: Bootstraps fresh databases directly to the target schema in one shot, bypassing redundant historical migrations.
- **Cluster-Wide Advisory Locking**: `setup()` runs inside a session-scoped MySQL advisory lock, coordinating concurrent replica startups without race conditions.
- **Resilient State Tracking**: Single-row tracking table with `'idle'`, `'migrating'`, and `'failed'` states to prevent cascading partial DDL errors.

## Basic usage

```ts
import { SqlClient, UpgradeManager } from '@catbee/mysql';

const db = SqlClient.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'myapp'
});

const upgradeManager = new UpgradeManager(db, {
  versionTablePrefix: '_version', // default
  // 1. Snapshot: Creates the full latest schema for fresh databases
  schemaInit: {
    version: 2,
    create: async client => {
      await client.execute(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
  },
  // 2. Incremental migrations for existing databases (must start at 1 with no gaps)
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
        // Safe schema evolution: specifying a DEFAULT value ensures existing rows migrate without error
        await client.execute('ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT "user";');
      },
      down: async client => {
        await client.execute('ALTER TABLE users DROP COLUMN role;');
      }
    }
  ]
});

// Single unified entrypoint:
// - Fresh database: executes schemaInit directly and records version 2 (instant bootstrap)
// - Existing database at version 1: executes migration 2 to reach version 2
// - Uninitialized database without schemaInit: executes migration 1 and 2 sequentially
const result = await upgradeManager.setup();
console.log(`Database is now at version ${result.currentVersion}`);
```

## Configuring schemaInit (Object vs Function forms)

`UpgradeManager` accepts `schemaInit` in two flexible forms:

### Form 1: Declarative Object (`SchemaInitializer`)

Specifies both the explicit target `version` and the `create` bootstrap function:

```ts
const upgradeManager = new UpgradeManager(db, {
  schemaInit: {
    version: 2,
    create: async client => {
      await client.execute(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
  },
  migrations: [ /* version 1, version 2 */ ]
});
```

Use this form when you want to be completely explicit about the target version created by the snapshot.

### Form 2: Direct Function Shorthand

Pass an async function directly without wrapping it in an object. When using this shorthand, `UpgradeManager` automatically resolves the target version to the highest version among registered `migrations` (e.g. `2`):

```ts
const upgradeManager = new UpgradeManager(db, {
  // Direct function shorthand:
  // Target version is automatically inferred as 2 (highest migration version)
  schemaInit: async client => {
    await client.execute(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },
  migrations: [
    {
      version: 1,
      name: 'create_users',
      up: async client => { /* ... */ }
    },
    {
      version: 2,
      name: 'add_user_roles',
      up: async client => { /* ... */ }
    }
  ]
});
```

### Dynamic configuration with `setSchemaInit()`

You can also set or override the snapshot initializer dynamically after instantiation:

```ts
// With direct function and explicit version:
upgradeManager.setSchemaInit(async client => {
  await client.execute('CREATE TABLE users (...)');
}, 2);

// Or with an object:
upgradeManager.setSchemaInit({
  version: 2,
  create: async client => {
    await client.execute('CREATE TABLE users (...)');
  }
});
```

## Maintaining schemaInit & migrations in parallel

:::note Sequential Migration Rule
`migrations` must always form a continuous, unbroken sequence starting at `1` (`1, 2, 3...`). `schemaInit` acts as a fast-forward snapshot for clean databases, but does not replace earlier migrations for databases upgrading sequentially.
:::

When evolving your database schema, maintain `schemaInit` as the **current target snapshot** and `migrations` as the **incremental changelog**:

- **Adding a column or table**:
  - Update `schemaInit` to include the new column or table directly in its `CREATE TABLE` definition.
  - Add a new migration step (e.g. `version: 2`) with `ALTER TABLE ... ADD COLUMN ...`.
- **Modifying or dropping a column or table**:
  - Update `schemaInit` to reflect the final schema (remove dropped columns or tables).
  - Add a new migration step (e.g. `version: 3`) with `ALTER TABLE ... DROP COLUMN ...` or `DROP TABLE ...`.

## Manual migration operations

### Apply pending upgrades

Apply all pending migrations up to the latest registered version:

```ts
const result = await upgradeManager.upgrade();
console.log(`Upgraded from ${result.previousVersion} to ${result.currentVersion}`);
```

Or target a specific intermediate version:

```ts
await upgradeManager.upgrade(2);
```

### Rollbacks and downgrades

Roll back the single most recently applied migration:

```ts
const rollbackResult = await upgradeManager.rollback();
console.log(`Rolled back to version ${rollbackResult.currentVersion}`);
```

Or downgrade down to a specific target version in descending order:

```ts
await upgradeManager.downgrade(1);
```

### Inspect status

Check current database version and pending migrations without acquiring locks:

```ts
const status = await upgradeManager.getStatus();

console.log(status.currentVersion);     // e.g. 1
console.log(status.targetVersion);      // e.g. 2
console.log(status.isUpToDate);         // false
console.log(status.status);             // 'idle' | 'migrating' | 'failed'
console.log(status.pending);            // [{ version: 2, name: 'add_user_roles' }]
```

## Table name customization

By default, the version tracking table is named `_version`. You can customize the table name or prefix:

```ts
const upgradeManager = new UpgradeManager(db, {
  // Use custom prefix (default: '_version')
  versionTablePrefix: 'app_version',

  // Optional suffix (e.g. 'auth' -> 'app_version_auth')
  versionTableSuffix: 'auth',

  // Or specify full table name directly (overrides prefix/suffix)
  // tableName: 'custom_migrations'
});
```

## Recovery from failed DDL

In MySQL and MariaDB, DDL statements (`CREATE TABLE`, `ALTER TABLE`, etc.) trigger an implicit commit and cannot be rolled back inside transactions. If an upgrade step throws an error mid-execution, the database is placed in `'failed'` state to block cascading operations.

To recover:

1. Inspect `status.lastError` and verify the physical schema in MySQL.
2. Manually fix or revert any partially applied DDL statements.
3. Call `resetFailedState()` to return status to `'idle'`:

```ts
await upgradeManager.resetFailedState(verifiedVersion);
```
