---
slug: ../logger
---

# Logger

Structured logging with Pino. This module provides a robust logging system with features like hierarchical loggers, request-scoped logging, error handling, and sensitive data redaction.

## API Summary

- [**`getLogger(newInstance = false): Logger`**](#getlogger) - Retrieves the current logger instance from the request context or falls back to the global logger.
- [**`createChildLogger(bindings: Record<string, unknown>, parentLogger?: Logger): Logger`**](#createchildlogger) - Creates a child logger with additional context that will be included in all log entries.
- [**`createRequestLogger(requestId: string, additionalContext = {}): Logger`**](#createrequestlogger) - Creates a request-scoped logger with request ID and stores it in the async context.
- [**`logError(error: unknown, message?: string, context?: Record<string, unknown>): void`**](#logerror) - Utility to safely log errors with proper stack trace extraction (supports any `unknown` error).
- [**`resetLogger(): void`**](#resetlogger) - Resets the global root logger singleton for testing or reconfiguration.
- [**`getRedactCensor(): (key: string) => boolean`**](#getredactcensor) - Gets the current global redaction censor function used for log redaction.
- [**`setRedactCensor(censor: (key: string) => boolean): void`**](#setredactcensor) - Sets the global redaction censor function used throughout the application for log redaction.
- [**`addRedactFields(fields: string[]): void`**](#addredactfields) - **Deprecated:** Use `addSensitiveFields` instead. Extends the current redaction function with additional fields to redact.
- [**`setSensitiveFields(fields: string[]): void`**](#setsensitivefields) - Replaces the default list of sensitive fields with a new list.
- [**`addSensitiveFields(fields: string[]): void`**](#addsensitivefields) - Adds additional field names to the default sensitive fields list.

## Environment Variables

| Environment Variable        | Type      | Default/Value                         | Description                                                        |
| --------------------------- | --------- | ------------------------------------- | ------------------------------------------------------------------ |
| `LOGGER_LEVEL`              | `string`  | `debug` in dev/test, otherwise `info` | Logging level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`) |
| `LOGGER_NAME`               | `string`  | `@catbee/utils`                       | Logger instance name                                               |
| `LOGGER_PRETTY`             | `boolean` | `false`                               | Enable pretty-print logging                                        |
| `LOGGER_PRETTY_COLORIZE`    | `boolean` | `true`                                | Enable colorized output for pretty-print                           |
| `LOGGER_PRETTY_SINGLE_LINE` | `boolean` | `false`                               | Single-line output for pretty-print                                |
| `LOGGER_DIR`                | `string`  | `''` (empty)                          | Directory to write log files (empty = disabled)                    |

## Interfaces & Types

```ts
import type { Logger as PinoLogger, Level } from 'pino';

// Main logger type (Pino logger)
export type Logger = PinoLogger;

// Logger level for application-wide logging
export type LoggerLevel = Level; // 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'

/**
 * Logger levels for application-wide logging.
 *
 * @deprecated Use `LoggerLevel` instead.
 */
export type LoggerLevels = LoggerLevel;
```

## Example Usage

```ts
import { getLogger } from '@catbee/utils/logger';

const logger = getLogger();

// Different log levels
logger.trace('Very detailed info for debugging');
logger.debug('Debugging information');
logger.info('Normal application information');
logger.warn('Warning conditions');
logger.error('Error conditions');
logger.fatal('Critical errors');

// Structured logging with context
logger.info({ userId: '123', action: 'login' }, 'User logged in');
```

## Function Documentation & Usage Examples

### `getLogger()`

Retrieves the current logger instance from the request context or falls back to the global logger.

**Method Signature:**

```ts
function getLogger(newInstance = false): Logger;
```

**Parameters:**

- `newInstance` (optional): If `true`, returns a fresh logger instance without any request context or global configuration. Default is `false`.

**Returns:**

- The current `Logger` instance, or a new instance if `newInstance` is `true`.

**Example:**

```ts
import { getLogger } from '@catbee/utils/logger';

// Get current logger (request-scoped if in request context, or global)
const logger = getLogger();
logger.info('App started');
logger.debug({ user: 'john' }, 'User logged in');

// Create a completely fresh logger instance without request context
const freshLogger = getLogger(true);
freshLogger.info('Logging outside of request context');
```

---

### `createChildLogger()`

Creates a child logger with additional context that will be included in all log entries.

**Method Signature:**

```ts
function createChildLogger(bindings: Record<string, any>, parentLogger?: Logger): Logger;
```

**Parameters:**

- `bindings`: Key-value pairs to include in all log entries from this logger.
- `parentLogger` (optional): The parent logger to derive from. If not provided, uses the global logger.

**Returns:**

- A new `Logger` instance with the specified bindings.

**Example:**

```ts
import { getLogger, createChildLogger } from '@catbee/utils/logger';

// Create a module-specific logger
const moduleLogger = createChildLogger({ module: 'payments' });
moduleLogger.info('Processing payment');

// Child loggers can be nested
const transactionLogger = createChildLogger(
  {
    transactionId: 'tx_12345'
  },
  moduleLogger
);
transactionLogger.info('Transaction completed');
```

---

### `createRequestLogger()`

Creates a request-scoped logger with request ID and stores it in the async context.

**Method Signature:**

```ts
function createRequestLogger(requestId: string, additionalContext: Record<string, any> = {}): Logger;
```

**Parameters:**

- `requestId`: Unique identifier for the request (e.g., UUID).
- `additionalContext` (optional): Additional key-value pairs to include in all log entries for this request (default: {}).

**Returns:**

- A new `Logger` instance scoped to the request.

**Example:**

```ts
import { createRequestLogger, uuid } from '@catbee/utils/logger';

// In an API request handler:
function handleRequest(req, res) {
  const requestId = req.headers['x-request-id'] || uuid();
  const logger = createRequestLogger(requestId, {
    userId: req.user?.id,
    path: req.path
  });

  logger.info('Request received');
  // All subsequent calls to getLogger() in this request will return this logger
}
```

---

### `logError()`

Utility to safely log errors with proper stack trace extraction. Accepts any `unknown` error value, extracting message and stack traces if it is an `Error` instance, or formatting it safely otherwise.

**Method Signature:**

```ts
function logError(error: unknown, message?: string, context?: Record<string, unknown>): void;
```

**Parameters:**

- `error`: The error object, string, or unknown value to log.
- `message` (optional): Additional message to log alongside the error.
- `context` (optional): Additional structured context properties.

**Example:**

```ts
import { logError } from '@catbee/utils/logger';

try {
  throw new Error('Something went wrong');
} catch (error) {
  logError(error, 'Failed during processing', { operation: 'dataSync' });
}

// Works with string or unknown errors too
logError('Invalid input', 'Validation error');
```

---

### `resetLogger()`

Resets the cached global root logger singleton (`_global[GLOBAL_LOGGER_KEY]`). Next time `getLogger()` is called, a fresh logger is instantiated according to the latest configuration and environment variables. Essential for unit tests and dynamic reconfiguration.

**Method Signature:**

```ts
function resetLogger(): void;
```

**Example:**

```ts
import { resetLogger, getLogger } from '@catbee/utils/logger';

// Clean up logger state between tests
afterEach(() => {
  resetLogger();
});
```

---

## Redaction and Security

`@catbee/utils` provides an intelligent, production-ready redaction engine designed to prevent sensitive credential and PII leakage in logs while eliminating false-positive redactions on benign words.

### Redaction Architecture

1. **Delimiter and Token-Aware Matching**:
   Path segments are parsed using both delimiter boundaries (`_`, `-`) and camelCase transitions (`(?<=[a-z0-9])(?=[A-Z])`). This completely eliminates false-positive redactions on words like:
   - `author` (does not match `auth`)
   - `oauth` (does not match `auth`)
   - `opinion` (does not match `pin`)

   While reliably redacting compound and nested sensitive fields:
   - `userAuth`, `user_auth`, `custom_api_key`, `dbPassword`, `client_secret`

2. **Expanded Default Sensitive Fields**:
   The built-in sensitive fields list covers authentication tokens, secrets, session cookies, and payment/PII data:
   - `password`, `token`, `secret`, `authorization`, `auth`
   - `api_key`, `apiKey`, `apikey`, `private_key`, `access_token`, `refresh_token`, `client_secret`
   - `key`, `passphrase`, `otp`, `api_secret`, `token_secret`
   - `cookie`, `cookies`, `set-cookie`, `session_id`
   - `credit_card`, `card_number`, `cvv`, `cvc`, `ssn`, `pin`

3. **Nested URL Parameter Redaction**:
   Query parameters containing sensitive keys are censored across both root and nested URL fields (`req.url`, `request.originalUrl`, `url`, `uri`, `href`, `redirect_uri`). Dynamic patterns automatically escape regex metacharacters.

4. **Deep Wildcard Paths (Depth 5)**:
   By default, `generateDeepPaths(field, 5)` expands wildcard paths up to 5 levels deep (e.g. `*.*.*.*.*.password`), protecting deeply nested payload objects automatically.

---

### `getRedactCensor()`

Gets the current global redaction censor function used for log redaction.

**Method Signature:**

```ts
function getRedactCensor(): (value: unknown, path: string[], sensitiveFields?: string[]) => unknown;
```

**Returns:**

- The current redaction censor function.

**Example:**

```ts
import { getRedactCensor } from '@catbee/utils/logger';

const currentCensor = getRedactCensor();
```

---

### `setRedactCensor()`

Sets the global redaction censor function used throughout the application for log redaction.

**Method Signature:**

```ts
function setRedactCensor(fn: (value: unknown, path: string[], sensitiveFields?: string[]) => unknown): void;
```

**Parameters:**

- `fn`: A function that takes a value, its path in the object, and an optional list of sensitive fields, returning a redacted string or value.

**Example:**

```ts
import { setRedactCensor } from '@catbee/utils/logger';

// Custom censor that redacts only specific values
setRedactCensor((value, path, sensitiveFields) => {
  if (path.includes('password')) return '***';
  if (typeof value === 'string' && value.includes('secret')) return '***';
  return value;
});
```

---

### `setSensitiveFields()`

Replaces the default list of sensitive fields with a new list, invalidating the internal redaction cache.

**Method Signature:**

```ts
function setSensitiveFields(fields: string[]): void;
```

**Parameters:**

- `fields`: An array of field names to set as the new sensitive fields list.

**Example:**

```ts
import { setSensitiveFields } from '@catbee/utils/logger';

// Replace default sensitive fields with a custom list
setSensitiveFields(['password', 'ssn', 'credit_card']);
```

---

### `addSensitiveFields()`

Adds additional field names to the default sensitive fields list. Automatically expands camelCase, snake_case, and kebab-case variations.

**Method Signature:**

```ts
function addSensitiveFields(fields: string[]): void;
```

**Parameters:**

- `fields`: An array of field names to add to the existing sensitive fields list.

**Example:**

```ts
import { addSensitiveFields } from '@catbee/utils/logger';

// Add domain-specific sensitive fields
addSensitiveFields(['socialSecurityNumber', 'medicalRecordNumber', 'encryptionKey']);
```

---

### `addRedactFields()`

:::warning Deprecated
This function is deprecated. Use [`addSensitiveFields()`](#addsensitivefields) instead.
:::

Extends the current redaction function with additional fields to redact.

**Method Signature:**

```ts
function addRedactFields(fields: string[]): void;
```

**Parameters:**

- `fields`: An array of field names to add to the redaction list.

**Example:**

```ts
import { addRedactFields } from '@catbee/utils/logger';

addRedactFields(['customerId', 'accountNumber']);
```
