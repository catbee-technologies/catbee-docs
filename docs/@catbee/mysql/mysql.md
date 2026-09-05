---
id: usage
title: mysql
description: Type-safe MySQL access for Node.js and TypeScript.
---

# @catbee/mysql

A lightweight MySQL client for Node.js and TypeScript with safe parameters, connection pooling, transactions, query building, retry controls, middleware, and explicit UTC date utilities.

## Documentation map

- [Introduction](./intro) - Features, installation, and the first client
- [Basic usage](./usage/basic) - Queries, statements, result typing, and health checks
- [Connection pooling](./usage/pooling) - Pool configuration, timeouts, retries, and cancellation
- [Transactions](./usage/transactions) - Automatic transactions, manual control, and savepoints
- [Query builder](./usage/query-builder) - Build parameterized SQL with fluent clauses
- [Parameters and dates](./usage/parameters-and-dates) - Named placeholders, validation, and UTC date handling
- [API reference](./api-reference) - Exported classes, methods, types, and utilities

## What the library provides

- Safe `?` parameters and named `:parameter` placeholders
- Single persistent connections and pooled connections
- Typed query and execute result envelopes
- Automatic rollback with `db.transaction()`
- Savepoints for partial rollback inside an active transaction
- Retry, timeout, abort-signal, and strict statement controls
- Middleware and `EventEmitter` lifecycle events
- A fluent builder for common SQL statements
- Date and time helpers that consistently use UTC

## Package links

- [npm](https://www.npmjs.com/package/@catbee/mysql)
- [Source repository](https://github.com/catbee-technologies/catbee-mysql)
- [Issues](https://github.com/catbee-technologies/catbee-mysql/issues)
