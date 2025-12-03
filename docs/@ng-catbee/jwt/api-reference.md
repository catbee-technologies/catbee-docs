---
id: api-reference
title: API Reference
sidebar_position: 4
---

## CatbeeJwtService

The main service for JWT operations.

:::tip Service Aliases

```typescript
import { CatbeeJwtService } from '@ng-catbee/jwt';
```

You can also import the service using the shorter alias:

```typescript
import { JwtService } from '@ng-catbee/jwt';
```

Both `CatbeeJwtService` and `JwtService` refer to the same service.
:::

---

## API Summary

- [**`decodePayload<T = JwtPayload>(token: string): T | null`**](#decodepayload) - Decodes the JWT payload with type safety.
- [**`decode<T = JwtPayload>(token: string): DecodedJwt<T> | null`**](#decode) - Decodes the complete JWT including header, payload, and signature.
- [**`isExpired(token: string | JwtPayload, offsetSeconds: number = 0): boolean`**](#isexpired) - Checks if the token has expired.
- [**`isValidFormat(token: string): boolean`**](#isvalidformat) - Validates the JWT format (must have 3 parts separated by dots).
- [**`getExpirationDate(token: string | JwtPayload): Date | null`**](#getexpirationdate) - Gets the expiration date from the token's `exp` claim.
- [**`getIssuedDate(token: string | JwtPayload): Date | null`**](#getissueddate) - Gets the issued-at date from the token's `iat` claim.
- [**`getRemainingTime(token: string | JwtPayload): number | null`**](#getremainingtime) - Gets the remaining time in seconds until the token expires.
- [**`watchExpiry(token: string, tickMs: number = 1000): Observable<number>`**](#watchexpiry) - Returns an observable that emits the remaining time until expiration at specified intervals.
- [**`getClaim<T>(token: string, claim: string): T | null`**](#getclaim) - Extracts a specific claim from the token payload with type safety.

## Types

### `JwtPayload`

Standard JWT payload interface.

```typescript
interface JwtPayload {
  iss?: string;  // Issuer
  sub?: string;  // Subject
  aud?: string | string[];  // Audience
  exp?: number;  // Expiration time (seconds since epoch)
  nbf?: number;  // Not before (seconds since epoch)
  iat?: number;  // Issued at (seconds since epoch)
  jti?: string;  // JWT ID
  [key: string]: any;  // Custom claims
}
```

### `DecodedJwt<T>`

Complete decoded JWT structure.

```typescript
export interface DecodedJwt<T = JwtPayload> {
  /** JWT header containing algorithm and token type */
  header: {
    alg: string;
    typ: string;
    [key: string]: any;
  };
  payload: T; // Decoded payload of type T
  signature: string; // Signature part of the JWT
  raw: string; // Original JWT string
}
```

### Methods

### `decodePayload()`

Decodes the JWT payload with type safety.

**Method Signature:**

```typescript
decodePayload<T = JwtPayload>(token: string): T | null
```

**Parameters:**

- `token` - The JWT token string

**Returns:** The decoded payload of type `T`, or `null` if decoding fails

**Example:**

```typescript
interface UserPayload extends JwtPayload {
  userId: string;
  email: string;
}

const payload = jwtService.decodePayload<UserPayload>(token);
if (payload) {
  console.log(payload.email);
}
```

---

### `decode()`

Decodes the complete JWT including header, payload, and signature.

**Method Signature:**

```typescript
decode<T = JwtPayload>(token: string): DecodedJwt<T> | null
```

**Parameters:**

- `token` - The JWT token string

**Returns:** Object containing `header`, `payload`, and `signature`, or `null` if decoding fails

**Example:**

```typescript
const decoded = jwtService.decode(token);
if (decoded) {
  console.log(decoded.header.alg);
  console.log(decoded.payload);
  console.log(decoded.signature);
}
```

---

### `isExpired()`

Checks if the token has expired.

**Method Signature:**

```typescript
isExpired(token: string | JwtPayload, offsetSeconds: number = 0): boolean
```

**Parameters:**

- `token` - The JWT token string
- `offsetSeconds` - Optional offset in seconds to check expiration earlier (default: 0)

**Returns:** `true` if expired, `false` otherwise

**Example:**

```typescript
// Check if token is expired
if (jwtService.isExpired(token)) {
  console.log('Token has expired');
}

// Check if token will expire in the next 60 seconds
if (jwtService.isExpired(token, 60)) {
  console.log('Token will expire soon');
}
```

---

### `isValidFormat()`

Validates the JWT format (must have 3 parts separated by dots).

**Method Signature:**

```typescript
isValidFormat(token: string): boolean
```

**Parameters:**

- `token` - The JWT token string

**Returns:** `true` if valid format, `false` otherwise

**Example:**

```typescript
if (!jwtService.isValidFormat(token)) {
  console.error('Invalid JWT format');
}
```

---

### `getExpirationDate()`

Gets the expiration date from the token's `exp` claim.

**Method Signature:**

```typescript
getExpirationDate(token: string | JwtPayload): Date | null
```

**Parameters:**

- `token` - The JWT token string

**Returns:** Date object representing expiration time, or `null` if not found

**Example:**

```typescript
const expDate = jwtService.getExpirationDate(token);
if (expDate) {
  console.log('Expires on:', expDate.toLocaleString());
}
```

---

### `getIssuedDate()`

Gets the issued-at date from the token's `iat` claim.

**Method Signature:**

```typescript
getIssuedDate(token: string | JwtPayload): Date | null
```

**Parameters:**

- `token` - The JWT token string

**Returns:** Date object representing issued time, or `null` if not found

**Example:**

```typescript
const issuedDate = jwtService.getIssuedDate(token);
if (issuedDate) {
  console.log('Issued at:', issuedDate.toLocaleString());
}
```

---

### `getRemainingTime()`

Gets the remaining time in seconds until the token expires.

**Method Signature:**

```typescript
getRemainingTime(token: string | JwtPayload): number | null
```

**Parameters:**

- `token` - The JWT token string

**Returns:** Number of seconds until expiration, or `null` if no expiration claim

**Example:**

```typescript
const remaining = jwtService.getRemainingTime(token);
if (remaining !== null) {
  console.log(`Token expires in ${remaining} seconds`);
}
```

---

### `watchExpiry()`

Returns an observable that emits the remaining time until expiration at specified intervals.

**Method Signature:**

```typescript
watchExpiry(token: string, tickMs: number = 1000): Observable<number>
```

**Parameters:**

- `token` - The JWT token string
- `tickMs` - Interval in milliseconds to emit updates (default: 1000)

**Returns:** Observable that emits remaining seconds

**Example:**

```typescript
jwtService.watchExpiry(token, 1000)
  .pipe(takeUntil(destroy$))
  .subscribe(remaining => {
    console.log(`${remaining}s remaining`);
    if (remaining <= 0) {
      // Token expired - logout user
    }
  });
```

---

### `getClaim()`

Extracts a specific claim from the token payload with type safety.

**Method Signature:**

```typescript
getClaim<T>(token: string, claim: string): T | null
```

**Parameters:**

- `token` - The JWT token string
- `claim` - The claim name to extract

**Returns:** The claim value of type `T`, or `null` if not found

**Example:**

```typescript
const role = jwtService.getClaim<string>(token, 'role');
const permissions = jwtService.getClaim<string[]>(token, 'permissions');
const userId = jwtService.getClaim<number>(token, 'userId');
```
