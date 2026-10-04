---
sidebar_position: 1
---

# Config

Global configuration management for logging, cache, and server settings. Provides type-safe access and mutation of config values, with sensible defaults and comprehensive environment variable support.

## API Summary

- [**`getCatbeeGlobalConfig(): CatbeeConfig`**](#getcatbeeglobalconfig) – get the current global configuration object.
- [**`setCatbeeGlobalConfig(value: Partial<CatbeeConfig>): void`**](#setcatbeeglobalconfig) – update global configuration at runtime.
- [**`getCatbeeServerGlobalConfig(): CatbeeGlobalServerConfig`**](#getcatbeeserverglobalconfig) – get the current server configuration.
- [**`setCatbeeServerGlobalConfig(value: Partial<CatbeeGlobalServerConfig>): void`**](#setcatbeeserverglobalconfig) – update server configuration at runtime.
- [**`getConfig()`**](#getconfig-deprecated) – ⚠️ **deprecated** alias for `getCatbeeGlobalConfig`.
- [**`setConfig(value)`**](#setconfig-deprecated) – ⚠️ **deprecated** alias for `setCatbeeGlobalConfig`.

---

## Function Documentation & Usage Examples

### `getCatbeeGlobalConfig()`

Returns the current global Catbee configuration including logger, cache, and server settings.

**Method Signature:**

```ts
function getCatbeeGlobalConfig(): CatbeeConfig;
```

**Returns:**

- The current Catbee configuration object (deep cloned).

**Examples:**

```ts
import { getCatbeeGlobalConfig } from '@catbee/utils/config';

const config = getCatbeeGlobalConfig();
console.log(config.logger.level); // "info" or "debug"
console.log(config.cache.defaultTtl); // 3600000
console.log(config.server.port); // 3000
```

---

### `setCatbeeGlobalConfig()`

Updates global configuration settings at runtime. Merges the provided partial configuration with the existing one using deep object merge.

**Method Signature:**

```ts
function setCatbeeGlobalConfig(value: Partial<CatbeeConfig>): void;
```

**Parameters:**

- `value`: Partial configuration object to merge.

**Examples:**

```ts
import { setCatbeeGlobalConfig } from '@catbee/utils/config';

setCatbeeGlobalConfig({
  logger: {
    level: 'debug',
    name: 'my-app',
    pretty: true,
    colorize: true
  },
  cache: {
    defaultTtl: 7200000 // 2 hours
  }
});
```

---

### `getCatbeeServerGlobalConfig()`

Returns the current server-specific configuration.

**Method Signature:**

```ts
function getCatbeeServerGlobalConfig(): CatbeeGlobalServerConfig;
```

**Returns:**

- The current server configuration object.

**Examples:**

```ts
import { getCatbeeServerGlobalConfig } from '@catbee/utils/config';

const serverConfig = getCatbeeServerGlobalConfig();
console.log(serverConfig.port); // 3000
console.log(serverConfig.host); // "0.0.0.0"
console.log(serverConfig.appName); // "catbee_server"
```

---

### `setCatbeeServerGlobalConfig()`

Updates server configuration settings at runtime. Merges the provided partial server configuration with the existing one.

**Method Signature:**

```ts
function setCatbeeServerGlobalConfig(value: Partial<CatbeeGlobalServerConfig>): void;
```

**Parameters:**

- `value`: Partial server configuration object to merge.

**Examples:**

```ts
import { setCatbeeServerGlobalConfig } from '@catbee/utils/config';

setCatbeeServerGlobalConfig({
  port: 8080,
  cors: true,
  helmet: true,
  rateLimit: {
    enable: true,
    max: 200
  }
});
```

---

### `getConfig()` (Deprecated)

:::warning Deprecated
Use [`getCatbeeGlobalConfig()`](#getcatbeeglobalconfig) instead.
:::

Alias for `getCatbeeGlobalConfig()`. Returns the current configuration object.

**Method Signature:**

```ts
function getConfig(): CatbeeConfig;
```

---

### `setConfig()` (Deprecated)

:::warning Deprecated
Use [`setCatbeeGlobalConfig()`](#setcatbeeglobalconfig) instead.
:::

Alias for `setCatbeeGlobalConfig()`. Updates configuration settings at runtime.

**Method Signature:**

```ts
function setConfig(value: Partial<CatbeeConfig>): void;
```

---

## Default Values

All configuration options have sensible defaults loaded from environment variables:

### Logger Defaults

```ts
logger: {
  level: 'info',            // 'debug' in dev/test, otherwise 'info'
  name: '@catbee/utils',    // or npm package name
  pretty: false,            // pretty-print logging
  colorize: true,           // colorize pretty output
  singleLine: false,        // single-line pretty output
  dir: ''                   // log file directory (empty = disabled)
}
```

**Logger Environment Variables**

For configuring logger behavior via environment variables, see the [Logger documentation](logger#environment-variables).

### Cache Defaults

```ts
cache: {
  defaultTtl: 3600000      // 1 hour in milliseconds
}
```

**Cache Environment Variables**

| Environment Variable        | Type     | Default/Value | Description                                    |
| --------------------------- | -------- | ------------- | ---------------------------------------------- |
| `CACHE_DEFAULT_TTL_SECONDS` | `number` | `3600`        | Default cache TTL in seconds (converted to ms) |

### Server Defaults

```ts
server: {
  port: 3000,
  host: '0.0.0.0',
  cors: false,
  helmet: false,
  compression: false,
  bodyParser: {
    json: { limit: '1mb' },
    urlencoded: { extended: true, limit: '1mb' }
  },
  cookieParser: false,
  isMicroservice: false,
  appName: 'catbee_server',
  globalHeaders: {},
  rateLimit: {
    enable: false,
    windowMs: 900000, // 15 minutes
    max: 100,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  },
  requestLogging: {
    enable: true, // true in dev, false in production
    ignorePaths: ['/healthz', '/favicon.ico', '/metrics', '/docs', '/.well-known'],
    skipNotFoundRoutes: true
  },
  trustProxy: false,
  openApi: {
    enable: false,
    mountPath: '/docs',
    verbose: false,
    withGlobalPrefix: false
  },
  healthCheck: {
    path: '/healthz',
    detailed: true,
    withGlobalPrefix: false
  },
  requestTimeout: 0,
  responseTime: {
    enable: false,
    addHeader: true,
    logOnComplete: false
  },
  requestId: {
    headerName: 'x-request-id',
    exposeHeader: true,
    generator: () => uuid()
  },
  metrics: {
    enable: false,
    path: '/metrics',
    withGlobalPrefix: false
  },
  serviceVersion: {
    enable: false,
    headerName: 'x-service-version',
    version: '0.0.0'
  },
  skipHealthzChecksValidation: false
}
```

**Server Environment Variables**

For overriding server config options via environment variables, see the [Express Server documentation](server#server-environment-variables).

### Healthz Server Defaults

Default configuration for the standalone Kubernetes probe server resolved by `getDefaultHealthzConfig()`:

```ts
healthz: {
  host: '0.0.0.0',           // HEALTHZ_HOST (fallback: SERVER_HEALTHZ_HOST, SERVER_HOST, HOST)
  port: 8282,                // HEALTHZ_PORT (fallback: SERVER_HEALTHZ_PORT)
  healthzPath: '/healthz',   // HEALTHZ_PATH (fallback: SERVER_HEALTHZ_PATH, SERVER_HEALTH_CHECK_PATH)
  readyzPath: '/readyz',     // HEALTHZ_READYZ_PATH (fallback: SERVER_READYZ_PATH)
  startupzPath: '/startupz', // HEALTHZ_STARTUPZ_PATH (fallback: SERVER_STARTUPZ_PATH)
  detailed: true,            // HEALTHZ_DETAILED (fallback: SERVER_HEALTH_CHECK_DETAILED_OUTPUT)
  checks: [],
  checkTimeoutMs: 5000,      // HEALTHZ_CHECK_TIMEOUT_MS
  shutdownDelayMs: 5000      // HEALTHZ_SHUTDOWN_DELAY_MS
}
```

**Healthz Server Environment Variables**

| Environment Variable        | Type       | Default     | Description                                                                       |
| --------------------------- | ---------- | ----------- | --------------------------------------------------------------------------------- |
| `HEALTHZ_HOST`              | `string`   | `0.0.0.0`   | Host to bind (fallback: `SERVER_HEALTHZ_HOST`, `SERVER_HOST`, `HOST`)             |
| `HEALTHZ_PORT`              | `number`   | `8282`      | Port for standalone probe server (fallback: `SERVER_HEALTHZ_PORT`)                |
| `HEALTHZ_PATH`              | `string`   | `/healthz`  | Liveness probe path (fallback: `SERVER_HEALTHZ_PATH`, `SERVER_HEALTH_CHECK_PATH`) |
| `HEALTHZ_READYZ_PATH`       | `string`   | `/readyz`   | Readiness probe path (fallback: `SERVER_READYZ_PATH`)                             |
| `HEALTHZ_STARTUPZ_PATH`     | `string`   | `/startupz` | Startup probe path (fallback: `SERVER_STARTUPZ_PATH`)                             |
| `HEALTHZ_DETAILED`          | `boolean`  | `true`      | Include individual check results in JSON responses                                |
| `HEALTHZ_CHECK_TIMEOUT_MS`  | `duration` | `5000`      | Per-check timeout before aborting via AbortSignal                                 |
| `HEALTHZ_SHUTDOWN_DELAY_MS` | `duration` | `5000`      | Graceful shutdown delay for LB draining after unreadying                          |

For comprehensive documentation, see the [Healthz Server documentation](healthz-server).

## Types

### CatbeeConfig

Main configuration interface combining logger, cache, and server settings.

```ts
interface CatbeeConfig {
  logger?: {
    level?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
    name?: string;
    pretty?: boolean;
    colorize?: boolean;
    singleLine?: boolean;
    dir?: string;
  };
  cache: {
    defaultTtl: number; // milliseconds
  };
  server: CatbeeGlobalServerConfig;
}
```

### Logger Configuration

```ts
interface LoggerConfig {
  level?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'; /** Logging level */
  name?: string; /** Logger instance name */
  pretty?: boolean; /** Enable pretty-print logging */
  colorize?: boolean; /** Enable colorized output for pretty-print */
  singleLine?: boolean; /** Single line output for pretty-print (default: false) */
  dir?: string; /** Directory to write log files (empty = disabled) */
}
```

### Cache Configuration

```ts
interface CacheConfig {
  /** Default TTL (time to live) in milliseconds */
  defaultTtl: number;
}
```

### Server Configuration

The server configuration is extensive. Key interfaces include:

```ts
interface CatbeeGlobalServerConfig {
  port: number;
  host?: string;
  cors?: boolean | CorsOptions;
  helmet?: boolean | HelmetOptions;
  compression?: boolean | CompressionOptions;
  bodyParser?: {
    json?: JsonParserOptions;
    urlencoded?: UrlencodedParserOptions;
  };
  cookieParser?: boolean | CookieParseOptions;
  trustProxy?: boolean | number | string | string[];
  staticFolders?: StaticFolderConfig[];
  isMicroservice?: boolean;
  appName?: string;
  globalHeaders?: Record<string, string | (() => string)>;
  rateLimit?: RateLimitConfig;
  requestLogging?: RequestLoggingConfig;
  healthCheck?: HealthCheckConfig;
  requestTimeout?: number;
  responseTime?: ResponseTimeConfig;
  requestId?: RequestIdConfig;
  globalPrefix?: string;
  openApi?: OpenApiConfig;
  metrics?: MetricsConfig;
  serviceVersion?: ServiceVersionConfig;
  https?: HttpsConfig;
  skipHealthzChecksValidation?: boolean;
}
```

For detailed server configuration options, see the [Express Server documentation](server)
