---
sidebar_position: 0
---

# Introduction

## @catbee/utils – The Ultimate Utility Toolkit for Node.js & TypeScript

A modular, production-grade utility library for Node.js and TypeScript, built for robust, scalable applications and enterprise Express services. Every utility is tree-shakable, fully typed, and can be imported independently for optimal bundle size.

<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0', }}>
  <img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status" />
  <img src="https://codecov.io/gh/catbee-technologies/catbee-modules/graph/badge.svg?token=XAJHK6R1OQ" alt="Coverage" />
  <img src="https://img.shields.io/node/v/@catbee/utils" alt="Node Version" />
  <img src="https://img.shields.io/npm/v/@catbee/utils" alt="NPM Version" />
  <!-- <img src="https://img.shields.io/npm/v/@catbee/modules/rc" alt="NPM RC Version" />
  <img src="https://img.shields.io/npm/v/@catbee/modules/next" alt="NPM Next Version" /> -->
  <img src="https://img.shields.io/npm/dt/@catbee/utils" alt="NPM Downloads" />
  <img src="https://img.shields.io/npm/types/@catbee/utils" alt="TypeScript Types" />
  <!-- <img src="https://img.shields.io/librariesio/release/npm/@catbee%2Futils" alt="Dependencies" /> -->
  <img src="https://img.shields.io/maintenance/yes/2026" alt="Maintenance" />
  <img src="https://snyk.io/test/github/catbee-technologies/catbee-modules/badge.svg" alt="Snyk Vulnerabilities" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=catbee-technologies_catbee-utils&metric=alert_status&token=93da835f2d48d37b41fa628cc7fc764c873bd700" alt="Quality Gate Status" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=catbee-technologies_catbee-utils&metric=ncloc&token=93da835f2d48d37b41fa628cc7fc764c873bd700" alt="Lines of Code" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=catbee-technologies_catbee-utils&metric=security_rating&token=93da835f2d48d37b41fa628cc7fc764c873bd700" alt="Security Rating" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=catbee-technologies_catbee-utils&metric=sqale_rating&token=93da835f2d48d37b41fa628cc7fc764c873bd700" alt="Maintainability Rating" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=catbee-technologies_catbee-utils&metric=vulnerabilities&token=93da835f2d48d37b41fa628cc7fc764c873bd700" alt="Vulnerabilities" />
  <img src="https://img.shields.io/npm/l/@catbee/utils" alt="License" />
</div>

---

## 🚀 Features

- **Type-safe**: All utilities are fully typed for maximum safety and IDE support.
- **Tree-shakable**: Import only what you need—no bloat, no dead code.
- **Production-ready**: Designed for high-performance, scalable Node.js apps.
- **Express-friendly**: Includes context, middleware, decorators, and server helpers.
- **Comprehensive**: Covers arrays, objects, strings, streams, requests, responses, performance, caching, validation, and more.
- **Configurable**: Global config system with environment variable support.
- **Minimal dependencies**: Minimal footprint, maximum reliability.

---

## 📦 Installation

```bash
npm i @catbee/utils
```

---

## ⚡ Quick Start

```ts
import { ServerConfigBuilder, ExpressServer } from '@catbee/utils/server';
import { Router } from 'express';

const config = new ServerConfigBuilder()
  .withPort(3000)
  .withCors({ origin: '*' })
  .enableRateLimit({ max: 50, windowMs: 60000 })
  .enableRequestLogging({ ignorePaths: ['/healthz', '/metrics'] })
  .withHealthCheck({ path: '/health', detailed: true })
  .enableOpenApi('./openapi.yaml', { mountPath: '/docs' })
  .withGlobalHeaders({ 'X-Powered-By': 'Catbee' })
  .withGlobalPrefix('/api')
  .withRequestId({ headerName: 'X-Request-Id', exposeHeader: true })
  .enableResponseTime({ addHeader: true, logOnComplete: true })
  .build();

const server = new ExpressServer(config, {
  beforeInit: srv => console.log('Initializing server...'),
  afterInit: srv => console.log('Server initialized'),
  beforeStart: app => console.log('Starting server...'),
  afterStart: srv => console.log('Server started!'),
  beforeStop: srv => console.log('Stopping server...'),
  afterStop: () => console.log('Server stopped.'),
  onRequest: (req, res, next) => {
    console.log('Processing request:', req.method, req.url);
    next();
  },
  onResponse: (req, res, next) => {
    res.setHeader('X-Processed-By', 'ExpressServer');
    next();
  },
  onError: (err, req, res, next) => {
    console.error('Custom error handler:', err);
    res.status(500).json({ error: 'Custom error: ' + err.message });
  }
});

// Register routes
const router = server.createRouter('/users');
router.get('/', (req, res) => res.json({ users: [] }));
router.post('/', (req, res) => res.json({ created: true }));

// Or set a base router for all routes
const baseRouter = Router();
baseRouter.use('/users', router);
server.setBaseRouter(baseRouter);

server.registerHealthCheck('database', async () => await checkDatabaseConnection());
server.useMiddleware(loggingMiddleware, errorMiddleware);

await server.start();
server.enableGracefulShutdown();
```

---

## 🏁 Usage

This library supports flexible import patterns to suit your needs:

### Root-level imports (everything available)

Import any utility directly from the root package:

```ts
import { chunk, sleep, TTLCache, getLogger, ServerConfigBuilder } from '@catbee/utils';
```

### Module-level imports (scoped imports)

Import only from specific modules for better organization and smaller bundles:

```ts
// Import only server-related exports
import { ServerConfigBuilder, ExpressServer } from '@catbee/utils/server';

// Import only date utilities
import { formatDate, addDays, DateBuilder } from '@catbee/utils/date';

// Import only crypto utilities
import { hashPassword, verifyPassword } from '@catbee/utils/crypto';
```

Both import styles are fully supported and tree-shakable. Use whichever fits your project structure best!

---

## ⚙️ Configuration

Global configuration management with environment variable support:

- [Config](config) – Centralized runtime configuration

---

## 🏢 Express Server & Health Probes

Enterprise-grade Express server and standalone Kubernetes probe servers:

- [Express Server](server) – Fast, secure, and scalable server setup
- [Healthz Server](healthz-server) – Standalone Kubernetes probe server (`/healthz`, `/readyz`, `/startupz`)

---

## 🧩 Utility Modules

Explore the full suite of utilities, each with detailed API docs and examples:

- [Array](array) – Advanced array manipulation
- [Async](async) – Promise helpers, concurrency, timing
- [Cache](cache) – In-memory caching with TTL
- [Context Store](context-store) – Per-request context via AsyncLocalStorage
- [Crypto](crypto) – Hashing, encryption, tokens
- [Date](date) – Date/time manipulation
- [Decorator](decorator) – TypeScript decorators for Express
- [Directory](directory) – Directory and file system helpers
- [Environment](env) – Env variable management
- [Exception](exception) – HTTP and error handling
- [File System](fs) – File operations
- [Healthz Server](healthz-server) – Standalone Kubernetes probe server
- [HTTP Status Codes](http-status-codes) – Typed status codes
- [ID](id) – UUID and ID generation
- [Logger](logger) – Structured logging with Pino
- [Middleware](middleware) – Express middleware collection
- [Object](object) – Deep merge, flatten, pick/omit, etc.
- [Performance](performance) – Timing, memoization, memory tracking
- [Request](request) – HTTP request parameter parsing/validation
- [Response](response) – Standardized API response formatting
- [Stream](stream) – Stream conversion, batching, throttling, line splitting
- [String](string) – Casing, masking, slugifying, formatting
- [Type](type) – Type checking, conversion, guards
- [Types](types) – Common TypeScript types and interfaces
- [URL](url) – URL parsing, query manipulation, normalization
- [Validation](validation) – Input validation functions

---

## 📜 License

MIT © Catbee Technologies (see the [LICENSE](/license) file for the full text)
