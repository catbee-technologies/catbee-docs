---
slug: ../server
sidebar_position: 2
---

# Express Server

Enterprise-grade Express server builder for secure, reliable, and observable APIs.

## API Summary

- [**`ServerConfigBuilder`**](#serverconfigbuilder) - fluent builder for server configuration.
- [**`ExpressServer`**](#expressserver) - main server class with lifecycle hooks and utilities.
- [**`registerHealthCheck(name, fn, options)`**](#health-checks) - add health checks for dependencies (readiness, liveness, or both).
- [**`setReady(ready)` / `isReady()` / `ready()`**](#health-checks) - control and inspect service readiness for Kubernetes traffic.
- [**`markStartupComplete()` / `isStartupComplete()`**](#health-checks) - signal and inspect application startup completion for startup probes.
- [**`getHealthzServer()` / `getHealthzAddress()`**](#health-checks) - access running Healthz probe server instance and address info.
- [**`enableGracefulShutdown([signals])`**](#graceful-shutdown) - enable graceful shutdown on process signals.
- [**`disableGracefulShutdown()`**](#graceful-shutdown) - unregister graceful shutdown signal listeners.
- [**`createRouter(prefix: string)`**](#create-namespaced-router) - create a namespaced router.
- [**`addBaseRouter(router: Router)`**](#mount-base-router-addbaserouter) - mount a base router onto the root router (prevents duplicate mounting).
- [**`setBaseRouter(router: Router)`**](#mount-base-router-addbaserouter) - alias for `addBaseRouter` (backward compatible).
- [**`get()`, `post()`, `put()`, `delete()`, `patch()`, `options()`, `head()`**](#express-style-route-helpers) - fluent Express route registration helpers.
- [**`registerRoute(methods: string[], path: string, ...handlers: RequestHandler[])`**](#register-custom-route) - register route handlers.
- [**`registerMiddleware(path: string, middleware: RequestHandler)`**](#register-middleware) - add custom middleware.
- [**`useMiddleware(...middlewares: RequestHandler[])`**](#register-middleware) - apply global middleware.
- [**`getMetricsRegistry(): MetricsRegistry`**](#metrics) - access Prometheus metrics registry.

---

## Features Covered

- **Security**
  - CORS (Cross-Origin Resource Sharing)
  - Helmet (HTTP security headers)
  - Rate limiting (express-rate-limit)
  - Request timeouts
  - Body size limits
  - Cookie parsing
  - Trust proxy support

- **Monitoring**
  - Request logging (customizable, skip paths, skip not found)
  - Prometheus metrics (via prom-client)
  - Health checks (custom and built-in)
  - Request tracing (request ID middleware)
  - Response time tracking

- **Performance**
  - Compression (gzip/deflate)
  - Static file serving (multiple folders, cache control)
  - Efficient body parsing

- **Reliability**
  - Graceful shutdown (signal handling, connection draining)
  - Error handling (custom/global error handler)
  - 404 handler

- **Developer Experience**
  - OpenAPI documentation (via @scalar/express-api-reference)
  - Lifecycle hooks for extensibility
  - Global headers
  - Microservice mode (service name/version headers)
  - Custom routers and middleware

- **Extensibility**
  - Lifecycle hooks (beforeInit, afterInit, beforeStart, afterStart, beforeStop, afterStop, onRequest, onResponse, onError)
  - Custom configuration overrides
  - Custom middleware and routes

---

## Libraries Used

- **express** - Core web server framework
- **helmet** - Security headers
- **cors** - CORS support
- **compression** - Response compression
- **cookie-parser** - Cookie parsing
- **express-rate-limit** - Rate limiting
- **prom-client** - Prometheus metrics
- **@scalar/express-api-reference** - OpenAPI documentation UI
- **uuid** - Request ID generation
- **fs** - File system utilities
- **http/https** - Node.js server modules

---

## Interfaces & Types

### CatbeeServerConfig

```ts
interface CatbeeServerConfig {
  port: number; // default: 3000
  host?: string; // default: '0.0.0.0'
  cors?: boolean | CorsOptions; // default: false
  helmet?: boolean | HelmetOptions; // default: false
  compression?: boolean | CompressionOptions; // default: false
  bodyParser?: {
    json?: { limit: string }; // default: { limit: '1mb' }
    urlencoded?: { extended: boolean; limit: string }; // default: { extended: true, limit: '1mb' }
  };
  cookieParser?: boolean | CookieParseOptions; // default: false
  trustProxy?: boolean | number | string | string[]; // default: false
  staticFolders?: Array<{
    path?: string; // default: '/'
    directory: string;
    maxAge?: string; // default: 0
    etag?: boolean; // default: true
    immutable?: boolean; // default: false
    lastModified?: boolean; // default: true
    cacheControl?: boolean; // default: true
  }>;
  isMicroservice?: boolean; // default: false
  appName?: string; // default: 'catbee_server'
  globalHeaders?: Record<string, string | (() => string)>; // default: {}
  rateLimit?: {
    enable: boolean; // default: false
    windowMs?: number; // default: 900000 (15 min)
    max?: number; // default: 100
    message?: string; // default: 'Too many requests, please try again later.'
    standardHeaders?: boolean; // default: true
    legacyHeaders?: boolean; // default: false
  };
  requestLogging?: {
    enable: boolean; // default: true in dev, false in prod
    ignorePaths?: string[] | ((req: Request, res: Response) => boolean); // default: skips /healthz, /favicon.ico, /metrics, /docs, /.well-known
    skipNotFoundRoutes?: boolean; // default: true
  };
  healthzServer?: boolean | (CatbeeHealthzServerConfig & { enable?: boolean }); // default: false, env: SERVER_HEALTHZ_ENABLE || HEALTHZ_ENABLE
  requestTimeout?: number; // default: 0 (disabled)
  responseTime?: {
    enable: boolean; // default: false
    addHeader?: boolean; // default: true
    logOnComplete?: boolean; // default: false
  };
  requestId?: {
    headerName?: string; // default: 'x-request-id'
    exposeHeader?: boolean; // default: true
    generator?: () => string; // default: uuid()
  };
  globalPrefix?: string; // default: ''
  openApi?: {
    enable: boolean; // default: false
    mountPath?: string; // default: '/docs'
    filePath?: string; // required if enabled
    verbose?: boolean; // default: false
    withGlobalPrefix?: boolean; // default: false
  };
  metrics?: {
    enable: boolean; // default: false
    path?: string; // default: '/metrics'
    withGlobalPrefix?: boolean; // default: false
  };
  serviceVersion?: {
    enable: boolean; // default: false
    headerName?: string; // default: 'x-service-version'
    version?: string | (() => string); // default: '0.0.0'
  };
  https?: {
    key: string; // Path to private key file (PEM)
    cert: string; // Path to certificate file (PEM)
    ca?: string; // Optional CA bundle path (PEM)
    passphrase?: string; // Optional private key passphrase
    [key: string]: any; // Additional Node.js https.ServerOptions
  };
}
```

### CatbeeServerHooks

```ts
interface CatbeeServerHooks {
  beforeInit?: (server: ExpressServer) => Promise<void> | void;
  beforeRoutes?: (app: Express) => Promise<void> | void;
  afterRoutes?: (app: Express) => Promise<void> | void;
  afterInit?: (server: ExpressServer) => Promise<void> | void;
  onServerCreated?: (server: http.Server | https.Server) => Promise<void> | void;
  beforeStart?: (app: Express) => Promise<void> | void;
  afterStart?: (server: http.Server | https.Server) => Promise<void> | void;
  beforeStop?: (server: http.Server | https.Server) => Promise<void> | void;
  afterStop?: () => Promise<void> | void;
  onError?: (error: Error, req: Request, res: Response, next: NextFunction) => void;
  onRequest?: (req: Request, res: Response, next: NextFunction) => void;
  onResponse?: (req: Request, res: Response, next: NextFunction) => void;
}
```

---

## Environment Variables

### Logger Environment Variables

For configuring logger behavior via environment variables, see the [Logger documentation](logger#environment-variables).

### Server Environment Variables

| Environment Variable                           | Type       | Default/Value                                | Description                                      |
| ---------------------------------------------- | ---------- | -------------------------------------------- | ------------------------------------------------ |
| `SERVER_PORT`                                  | `number`   | `${PORT}` or `3000`                          | Server port (overrides PORT)                     |
| `PORT`                                         | `number`   | `3000`                                       | Fallback port if SERVER_PORT unset               |
| `SERVER_HOST`                                  | `string`   | `${HOST}` or `0.0.0.0`                       | Server host (overrides HOST)                     |
| `HOST`                                         | `string`   | `0.0.0.0`                                    | Fallback host if SERVER_HOST unset               |
| `SERVER_CORS_ENABLE`                           | `boolean`  | `false`                                      | Enable CORS middleware                           |
| `SERVER_HELMET_ENABLE`                         | `boolean`  | `false`                                      | Enable Helmet security middleware                |
| `SERVER_COMPRESSION_ENABLE`                    | `boolean`  | `false`                                      | Enable response compression                      |
| `SERVER_BODY_PARSER_JSON_LIMIT`                | `string`   | `1mb`                                        | Max JSON body size                               |
| `SERVER_BODY_PARSER_URLENCODED_LIMIT`          | `string`   | `1mb`                                        | Max URL-encoded body size                        |
| `SERVER_COOKIE_PARSER_ENABLE`                  | `boolean`  | `false`                                      | Enable cookie parser middleware                  |
| `SERVER_IS_MICROSERVICE`                       | `boolean`  | `false`                                      | Microservice mode flag                           |
| `SERVER_APP_NAME`                              | `string`   | `${npm_package_name}` or `catbee_server`     | Application/service name                         |
| `SERVER_GLOBAL_HEADERS`                        | `JSON`     | `{}`                                         | Global response headers                          |
| `SERVER_RATE_LIMIT_ENABLE`                     | `boolean`  | `false`                                      | Enable rate limiting                             |
| `SERVER_RATE_LIMIT_WINDOW_MS`                  | `duration` | `15m`                                        | Rate limit window (ms or duration)               |
| `SERVER_RATE_LIMIT_MAX`                        | `number`   | `100`                                        | Max requests per window                          |
| `SERVER_RATE_LIMIT_MESSAGE`                    | `string`   | `Too many requests, please try again later.` | Rate limit error message                         |
| `SERVER_RATE_LIMIT_STANDARD_HEADERS`           | `boolean`  | `true`                                       | Use standard rate limit headers                  |
| `SERVER_RATE_LIMIT_LEGACY_HEADERS`             | `boolean`  | `false`                                      | Use legacy rate limit headers                    |
| `SERVER_REQUEST_LOGGING_ENABLE`                | `boolean`  | `true` in dev, `false` otherwise             | Enable request logging                           |
| `SERVER_REQUEST_LOGGING_SKIP_NOT_FOUND_ROUTES` | `boolean`  | `true`                                       | Skip logging for 404 routes                      |
| `SERVER_TRUST_PROXY_ENABLE`                    | `boolean`  | `false`                                      | Trust proxy headers                              |
| `SERVER_OPENAPI_ENABLE`                        | `boolean`  | `false`                                      | Enable OpenAPI docs                              |
| `SERVER_OPENAPI_MOUNT_PATH`                    | `string`   | `/docs`                                      | OpenAPI docs mount path                          |
| `SERVER_OPENAPI_VERBOSE`                       | `boolean`  | `false`                                      | Verbose OpenAPI output                           |
| `SERVER_OPENAPI_WITH_GLOBAL_PREFIX`            | `boolean`  | `false`                                      | Prefix OpenAPI routes                            |
| `SERVER_HEALTHZ_ENABLE`                        | `boolean`  | `false`                                      | Enable integrated dedicated Healthz probe server |
| `SERVER_REQUEST_TIMEOUT_MS`                    | `duration` | `0`                                          | Request timeout (ms or duration)                 |
| `SERVER_RESPONSE_TIME_ENABLE`                  | `boolean`  | `false`                                      | Enable response time tracking                    |
| `SERVER_RESPONSE_TIME_ADD_HEADER`              | `boolean`  | `true`                                       | Add X-Response-Time header                       |
| `SERVER_RESPONSE_TIME_LOG_ON_COMPLETE`         | `boolean`  | `false`                                      | Log response time on complete                    |
| `SERVER_REQUEST_ID_HEADER_NAME`                | `string`   | `x-request-id`                               | Request ID header name                           |
| `SERVER_REQUEST_ID_EXPOSE_HEADER`              | `boolean`  | `true`                                       | Expose request ID header                         |
| `SERVER_METRICS_ENABLE`                        | `boolean`  | `false`                                      | Enable Prometheus metrics                        |
| `SERVER_METRICS_PATH`                          | `string`   | `/metrics`                                   | Metrics endpoint path                            |
| `SERVER_METRICS_WITH_GLOBAL_PREFIX`            | `boolean`  | `false`                                      | Prefix metrics route                             |
| `SERVER_SERVICE_VERSION_ENABLE`                | `boolean`  | `false`                                      | Enable service version header                    |
| `SERVER_SERVICE_VERSION_HEADER_NAME`           | `string`   | `x-service-version`                          | Service version header name                      |
| `SERVER_SERVICE_VERSION`                       | `string`   | `${npm_package_version}` or `0.0.0`          | Service version value                            |
| `npm_package_name`                             | `string`   | `@catbee/utils`                              | Package name (from package.json)                 |
| `npm_package_version`                          | `string`   | `0.0.0`                                      | Package version (from package.json)              |

---

---

## Features

- **Security:** CORS, Helmet, rate limiting, timeouts, body size limits
- **Monitoring:** Request logging, Prometheus metrics, health checks
- **Performance:** Compression, static files
- **Reliability:** Graceful shutdown, error handling
- **Developer UX:** OpenAPI docs, debugging
- **Extensibility:** Lifecycle hooks, middleware, custom routes

---

## Usage Example

```ts
import { ServerConfigBuilder, ExpressServer } from '@catbee/utils/server';

// Build server config with all major features
const config = new ServerConfigBuilder()
  .withPort(3000)
  .withHost('0.0.0.0')
  .enableCors()
  .enableHelmet()
  .enableCompression()
  .enableRateLimit({ max: 50, windowMs: 60000 })
  .enableRequestLogging({ ignorePaths: ['/healthz', '/metrics'] })
  .enableMetrics({ path: '/metrics' })
  .enableHealthzServer({ port: 8282 })
  .enableOpenApi('./openapi.yaml', { mountPath: '/docs' })
  .withStaticFolder({ path: '/assets', directory: './public/assets', maxAge: '1d' })
  .withGlobalHeaders({
    'X-Powered-By': 'Catbee',
    'X-Server-Time': () => new Date().toISOString()
  })
  .withGlobalPrefix('/api')
  .withMicroService({
    appName: 'user-service',
    serviceVersion: { enable: true, version: '1.0.0' }
  })
  .withTrustProxy(true)
  .withRequestId({ headerName: 'X-Request-Id', exposeHeader: true })
  .enableResponseTime({ addHeader: true, logOnComplete: true })
  .withBodyParser({ json: { limit: '2mb' }, urlencoded: { extended: true, limit: '2mb' } })
  .withCookies(true)
  .withHttps({
    key: './localhost-key.pem',
    cert: './localhost-cert.pem'
  })
  .withCustom({ requestTimeout: 60000 })
  .build();

// Create server with all lifecycle hooks
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

// Register health checks (readiness probe by default)
server.registerHealthCheck('database', async () => await checkDatabaseConnection(), 'readiness');
server.registerHealthCheck('storage', () => require('fs').existsSync('./data'), 'readiness');

// Check if server is ready (synchronous check against HealthzServer)
const isReady = server.ready();
console.log('Server ready:', isReady);

// Register routes
const router = server.createRouter('/users');
router.get('/', (req, res) => res.json({ users: [] }));
router.post('/', (req, res) => res.json({ created: true }));

// Or set a base router for all routes
import { Router } from 'express';
const baseRouter = Router();
baseRouter.use('/users', router);
server.setBaseRouter(baseRouter);

// Register custom middleware for admin routes
server.registerMiddleware('/admin', (req, res, next) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).send('Forbidden');
  next();
});

// Use global middleware
server.useMiddleware((req, res, next) => {
  // Example: log request time
  req.logger?.info('Request received at ' + new Date().toISOString());
  next();
});

// Register a route directly
server.registerRoute(['get'], '/status', (req, res) => res.json({ ok: true }));

// Start server
await server.start();

// Enable graceful shutdown
server.enableGracefulShutdown();
```

---

## ServerConfigBuilder

Fluent API for configuring all aspects of your server.

**Method Signatures:**

```ts
new ServerConfigBuilder()
  .withPort(port: number)
  .withHost(host: string)
  .enableCors()
  .withCors(options: CorsOptions)
  .enableHelmet()
  .withHelmet(options: HelmetOptions)
  .enableCompression()
  .withCompression(options: CompressionOptions)
  .enableRateLimit(options: RateLimitOptions)
  .withRateLimit(options: RateLimitOptions)
  .enableRequestLogging(options: RequestLoggingOptions)
  .withRequestLogging(options: RequestLoggingOptions)
  .enableMetrics(options: MetricsOptions)
  .withMetrics(options: MetricsOptions)
  .withHealthzServer(options: CatbeeHealthzServerConfig | boolean)
  .enableHealthzServer(options?: Partial<CatbeeHealthzServerConfig>)
  .disableHealthzServer()
  .enableOpenApi(filePath: string, options: OpenApiOptions)
  .withOpenApi(options: OpenApiOptions)
  .withMicroService({ appName, serviceVersion })
  .withTrustProxy(value: boolean)
  .withRequestId(options: { headerName?: string; exposeHeader?: boolean; generator?: () => string })
  .enableResponseTime(options: { addHeader?: boolean; logOnComplete?: boolean })
  .withResponseTime(options: { addHeader?: boolean; logOnComplete?: boolean })
  .withBodyParser(options: { json?: BodyParserOptions; urlencoded?: BodyParserOptions })
  .withCookies(options: { secret?: string; secure?: boolean })
  .withStaticFolder({ path, directory, ... })
  .withGlobalHeaders(headers: Record<string, string>)
  .withGlobalPrefix(prefix: string)
  .withHttps(options: { cert: string; key: string; ca?: string })
  .withCustom(overrides: Partial<ServerConfig>)
  .build()
```

**Examples:**

```ts
const config = new ServerConfigBuilder()
  .withPort(3000)
  .enableCors()
  .enableHelmet()
  .enableCompression()
  .withGlobalPrefix('/api/v1')
  .enableMetrics({ path: '/metrics' })
  .enableOpenApi('./openapi.yaml', { mountPath: '/docs' })
  .build();
```

---

## ExpressServer

Main server class with lifecycle hooks and utilities.

**Method Signatures:**

```ts
new ExpressServer(config: Partial<CatbeeServerConfig>, hooks?: CatbeeServerHooks)
  .start(): Promise<http.Server | https.Server>
  .stop(force?: boolean): Promise<void>
  .enableGracefulShutdown(signals?: NodeJS.Signals[]): this
  .disableGracefulShutdown(): this
  .registerHealthCheck(name: string, check: (signal?: AbortSignal) => Promise<boolean> | boolean, options?: 'readiness' | 'liveness' | 'both' | { type?: 'readiness' | 'liveness' | 'both' }): this
  .setReady(ready: boolean): this
  .isReady(): boolean
  .ready(): boolean
  .markStartupComplete(): this
  .isStartupComplete(): boolean
  .getHealthzServer(): HealthzServer | undefined
  .getHealthzAddress(): HealthzAddressInfo | null | undefined
  .isHealthzServerEnabled(): boolean
  .getApp(): Express
  .getServer(): http.Server | https.Server | null
  .addBaseRouter(router: Router): this
  .setBaseRouter(router: Router): this
  .createRouter(prefix?: string): Router
  .get(path: string, ...handlers: RequestHandler[]): this
  .post(path: string, ...handlers: RequestHandler[]): this
  .put(path: string, ...handlers: RequestHandler[]): this
  .delete(path: string, ...handlers: RequestHandler[]): this
  .patch(path: string, ...handlers: RequestHandler[]): this
  .options(path: string, ...handlers: RequestHandler[]): this
  .head(path: string, ...handlers: RequestHandler[]): this
  .registerRoute(methods: string[], path: string, ...handlers): this
  .registerMiddleware(path: string | RequestHandler, middleware?: RequestHandler): this
  .useMiddleware(...middlewares: RequestHandler[]): this
  .getMetricsRegistry(): Registry
  .getConfig(): CatbeeServerConfig
  .waitUntilReady(): Promise<void>
```

**Lifecycle Hooks:**

```ts
{
  beforeInit?: (server) => void | Promise<void>,
  afterInit?: (server) => void | Promise<void>,
  beforeStart?: (app) => void | Promise<void>,
  afterStart?: (server) => void | Promise<void>,
  beforeStop?: (server) => void | Promise<void>,
  afterStop?: () => void | Promise<void>,
  onRequest?: (req, res, next) => void,
  onResponse?: (req, res, next) => void,
  onError?: (err, req, res, next) => void
}
```

**Examples:**

```ts
const server = new ExpressServer(config, {
  beforeInit: srv => console.log('Initializing...'),
  afterStart: srv => console.log('Started!')
});
await server.start();
```

**Additional Methods:**

- `getApp()` - Get the underlying Express application instance
- `getServer()` - Get the active HTTP/HTTPS server instance (null if not running)
- `ready()` / `isReady()` - Return whether the service is currently marked ready for traffic on the Healthz probe server (`boolean`)
- `setReady(ready: boolean)` - Manually update readiness status on the Healthz probe server
- `markStartupComplete()` - Mark application startup as completed on the Healthz probe server (switches `/startupz` to 200)
- `isStartupComplete()` - Check whether application startup has completed on the Healthz probe server
- `getHealthzServer()` - Get the active `HealthzServer` singleton instance (if started)
- `getHealthzAddress()` - Get the bound address info (`address`, `port`, `family`) of the running Healthz probe server
- `isHealthzServerEnabled()` - Return whether the integrated Healthz probe server is enabled
- `waitUntilReady()` - Wait for server initialization to complete

---

## Health Checks

In Catbee 2.2.0+, `ExpressServer` provides first-class integration with the dedicated, standalone [`HealthzServer`](healthz-server) designed specifically for Kubernetes container probes (`livenessProbe`, `readinessProbe`, `startupProbe`).

### Why Standalone Healthz Server?

In cloud-native production environments, running health probes on your main application port can lead to false-positive probe timeouts or delayed traffic draining:

- Heavy application traffic, long-running requests, or event-loop stalls delay probe responses on the main HTTP server.
- Kubernetes interprets probe timeouts as container failures and restarts healthy pods, worsening cluster instability.
- With Catbee's integrated `HealthzServer`, probes run on an isolated HTTP listener (default port `8282`), ensuring fast and deterministic probe evaluations.

### Enabling the Healthz Probe Server

Enable the probe server through `ServerConfigBuilder`:

```ts
const config = new ServerConfigBuilder()
  .withPort(3000)
  .enableHealthzServer({
    port: 8282,
    shutdownDelayMs: 5000 // Drain delay before closing sockets on shutdown
  })
  .build();
```

Or enable globally via environment variables:

```env
SERVER_HEALTHZ_ENABLE=true
HEALTHZ_PORT=8282
```

### Registering Health Checks

```ts
server.registerHealthCheck(
  name: string,
  check: (signal?: AbortSignal) => Promise<boolean> | boolean,
  options?: 'readiness' | 'liveness' | 'both' | { type?: 'readiness' | 'liveness' | 'both' }
): this
```

- **Target Probe Type:** By default, checks attach to the `'readiness'` probe. External dependencies (databases, Redis, message queues) must always be attached to `readiness` probes so temporary outages safely remove the pod from service endpoints without triggering container restart loops.
- **Cooperative Timeout Cancellation:** Each check receives an optional `AbortSignal` that triggers if the probe times out (configurable via `checkTimeoutMs`, default `5000ms`).
- **Dynamic Registration:** Checks registered before or after `server.start()` are automatically synchronized to the active `HealthzServer` instance.

```ts
// 1. Dependency check (readiness probe - default)
server.registerHealthCheck(
  'database',
  async signal => {
    return await db.ping({ signal });
  },
  'readiness'
);

// 2. Storage / cache dependency (readiness)
server.registerHealthCheck('cache', async signal => {
  return await redis.ping({ signal });
});

// 3. Lightweight internal sanity check (liveness probe)
server.registerHealthCheck('event-loop', () => {
  return process.memoryUsage().heapUsed > 0;
}, 'liveness');
```

### Controlling and Inspecting Readiness

```ts
// Check readiness status synchronously
const isReady = server.ready(); // or server.isReady()
console.log('Ready for traffic:', isReady);

// Manually pause traffic (e.g. during heavy migrations or cache prefetching)
server.setReady(false);

await runMigrations();

// Re-enable traffic
server.setReady(true);
```

### Server Lifecycle & Multi-Stage Probe Coordination

When `healthzServer` is enabled, `ExpressServer` coordinates probe states across all deployment stages:

1. **Pre-binding Probe Server Boot:** `HealthzServer` starts listening on port `8282` **before** the main Express server binds or executes `beforeStart` hooks:
   - `/healthz` (liveness) returns `200 OK` (health server running and process alive).
   - `/startupz` (startup) returns `503 Service Unavailable` (`unhealthy`, startup not complete).
   - `/readyz` (readiness) returns `503 Service Unavailable` (not accepting traffic yet).
2. **Atomic Startup & Completion:** If `HealthzServer` fails to bind (e.g. port collision), `server.start()` cleanly aborts and rolls back Express server setup. Once the Express server is successfully listening on its port:
   - `server.markStartupComplete()` is automatically called, switching `/startupz` to `200 OK`.
   - `server.setReady(true)` is automatically called, switching `/readyz` to `200 OK`.
3. **Coordinated Shutdown & Load Balancer Draining:** When `server.stop()` is triggered (or process signal received via `enableGracefulShutdown()`):
   - `server.setReady(false)` is invoked immediately, causing `/readyz` probes to return `503 Service Unavailable` to pull the pod from endpoint lists.
   - `/startupz` remains `200 OK` (startup completion is decoupled from traffic readiness so Kubernetes does not treat draining as a startup failure).
   - The server waits `shutdownDelayMs` (default `5000ms`, configurable via `SERVER_HEALTHZ_SHUTDOWN_DELAY_MS` or `HEALTHZ_SHUTDOWN_DELAY_MS`) to allow in-flight network requests to drain.
   - The main Express server drains in-flight requests and closes active connections.
   - `HealthzServer.stop()` shuts down the probe HTTP listener cleanly.

---

## Graceful Shutdown

Enable zero-downtime deployments and safe process termination.

**Method Signatures:**

```ts
server.enableGracefulShutdown(signals?: NodeJS.Signals[]): this
server.disableGracefulShutdown(): this
```

### How Graceful Shutdown Works

1. **Signal Handling**: Listens for process signals (`SIGTERM`, `SIGINT` by default). Signal handlers are managed in an internal `Map` to prevent duplicate execution.
2. **Immediate Idle Connection Teardown**: Upon initiation, `server.closeIdleConnections?.()` is called immediately so idle keep-alive HTTP sockets do not stall the termination process.
3. **In-Flight Request Draining**: The server stops accepting new connections and waits for active requests to finish processing.
4. **Forced Socket Destruction**: Any socket that does not close within the timeout window is forcefully destroyed.
5. **Hook Execution**: `beforeStop` and `afterStop` lifecycle hooks are executed in sequence.

### Examples

```ts
// Enable automatic signal handling on SIGTERM and SIGINT
server.enableGracefulShutdown();

// For testing or dynamic lifecycles, unregister listeners to prevent leaks
server.disableGracefulShutdown();

// Or manually stop the server
await server.stop();
```

---

## Server Lifecycle & Concurrency Protection

`ExpressServer` is built for mission-critical production environments with robust startup and shutdown guarantees:

- **Concurrency Protection**: Calling `server.start()` concurrently is protected by an internal in-flight `startPromise`. Multiple concurrent calls wait on the same initialization and return the single running server instance without port collision or double-binding.
- **Hook & Listener Ordering**: Connection tracking, unified error handling, and the `onServerCreated` hook are registered and awaited **before** `server.listen()` is called. This ensures no incoming socket or startup error can be missed.
- **Automatic Failure Cleanup**: If the server fails to bind or start (e.g., port in use), listeners are automatically detached, connections are cleared, and `this.server` resets to `null`, allowing safe retry attempts.

---

## Routing & Middleware

`ExpressServer` unifies all routing onto a permanent internal `rootRouter`. This ensures that global middleware, route prefixes, and sub-routers interact cleanly without dropped handlers.

### Mount Base Router (`addBaseRouter`)

Mount an external router onto the server's root routing pipeline. Duplicate mounting of the same router instance is automatically prevented:

```ts
import { Router } from 'express';

const apiRouter = Router();
apiRouter.get('/users', (req, res) => res.json({ users: [] }));

const server = new ExpressServer(config);

// Mount router onto root router
server.addBaseRouter(apiRouter);

// Duplicate mounts are safely ignored
server.addBaseRouter(apiRouter);

// `setBaseRouter` is maintained as a backward-compatible alias
server.setBaseRouter(apiRouter);
```

### Express-Style Route Helpers

Register routes directly on the server instance using familiar Express-style HTTP method helpers:

```ts
server
  .get('/status', (req, res) => res.json({ status: 'ok' }))
  .post('/users', authMiddleware, createUserHandler)
  .put('/users/:id', updateUserHandler)
  .delete('/users/:id', deleteUserHandler)
  .patch('/users/:id', patchUserHandler)
  .options('/users', optionsHandler)
  .head('/ping', (req, res) => res.end());
```

### Create Namespaced Router

```ts
const router = server.createRouter('/users');
router.get('/', handler);
```

### Register Custom Route

```ts
server.registerRoute(['get', 'post'], '/webhook', webhookHandler);
```

### Register Middleware

```ts
server.registerMiddleware('/admin', adminMiddleware);
server.useMiddleware(loggingMiddleware, errorMiddleware);
```

---

## Metrics

**Access Prometheus Registry:**

```ts
const registry = server.getMetricsRegistry();
```

---

## API Reference

See [ServerConfigBuilder](#serverconfigbuilder) and [ExpressServer](#expressserver) for full method documentation and options.

---

- `withCompression(opts: CompressionOptions)` / `enableCompression()` / `disableCompression()` - Configure response compression
- `withRateLimit(opts: RateLimitOptions)` / `enableRateLimit(opts: RateLimitOptions)` / `disableRateLimit()` - Configure rate limiting
- `withRequestLogging(opts: RequestLoggingOptions)` / `enableRequestLogging(opts: RequestLoggingOptions)` / `disableRequestLogging()` - Configure request logging
- `withMetrics(opts: MetricsOptions)` / `enableMetrics(opts: MetricsOptions)` / `disableMetrics()` - Configure Prometheus metrics
- `withHealthzServer(opts: CatbeeHealthzServerConfig | boolean)` / `enableHealthzServer(opts?: Partial<CatbeeHealthzServerConfig>)` / `disableHealthzServer()` - Configure dedicated Healthz probe server
- `withOpenApi(opts: OpenApiOptions)` / `enableOpenApi(filePath: string, opts: OpenApiOptions)` / `disableOpenApi()` - Configure OpenAPI documentation
- `withMicroService(opts: MicroServiceOptions)` - Configure as a microservice
- `withTrustProxy(opts: TrustProxyOptions)` - Configure trust proxy settings
- `withRequestId(opts: RequestIdOptions)` - Configure request ID generation
- `withResponseTime(opts: ResponseTimeOptions)` / `enableResponseTime(opts: ResponseTimeOptions)` / `disableResponseTime()` - Configure response time tracking
- `withBodyParser(opts: BodyParserOptions)` - Configure request body parsing
- `withCookies(opts: CookiesOptions)` - Configure cookie parsing
- `withStaticFolder(folder: string)` - Configure static file serving
- `withGlobalHeaders(headers: Record<string, string>)` - Set global response headers
- `withGlobalPrefix(prefix: string)` - Set global route prefix
- `withHttps(opts: HttpsOptions)` - Configure HTTPS
- `withCustom(overrides: Partial<ServerConfig>)` - Apply custom configuration
- `build()` - Build the final configuration

---

## Core NPM Packages (always required)

- `express` - The web framework
- `pino` - Logging library

---

## Feature-specific NPM Packages (only if feature is enabled)

| Feature             | Required NPM Packages           |
| ------------------- | ------------------------------- |
| CORS                | `cors`                          |
| Helmet (security)   | `helmet`                        |
| Compression         | `compression`                   |
| Cookie Parsing      | `cookie-parser`                 |
| Rate Limiting       | `express-rate-limit`            |
| Metadata Reflection | `reflect-metadata`              |
| Prometheus Metrics  | `prom-client`                   |
| OpenAPI Docs        | `@scalar/express-api-reference` |

**Note:** These packages must be installed via `npm install <package>` if you enable the corresponding feature in your server config.
