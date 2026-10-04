---
slug: ../healthz-server
sidebar_position: 3
---

# Healthz Server

Standalone, production-grade HTTP health-check server designed specifically for Kubernetes container probes (`livenessProbe`, `readinessProbe`, `startupProbe`) and microservice orchestration.

## Overview

In containerized and cloud-native environments, running health probes on your main application server can lead to false-positive pod restarts or delayed traffic removal. Heavy application traffic, long-running middleware, or saturated request queues can cause Kubernetes probe timeouts even when the underlying process is healthy.

`HealthzServer` runs as an isolated, lightweight HTTP server (default port `8282`) that exposes dedicated endpoints for liveness, readiness, and startup checks with cooperative timeout cancellation, graceful shutdown draining, and process singleton enforcement.

## API Summary

- [**`HealthzServer.start(opts?: CatbeeHealthzServerConfig): Promise<HealthzAddressInfo | null>`**](#healthzserverstart) – Boot the probe server singleton.
- [**`HealthzServer.stop(): Promise<void>`**](#healthzserverstop) – Gracefully stop the probe server and close idle sockets.
- [**`HealthzServer.setReady(ready: boolean): void`**](#healthzserversetready) – Signal whether the service is ready to receive traffic.
- [**`HealthzServer.isReady(): boolean`**](#healthzserverisready) – Check if the service is currently marked ready.
- [**`HealthzServer.isStarted(): boolean`**](#healthzserverisstarted) – Check if the server has started listening.
- [**`HealthzServer.getInstance(): HealthzServer | undefined`**](#healthzservergetinstance) – Retrieve the active singleton instance.
- [**`getDefaultHealthzConfig(): ResolvedHealthzConfig`**](#getdefaulthealthzconfig) – Get default configuration resolved from environment variables.
- [**`resolveConfig(userConfig?: CatbeeHealthzServerConfig): ResolvedHealthzConfig`**](#resolveconfig) – Merge user options with environment defaults.

---

## Probe Endpoints

| Probe         | Default Path | Kubernetes Probe | HTTP Status   | Purpose & Behavior                                                                                     |
| ------------- | ------------ | ---------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| **Liveness**  | `/healthz`   | `livenessProbe`  | `200` / `503` | Verifies the process is alive and responsive. Runs lightweight checks.                                 |
| **Readiness** | `/readyz`    | `readinessProbe` | `200` / `503` | Verifies service can accept traffic. Fast-fails if not ready or shutting down; runs `readinessChecks`. |
| **Startup**   | `/startupz`  | `startupProbe`   | `200` / `503` | Verifies server has successfully bound and started listening.                                          |

### Kubernetes Probe Best Practices

- **Liveness (`/healthz`)**: Keep these checks **extremely lightweight** (e.g., event loop responsive, process healthy). **Do not place external dependencies** (databases, Redis, downstream microservices) here. If a shared database experiences a brief network blip, failing liveness triggers Kubernetes to kill and restart the container, which can cause cascading restart storms across your cluster.
- **Readiness (`/readyz`)**: Place external dependency checks (database connections, Redis ping, cache warmup) here via `readinessChecks`. If a dependency goes down, Kubernetes temporarily removes the pod from service endpoints without killing the container, allowing it to recover cleanly once connectivity is restored.
- **Startup (`/startupz`)**: Verifies that slow-starting applications have initialized before Kubernetes begins polling liveness and readiness probes.

---

## Quick Start

```ts
import { HealthzServer } from '@catbee/utils/healthz-server';

// 1. Boot the probe server on port 8282
const address = await HealthzServer.start({
  port: 8282,
  // Lightweight liveness checks
  checks: [
    { name: 'process', check: () => true }
  ],
  // Dependency checks on readiness only
  readinessChecks: [
    {
      name: 'database',
      check: async (signal) => {
        return await db.ping({ signal });
      }
    },
    {
      name: 'redis',
      check: async (signal) => {
        return await redis.ping({ signal });
      }
    }
  ],
  shutdownDelayMs: 5000 // Give load balancer time to drain traffic
});

console.log(`Healthz probe server running on port ${address?.port}`);

// 2. Mark ready once your app has loaded routes and warmed caches
HealthzServer.setReady(true);
```

---

## Function Documentation & Usage Examples

### `HealthzServer.start()`

Boots the standalone HTTP health-check server. Enforces a process-wide singleton (`Symbol.for('CatbeeHealthzServer')`). If a server is already running in this process, it returns `null`.

**Method Signature:**

```ts
static async start(opts?: CatbeeHealthzServerConfig): Promise<HealthzAddressInfo | null>
```

**Parameters:**

- `opts` _(optional)_: Configuration options for the server.

**Returns:**

- `Promise<HealthzAddressInfo | null>`: The bound address information (`address`, `family`, `port`), or `null` if an instance is already active.

**Example:**

```ts
import { HealthzServer } from '@catbee/utils/healthz-server';

const addr = await HealthzServer.start({
  port: 8282,
  healthzPath: '/healthz',
  readyzPath: '/readyz',
  startupzPath: '/startupz'
});

if (addr) {
  console.log(`Probe server listening on ${addr.address}:${addr.port}`);
}
```

---

### `HealthzServer.setReady()`

Updates the traffic readiness flag. When `setReady(false)` is set, `/readyz` immediately returns `503 Service Unavailable`.

**Method Signature:**

```ts
static setReady(ready: boolean): void
```

**Parameters:**

- `ready`: `true` to accept traffic, `false` to fast-fail readiness probes.

**Example:**

```ts
import { HealthzServer } from '@catbee/utils/healthz-server';

// Initially not ready during migrations or cache warmup
HealthzServer.setReady(false);

await runDatabaseMigrations();
await prefetchCaches();

// Ready for ingress traffic
HealthzServer.setReady(true);
```

---

### `HealthzServer.isReady()`

Returns whether the service is currently marked as ready for traffic.

**Method Signature:**

```ts
static isReady(): boolean
```

---

### `HealthzServer.isStarted()`

Returns whether the probe server has successfully started and bound its port (used for `/startupz`).

**Method Signature:**

```ts
static isStarted(): boolean
```

---

### `HealthzServer.stop()`

Gracefully shuts down the probe server. Closes idle keep-alive connections immediately using `closeIdleConnections()` so sockets do not stall termination.

**Method Signature:**

```ts
static async stop(): Promise<void>
```

**Example:**

```ts
await HealthzServer.stop();
```

---

### `HealthzServer.getInstance()`

Returns the current active `HealthzServer` singleton instance, or `undefined` if not running.

**Method Signature:**

```ts
static getInstance(): HealthzServer | undefined
```

---

### `getDefaultHealthzConfig()`

Loads default Healthz server configuration resolved from environment variables (`HEALTHZ_*` with fallback to `SERVER_*` and `HOST`).

**Method Signature:**

```ts
function getDefaultHealthzConfig(): ResolvedHealthzConfig
```

---

### `resolveConfig()`

Merges user-supplied configuration with environment-resolved defaults. Undefined user options do not overwrite resolved defaults.

**Method Signature:**

```ts
function resolveConfig(userConfig?: CatbeeHealthzServerConfig): ResolvedHealthzConfig
```

**Parameters:**

- `userConfig` _(optional)_: User-defined configuration object.

**Returns:**

- Complete `ResolvedHealthzConfig` with all defaults applied.

---

## Cooperative Timeout Cancellation (`AbortSignal`)

All check functions receive an `AbortSignal` triggered when `checkTimeoutMs` (default `5000ms`) is exceeded:

```ts
readinessChecks: [
  {
    name: 'database',
    check: async (signal) => {
      // Pass the signal to native fetch, pg, mysql2, redis, etc.
      const res = await fetch('https://db.internal/health', { signal });
      return res.ok;
    }
  }
]
```

Check functions support two failure modes:

1. **Return boolean**: Return `true` for healthy, `false` for unhealthy.
2. **Throw error**: Thrown errors are caught, duration is tracked, and the error message is included in the structured JSON response.

---

## Graceful Shutdown & Load Balancer Draining

When the process receives `SIGTERM` or `SIGINT`:

1. `HealthzServer` immediately flips `ready` to `false`.
2. Any subsequent `/readyz` probes instantly return `503 Service Unavailable`.
3. The server waits `shutdownDelayMs` (default `5000ms`, configurable via `HEALTHZ_SHUTDOWN_DELAY_MS`). This gives the Kubernetes Ingress / Service endpoints controller time to detect that the pod is unready and drain active traffic before container termination.
4. Active keep-alive sockets are closed via `closeIdleConnections()`, and the HTTP listener is closed cleanly.

---

## Probe Response Format

Probe endpoints return structured JSON with strict HTTP headers:

- `Content-Type: application/json; charset=utf-8`
- `Cache-Control: no-cache, no-store, must-revalidate`
- `X-Content-Type-Options: nosniff`
- Supports `HEAD` probes (returns identical headers with empty body)
- Returns `405 Method Not Allowed` for unsupported HTTP methods (e.g. `POST`, `PUT`)

### Healthy Response (`200 OK`)

```json
{
  "status": "ok",
  "timestamp": "2026-10-04T12:00:00.000Z",
  "uptimeSeconds": 142,
  "checks": [
    {
      "name": "database",
      "ok": true,
      "durationMs": 3
    }
  ]
}
```

### Unhealthy Response (`503 Service Unavailable`)

```json
{
  "status": "unhealthy",
  "timestamp": "2026-10-04T12:00:01.000Z",
  "uptimeSeconds": 143,
  "checks": [
    {
      "name": "database",
      "ok": false,
      "durationMs": 5001,
      "error": "Check timed out after 5000ms"
    }
  ]
}
```

---

## Kubernetes Manifest Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: app
          image: my-app:latest
          ports:
            - containerPort: 3000
              name: http
            - containerPort: 8282
              name: healthz
          startupProbe:
            httpGet:
              path: /startupz
              port: 8282
            failureThreshold: 30
            periodSeconds: 2
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8282
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 3
          readinessProbe:
            httpGet:
              path: /readyz
              port: 8282
            initialDelaySeconds: 2
            periodSeconds: 5
            timeoutSeconds: 3
```

---

## Environment Variables

`HealthzServer` supports granular configuration with automatic fallbacks:

| Environment Variable        | Type       | Default       | Fallback Variables                                | Description                                   |
| --------------------------- | ---------- | ------------- | ------------------------------------------------- | --------------------------------------------- |
| `HEALTHZ_HOST`              | `string`   | `'0.0.0.0'`   | `SERVER_HEALTHZ_HOST`, `SERVER_HOST`, `HOST`      | Interface to bind                             |
| `HEALTHZ_PORT`              | `number`   | `8282`        | `SERVER_HEALTHZ_PORT`                             | Probe server HTTP port                        |
| `HEALTHZ_PATH`              | `string`   | `'/healthz'`  | `SERVER_HEALTHZ_PATH`, `SERVER_HEALTH_CHECK_PATH` | Liveness probe endpoint path                  |
| `HEALTHZ_READYZ_PATH`       | `string`   | `'/readyz'`   | `SERVER_READYZ_PATH`                              | Readiness probe endpoint path                 |
| `HEALTHZ_STARTUPZ_PATH`     | `string`   | `'/startupz'` | `SERVER_STARTUPZ_PATH`                            | Startup probe endpoint path                   |
| `HEALTHZ_DETAILED`          | `boolean`  | `true`        | `SERVER_HEALTH_CHECK_DETAILED_OUTPUT`             | Include individual check results in JSON      |
| `HEALTHZ_CHECK_TIMEOUT_MS`  | `duration` | `5000`        | —                                                 | Per-check timeout in milliseconds             |
| `HEALTHZ_SHUTDOWN_DELAY_MS` | `duration` | `5000`        | —                                                 | Graceful shutdown drain delay in milliseconds |

---

## Interfaces & Types

```ts
export type HealthCheckFn = (signal?: AbortSignal) => boolean | Promise<boolean>;
export type ReadinessCheckFn = (signal?: AbortSignal) => boolean | Promise<boolean>;

export interface NamedCheck {
  name: string;
  check: (signal?: AbortSignal) => boolean | Promise<boolean>;
}

export interface CheckResult {
  name: string;
  ok: boolean;
  durationMs: number;
  error?: string;
}

export type ProbeStatus = 'ok' | 'unhealthy';

export interface ProbeResponse {
  status: ProbeStatus;
  timestamp: string;
  uptimeSeconds: number;
  checks?: CheckResult[];
}

export interface CatbeeHealthzServerConfig {
  host?: string;
  port?: number;
  healthzPath?: string;
  readyzPath?: string;
  startupzPath?: string;
  detailed?: boolean;
  checks?: NamedCheck[];
  readinessChecks?: NamedCheck[];
  onHealthCheck?: HealthCheckFn;
  onReadinessCheck?: ReadinessCheckFn;
  checkTimeoutMs?: number;
  shutdownDelayMs?: number;
}

export interface HealthzAddressInfo {
  address: string;
  family: string;
  port: number;
}
```
