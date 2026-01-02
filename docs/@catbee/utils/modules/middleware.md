---
slug: ../middleware
---

# Middleware

Express middleware collection for handling common web server requirements including request identification, timing, error handling, timeouts, and request context management.

## API

- [**`requestId(options: { headerName?: string; exposeHeader?: boolean; generator?: () => string; })`**](#requestid) - Attaches a unique request ID to each request for tracing and correlation between logs.
- [**`responseTime(options?: { addHeader?: boolean; logOnComplete?: boolean; })`**](#responsetime) - Measures request processing time and adds it to response headers or logs.
- [**`timeout(timeoutMs = 30000)`**](#timeout) - Aborts requests that take too long to process.
- [**`setupRequestContext(options?: { headerName?: string; autoLog?: boolean })`**](#setuprequestcontext) - Creates an Express middleware that initializes a per-request context.
- [**`errorHandler(options?: ErrorHandlerOptions)`**](#errorhandler) - Global error handling middleware with enhanced features.
- [**`healthCheck(options?: { path?: string; checks?: Array<{ name: string; check: () => Promise<boolean> | boolean }>; detailed?: boolean })`**](#healthcheck) - Health check middleware for service status and custom checks.

### Interfaces and Types

```ts
export type Middleware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export interface ErrorHandlerOptions {
  /** Whether to log errors (default: true) */
  logErrors?: boolean;
  /** Whether to include error details in non-production (default: false) */
  includeDetails?: boolean;
}
```

## Example Usage

```ts
import { requestId, responseTime, errorHandler } from '@catbee/utils/middleware';

app.use(requestId({ headerName: 'X-Request-ID' })); // Sets X-Request-ID header and attaches req.id
app.use(setupRequestContext({ autoLog: true, headerName: 'X-Request-ID' })); // Initializes request context with req.id and sets up logging
app.use(responseTime({ addHeader: true, logOnComplete: true })); // Adds X-Response-Time header
app.use(timeout(10_000)); // Aborts requests taking longer than 10 seconds
// ... your route handlers here ...
app.use(errorHandler({ logErrors: true, includeDetails: false })); // Last middleware
```

---

## Function Documentation & Usage Examples

### `requestId()`

Attaches a unique request ID to each request for tracing and correlation between logs.

**Method Signature:**

```ts
function requestId(options?: {
  headerName?: string;        // default: 'X-Request-ID'
  exposeHeader?: boolean;     // default: true
  generator?: () => string;   // default: uuid
}): Middleware;
```

**Parameters:**

- `options?: object` - Configuration options
  - `headerName?: string` - Header name for request ID (default: 'X-Request-ID')
  - `exposeHeader?: boolean` - Whether to expose the header in response (default: true)
  - `generator?: () => string` - Custom ID generator function (default: uuid)

**Returns:**

- `Middleware` - Express middleware function

**Example:**

```ts
import express from 'express';
import { requestId } from '@catbee/utils/middleware';
const app = express();

// Basic usage with defaults
app.use(requestId());

// Custom configuration
app.use(
  requestId({
    headerName: 'Correlation-ID',
    exposeHeader: true,
    generator: () => `req-${Date.now()}`
  })
);
```

---

### `responseTime()`

Measures request processing time and adds it to response headers or logs.

**Method Signature:**

```ts
function responseTime(options?: {
  addHeader?: boolean;      // default: true
  logOnComplete?: boolean;  // default: false
}): Middleware;
```

**Parameters:**

- `options?: object` - Configuration options
  - `addHeader?: boolean` - Whether to add X-Response-Time header (default: true)
  - `logOnComplete?: boolean` - Whether to log timing info (default: false)

**Returns:**

- `Middleware` - Express middleware function

**Example:**

```ts
import express from 'express';
import { responseTime } from '@catbee/utils/middleware';
const app = express();

// Basic usage
app.use(responseTime());

// With logging enabled
app.use(
  responseTime({
    addHeader: true,
    logOnComplete: true
  })
);
```

---

### `timeout()`

Aborts requests that take too long to process.

**Method Signature:**

```ts
function timeout(timeoutMs = 30000): Middleware;
```

**Parameters:**

- `timeoutMs?: number` - Timeout in milliseconds (default: 30000)

**Returns:**

- `Middleware` - Express middleware function

**Example:**

```ts
import express from 'express';
import { timeout } from '@catbee/utils/middleware';
const app = express();

// Default 30-second timeout
app.use(timeout());

// Custom 5-second timeout
app.use(timeout(5000));
```

---

### `setupRequestContext()`

Creates an Express middleware that initializes a per-request context.

**Method Signature:**

```ts
function setupRequestContext(options?: {
  headerName?: string;  // default: 'x-request-id'
  autoLog?: boolean;    // default: true
}): Middleware;
```

**Parameters:**

- `options?: object` - Optional configuration
  - `headerName?: string` - Header to look for request ID (default: 'x-request-id')
  - `autoLog?: boolean` - Whether to log automatically when context is initialized (default: true)

**Returns:**

- `Middleware` - Express middleware function

**Example:**

```ts
import express from 'express';
import { setupRequestContext } from '@catbee/utils/middleware';
const app = express();

// Basic usage with defaults
app.use(setupRequestContext());

// Custom configuration
app.use(
  setupRequestContext({
    headerName: 'correlation-id',
    autoLog: false
  })
);
```

---

### `errorHandler()`

Global error handling middleware with enhanced features.

**Method Signature:**

```ts
function errorHandler(options?: ErrorHandlerOptions): Middleware;

interface ErrorHandlerOptions {
  logErrors?: boolean;       // default: true
  includeDetails?: boolean;  // default: false
}
```

**Parameters:**

- `options?: ErrorHandlerOptions` - Error handler options
  - `logErrors?: boolean` - Whether to log errors (default: true)
  - `includeDetails?: boolean` - Whether to include error details in non-production (default: false)

**Returns:**

- `Middleware` - Express error-handling middleware function

**Example:**

```ts
import express from 'express';
import { errorHandler } from '@catbee/utils/middleware';
const app = express();

// Basic error handler
app.use(errorHandler());

// Custom error handler with stack traces in development
app.use(
  errorHandler({
    logErrors: true,
    includeDetails: process.env.NODE_ENV !== 'production'
  })
);
```

---

### `healthCheck()`

Health check middleware for service status and custom checks.

**Method Signature:**

```ts
function healthCheck(options?: {
  path?: string;                                                           // default: '/healthz'
  checks?: Array<{ name: string; check: () => Promise<boolean> | boolean }>;
  detailed?: boolean;                                                      // default: true
}): Middleware;
```

**Parameters:**

- `options?: object` - Health check options
  - `path?: string` - Health check endpoint path (default: '/healthz')
  - `checks?: Array<{name: string; check: () => Promise<boolean> | boolean}>` - Custom health checks to run
  - `detailed?: boolean` - Show detailed check results (default: true)

**Returns:**

- `Middleware` - Express middleware function

**Example:**

```ts
import express from 'express';
import { healthCheck } from '@catbee/utils/middleware';
const app = express();

// Basic health check
app.use(healthCheck());

// Health check with custom checks
app.use(
  healthCheck({
    path: '/health',
    detailed: true,
    checks: [
      {
        name: 'database',
        check: async () => {
          // Check database connection
          return db.isConnected();
        }
      },
      {
        name: 'redis',
        check: async () => {
          // Check Redis connection
          return redis.ping();
        }
      }
    ]
  })
);
```
