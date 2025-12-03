---
id: cookie-builder
title: CookieBuilder
sidebar_position: 4
---

The `CookieBuilder` class provides a fluent API for creating RFC 6265 compliant cookie strings with full type safety and validation.

:::tip

```typescript
import { CookieBuilder } from '@ng-catbee/cookie';
```

Use `CookieBuilder` when you need fine-grained control over cookie string generation, especially for custom Set-Cookie headers or advanced cookie configurations.
:::

### CookieBuilder Methods

| Method                                                                          | Description                           | Example                                |
| ------------------------------------------------------------------------------- | ------------------------------------- | -------------------------------------- |
| `create(name: string, value?: string, encoding?: CookieBuilderEncodingOptions)` | Creates a new builder                 | `CookieBuilder.create('user', 'john')` |
| `withName(name: string)`                                                        | Sets cookie name                      | `.withName('session')`                 |
| `withValue(value: string)`                                                      | Sets cookie value                     | `.withValue('token123')`               |
| `withExpires(date: Date \| number)`                                             | Sets expiration (Date or ms from now) | `.withExpires(86400000)`               |
| `withMaxAge(seconds: number)`                                                   | Sets Max-Age in seconds               | `.withMaxAge(3600)`                    |
| `withDomain(domain: string)`                                                    | Sets Domain attribute                 | `.withDomain('.example.com')`          |
| `withPath(path: string)`                                                        | Sets Path attribute                   | `.withPath('/app')`                    |
| `withSecure(bool?: boolean)`                                                    | Sets Secure flag                      | `.withSecure()`                        |
| `withHttpOnly(bool?: boolean)`                                                  | Sets HttpOnly flag                    | `.withHttpOnly()`                      |
| `withSameSite(mode: 'Strict' \| 'Lax' \| 'None')`                               | Sets SameSite attribute               | `.withSameSite('Strict')`              |
| `withPartitioned(bool?: boolean)`                                               | Sets Partitioned flag (CHIPS)         | `.withPartitioned()`                   |
| `withPriority(priority: 'Low' \| 'Medium' \| 'High')`                           | Sets Priority (Chrome)                | `.withPriority('High')`                |
| `build()`                                                                       | Returns cookie string                 | `.build()`                             |
| `toString()`                                                                    | Alias for build()                     | `.toString()`                          |

### Creating a Cookie Builder

**Static Method:**

```typescript
static create(
  name: string,
  value?: string,
  encoding?: CookieBuilderEncodingOptions
): CookieBuilder
```

**Parameters:**

- `name` - Cookie name (required, non-empty)
- `value` - Cookie value (defaults to empty string)
- `encoding` - Optional custom encoding strategies for name/value

**Example:**

```typescript
const cookieString = CookieBuilder.create('session', 'abc123')
  .withPath('/')
  .withSecure()
  .withHttpOnly()
  .withSameSite('Strict')
  .withMaxAge(3600)
  .build();

// "session=abc123; Max-Age=3600; Path=/; Secure; HttpOnly; SameSite=Strict"
```

### Builder Methods

#### `withName(name: string): this`

Sets the cookie name.

**Parameters:**

- `name` - Cookie name (required, non-empty after trimming)

**Throws:** Error if name is empty, not a string, or only whitespace

```typescript
const builder = CookieBuilder.create('temp', 'value')
  .withName('permanent');
```

#### `withValue(value: string): this`

Sets the cookie value (empty string allowed).

**Parameters:**

- `value` - Cookie value

```typescript
const builder = CookieBuilder.create('counter', '0')
  .withValue('1');
```

#### `withExpires(expires: Date | number): this`

Sets the expiration timestamp.

**Parameters:**

- `expires` - Date object or milliseconds from now

**Throws:** Error if Date is invalid or number is not finite

```typescript
// Using Date object
const builder = CookieBuilder.create('event', 'data')
  .withExpires(new Date('2025-12-31'));

// Using milliseconds (7 days from now)
const builder2 = CookieBuilder.create('temp', 'value')
  .withExpires(7 * 24 * 60 * 60 * 1000);
```

#### `withMaxAge(seconds: number): this`

Sets Max-Age in seconds.

**Parameters:**

- `seconds` - Maximum age in seconds (must be finite, negative values set to 0)

**Throws:** Error if seconds is not a finite number

```typescript
const builder = CookieBuilder.create('session', 'token')
  .withMaxAge(3600); // 1 hour
```

#### `withDomain(domain: string): this`

Sets the Domain attribute.

**Parameters:**

- `domain` - Domain where the cookie is accessible

```typescript
const builder = CookieBuilder.create('shared', 'data')
  .withDomain('.example.com');
```

#### `withPath(path: string): this`

Sets the Path attribute.

**Parameters:**

- `path` - URL path where the cookie is accessible

```typescript
const builder = CookieBuilder.create('cart', 'items')
  .withPath('/shop');
```

#### `withSecure(secure?: boolean): this`

Enables or disables the Secure flag.

**Parameters:**

- `secure` - Whether to set Secure flag (defaults to true)

```typescript
const builder = CookieBuilder.create('sensitive', 'data')
  .withSecure(); // Secure enabled

const builder2 = CookieBuilder.create('public', 'info')
  .withSecure(false); // Secure disabled
```

#### `withHttpOnly(httpOnly?: boolean): this`

Enables or disables the HttpOnly flag.

**Parameters:**

- `httpOnly` - Whether to set HttpOnly flag (defaults to true)

```typescript
const builder = CookieBuilder.create('auth', 'token')
  .withHttpOnly(); // HttpOnly enabled
```

#### `withSameSite(mode: 'Strict' | 'Lax' | 'None'): this`

Sets the SameSite attribute.

:::warning Auto-Secure for SameSite=None
Setting `SameSite=None` automatically forces `Secure=true` due to browser security requirements.
:::

**Parameters:**

- `mode` - SameSite mode ('Strict', 'Lax', or 'None')

```typescript
const builder = CookieBuilder.create('csrf', 'token')
  .withSameSite('Strict');

// SameSite=None automatically enables Secure
const builder2 = CookieBuilder.create('cross-site', 'data')
  .withSameSite('None'); // Secure is automatically set to true
```

#### `withPartitioned(partitioned?: boolean): this`

Enables CHIPS (Cookies Having Independent Partitioned State) `Partitioned` attribute.

**Parameters:**

- `partitioned` - Whether to set Partitioned flag (defaults to true)

**See:** [Chrome CHIPS Documentation](https://developer.chrome.com/docs/privacy-sandbox/chips/)

```typescript
const builder = CookieBuilder.create('embedded', 'iframe-data')
  .withPartitioned()
  .withSecure()
  .withSameSite('None');
```

#### `withPriority(priority: 'Low' | 'Medium' | 'High'): this`

Sets the Priority attribute (Chrome-specific, non-standard).

**Parameters:**

- `priority` - Cookie priority ('Low', 'Medium', or 'High')

```typescript
const builder = CookieBuilder.create('important', 'data')
  .withPriority('High');

const builder2 = CookieBuilder.create('optional', 'analytics')
  .withPriority('Low');
```

#### `build(): string`

Builds and returns the final RFC 6265 compliant cookie string.

**Returns:** Cookie string suitable for Set-Cookie header or document.cookie

**Throws:** Error if cookie name is missing or empty

```typescript
const cookieString = CookieBuilder.create('user', 'john')
  .withPath('/')
  .withSecure()
  .withHttpOnly()
  .withSameSite('Strict')
  .withPriority('High')
  .withMaxAge(86400)
  .build();

// Result: "user=john; Max-Age=86400; Path=/; Secure; HttpOnly; SameSite=Strict; Priority=High"
```

### CookieBuilderEncodingOptions

Custom encoding options for cookie name and value.

```typescript
interface CookieBuilderEncodingOptions {
  /** Custom encoder for cookie name (default: encodeURIComponent) */
  readonly encodeName?: (name: string) => string;

  /** Custom encoder for cookie value (default: encodeURIComponent) */
  readonly encodeValue?: (value: string) => string;
}
```

**Example:**

```typescript
// Custom encoding for special characters
const customEncoding: CookieBuilderEncodingOptions = {
  encodeName: (name) => name.replace(/[^a-zA-Z0-9]/g, '_'),
  encodeValue: (value) => btoa(value) // Base64 encoding
};

const cookieString = CookieBuilder.create('my-cookie', 'sensitive data', customEncoding)
  .withPath('/')
  .build();
```

### Complete Example

```typescript
import { CookieBuilder } from '@ng-catbee/cookie';

export class CookieBuilderExample {
  createAuthCookie(token: string): string {
    return CookieBuilder.create('auth_token', token)
      .withPath('/')
      .withDomain('.example.com')
      .withSecure()
      .withHttpOnly()
      .withSameSite('Strict')
      .withPriority('High')
      .withMaxAge(3600) // 1 hour
      .build();
  }

  createCrossSiteCookie(data: string): string {
    return CookieBuilder.create('cross_site_data', data)
      .withPath('/')
      .withSecure() // Required for SameSite=None
      .withSameSite('None')
      .withPartitioned() // CHIPS support
      .withPriority('Medium')
      .withMaxAge(86400) // 24 hours
      .build();
  }

  createTemporaryCookie(value: string, expiryDate: Date): string {
    return CookieBuilder.create('temp', value)
      .withPath('/')
      .withExpires(expiryDate)
      .withPriority('Low')
      .build();
  }
}
```

---

## Type Definitions

### CookieSameSite

```typescript
type CookieSameSite = 'Strict' | 'Lax' | 'None';
```

### CookiePriority

```typescript
type CookiePriority = 'Low' | 'Medium' | 'High';
```

---
