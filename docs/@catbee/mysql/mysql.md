---
id: usage
title: mysql
description: Type-safe MySQL access for Node.js and TypeScript.
---

# @catbee/mysql

A lightweight MySQL client for Node.js and TypeScript with safe parameters, connection pooling, transactions, query building, retry controls, middleware, distributed advisory locks, schema migrations, and explicit UTC date utilities.

## Documentation map

- [Introduction](./intro) - Features, installation, and the first client
- [Basic usage](./usage/basic) - Queries, statements, result typing, advisory locks, and health checks
- [Connection pooling](./usage/pooling) - Pool configuration, timeouts, retries, and cancellation
- [Transactions](./usage/transactions) - Automatic transactions, manual control, isolation levels, and savepoints
- [Schema migrations & bootstrap](./usage/migrations) - Database schema lifecycle, sequential migrations, rollbacks, and fresh database bootstrap
- [Query builder](./usage/query-builder) - Build parameterized SQL with fluent clauses
- [Parameters and dates](./usage/parameters-and-dates) - Named placeholders, 1D/2D array parameters, validation, and UTC date handling
- [API reference](./api-reference) - Exported classes, methods, types, and utilities

## What the library provides

- Safe `?` parameters, 1D array `IN (?)` lists, 2D array bulk `VALUES ?`, and named `:parameter` placeholders
- Single persistent connections and pooled connections
- Typed query and execute result envelopes
- Automatic rollback with `db.transaction()` and configurable isolation levels
- Savepoints for partial rollback inside an active transaction
- Distributed MySQL advisory locks (`withAdvisoryLock()`) with dedicated session scoping
- Production-grade schema migration and bootstrap manager (`UpgradeManager`) with multi-pod concurrency protection
- Retry, timeout, abort-signal, and strict statement controls
- Middleware and `EventEmitter` lifecycle events
- A fluent builder for common SQL statements
- Date and time helpers that consistently use UTC

## Package links

- [npm](https://www.npmjs.com/package/@catbee/mysql)
- [Source repository](https://github.com/catbee-technologies/catbee-mysql)
- [Issues](https://github.com/catbee-technologies/catbee-mysql/issues)
