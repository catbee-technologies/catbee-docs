---
slug: ../server
sidebar_position: 2
---

# Express Server

Enterprise-grade Express server builder for secure, reliable, and observable APIs.

## API Summary

- [**`ServerConfigBuilder`**](#serverconfigbuilder) - fluent builder for server configuration.
- [**`ExpressServer`**](#expressserver) - main server class with lifecycle hooks and utilities.
- [**`registerHealthCheck(name: string, fn: () => Promise<boolean> | boolean)`**](#health-checks) - add health checks for dependencies.
- [**`enableGracefulShutdown([signals])`**](#graceful-shutdown) - enable graceful shutdown on process signals.
- [**`createRouter(prefix: string)`**](#create-router) - create a namespaced router.
- [**`setBaseRouter(router: Router)`**](#set-global-base-router) - set a global base router for all routes.
- [**`registerRoute(methods: string[], path: string, ...handlers: RequestHandler[])`**](#register-middleware) - register route handlers.
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
  healthCheck?: {
    path?: string; // default: '/healthz'
    checks?: Array<{ name: string; check: () => Promise<boolean> | boolean }>;
    detailed?: boolean; // default: true
    withGlobalPrefix?: boolean; // default: false
  };
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
  afterInit?: (server: ExpressServer) => Promise<void> | void;
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

| Environment Variable                           | Type       | Default/Value                                | Description                         |
| ---------------------------------------------- | ---------- | -------------------------------------------- | ----------------------------------- |
| `SERVER_PORT`                                  | `number`   | `${PORT}` or `3000`                          | Server port (overrides PORT)        |
| `PORT`                                         | `number`   | `3000`                                       | Fallback port if SERVER_PORT unset  |
| `SERVER_HOST`                                  | `string`   | `${HOST}` or `0.0.0.0`                       | Server host (overrides HOST)        |
| `HOST`                                         | `string`   | `0.0.0.0`                                    | Fallback host if SERVER_HOST unset  |
| `SERVER_CORS_ENABLE`                           | `boolean`  | `false`                                      | Enable CORS middleware              |
| `SERVER_HELMET_ENABLE`                         | `boolean`  | `false`                                      | Enable Helmet security middleware   |
| `SERVER_COMPRESSION_ENABLE`                    | `boolean`  | `false`                                      | Enable response compression         |
| `SERVER_BODY_PARSER_JSON_LIMIT`                | `string`   | `1mb`                                        | Max JSON body size                  |
| `SERVER_BODY_PARSER_URLENCODED_LIMIT`          | `string`   | `1mb`                                        | Max URL-encoded body size           |
| `SERVER_COOKIE_PARSER_ENABLE`                  | `boolean`  | `false`                                      | Enable cookie parser middleware     |
| `SERVER_IS_MICROSERVICE`                       | `boolean`  | `false`                                      | Microservice mode flag              |
| `SERVER_APP_NAME`                              | `string`   | `${npm_package_name}` or `catbee_server`     | Application/service name            |
| `SERVER_GLOBAL_HEADERS`                        | `JSON`     | `{}`                                         | Global response headers             |
| `SERVER_RATE_LIMIT_ENABLE`                     | `boolean`  | `false`                                      | Enable rate limiting                |
| `SERVER_RATE_LIMIT_WINDOW_MS`                  | `duration` | `15m`                                        | Rate limit window (ms or duration)  |
| `SERVER_RATE_LIMIT_MAX`                        | `number`   | `100`                                        | Max requests per window             |
| `SERVER_RATE_LIMIT_MESSAGE`                    | `string`   | `Too many requests, please try again later.` | Rate limit error message            |
| `SERVER_RATE_LIMIT_STANDARD_HEADERS`           | `boolean`  | `true`                                       | Use standard rate limit headers     |
| `SERVER_RATE_LIMIT_LEGACY_HEADERS`             | `boolean`  | `false`                                      | Use legacy rate limit headers       |
| `SERVER_REQUEST_LOGGING_ENABLE`                | `boolean`  | `true` in dev, `false` otherwise             | Enable request logging              |
| `SERVER_REQUEST_LOGGING_SKIP_NOT_FOUND_ROUTES` | `boolean`  | `true`                                       | Skip logging for 404 routes         |
| `SERVER_TRUST_PROXY_ENABLE`                    | `boolean`  | `false`                                      | Trust proxy headers                 |
| `SERVER_OPENAPI_ENABLE`                        | `boolean`  | `false`                                      | Enable OpenAPI docs                 |
| `SERVER_OPENAPI_MOUNT_PATH`                    | `string`   | `/docs`                                      | OpenAPI docs mount path             |
| `SERVER_OPENAPI_VERBOSE`                       | `boolean`  | `false`                                      | Verbose OpenAPI output              |
| `SERVER_OPENAPI_WITH_GLOBAL_PREFIX`            | `boolean`  | `false`                                      | Prefix OpenAPI routes               |
| `SERVER_HEALTH_CHECK_PATH`                     | `string`   | `/healthz`                                   | Health check endpoint path          |
| `SERVER_HEALTH_CHECK_DETAILED_OUTPUT`          | `boolean`  | `true`                                       | Detailed health check output        |
| `SERVER_HEALTH_CHECK_WITH_GLOBAL_PREFIX`       | `boolean`  | `false`                                      | Prefix health check route           |
| `SERVER_REQUEST_TIMEOUT_MS`                    | `duration` | `0`                                          | Request timeout (ms or duration)    |
| `SERVER_RESPONSE_TIME_ENABLE`                  | `boolean`  | `false`                                      | Enable response time tracking       |
| `SERVER_RESPONSE_TIME_ADD_HEADER`              | `boolean`  | `true`                                       | Add X-Response-Time header          |
| `SERVER_RESPONSE_TIME_LOG_ON_COMPLETE`         | `boolean`  | `false`                                      | Log response time on complete       |
| `SERVER_REQUEST_ID_HEADER_NAME`                | `string`   | `x-request-id`                               | Request ID header name              |
| `SERVER_REQUEST_ID_EXPOSE_HEADER`              | `boolean`  | `true`                                       | Expose request ID header            |
| `SERVER_METRICS_ENABLE`                        | `boolean`  | `false`                                      | Enable Prometheus metrics           |
| `SERVER_METRICS_PATH`                          | `string`   | `/metrics`                                   | Metrics endpoint path               |
| `SERVER_METRICS_WITH_GLOBAL_PREFIX`            | `boolean`  | `false`                                      | Prefix metrics route                |
| `SERVER_SERVICE_VERSION_ENABLE`                | `boolean`  | `false`                                      | Enable service version header       |
| `SERVER_SERVICE_VERSION_HEADER_NAME`           | `string`   | `x-service-version`                          | Service version header name         |
| `SERVER_SERVICE_VERSION`                       | `string`   | `${npm_package_version}` or `0.0.0`          | Service version value               |
| `SERVER_SKIP_HEALTHZ_CHECKS_VALIDATION`        | `boolean`  | `false`                                      | Skip health checks if added         |
| `npm_package_name`                             | `string`   | `@catbee/utils`                              | Package name (from package.json)    |
| `npm_package_version`                          | `string`   | `0.0.0`                                      | Package version (from package.json) |

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
  .withHealthCheck({ path: '/health', detailed: true })
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

// Register health checks
server.registerHealthCheck('database', async () => await checkDatabaseConnection());
server.registerHealthCheck('storage', () => require('fs').existsSync('./data'));

// Check if server is ready
const isReady = await server.ready();
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
  .withHealthCheck(options: HealthCheckOptions)
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
  .registerHealthCheck(name: string, fn: () => Promise<boolean> | boolean): this
  .ready(): Promise<boolean>
  .getApp(): Express
  .getServer(): http.Server | https.Server | null
  .setBaseRouter(router: Router): this
  .createRouter(prefix?: string): Router
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
- `ready()` - Check if all health checks pass (returns `Promise<boolean>`)
- `waitUntilReady()` - Wait for server initialization to complete

---

## Health Checks

Register health checks for monitoring dependencies.

**Method Signature:**

```ts
server.registerHealthCheck(name: string, fn: () => Promise<boolean> | boolean)
```

**Examples:**

```ts
server.registerHealthCheck('storage', () => fs.existsSync('./data'));
server.registerHealthCheck('database', async () => {
  try {
    await db.ping();
    return true;
  } catch {
    return false;
  }
});

// Check readiness programmatically
const isReady = await server.ready();
if (isReady) {
  console.log('All health checks passed');
}
```

---

## Graceful Shutdown

Enable zero-downtime deployments.

**Method Signature:**

```ts
server.enableGracefulShutdown(signals?: NodeJS.Signals[])
```

**Examples:**

```ts
server.enableGracefulShutdown();

async function shutdown() {
  await server.stop();
  process.exit(0);
}
```

---

## Routing & Middleware

### Set Global Base Router

```ts
import { Router } from 'express';
const baseRouter = Router();

const config = new ServerConfigBuilder()
  .withGlobalPrefix('/api/v1')
  .build();
const server = new ExpressServer(config);

server.setBaseRouter(baseRouter);
```

### Create Router

```ts
const router = server.createRouter('/users');
router.get('/', handler);
```

### Register Route

```ts
server.registerRoute(['get'], '/status', (req, res) => res.json({ ok: true }));
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
- `withHealthCheck(opts: HealthCheckOptions)` - Configure health check endpoints
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
