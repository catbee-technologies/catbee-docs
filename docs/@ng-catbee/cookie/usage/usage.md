---
id: usage
title: Usage
sidebar_position: 3
---

# Usage Examples

This section contains practical examples for common cookie management use cases.

## Quick Links

- [Basic Usage](./basic-usage) - Basic cookie operations (get, set, delete)
- [Type-Safe Methods](./type-safe-methods) - Working with JSON, booleans, numbers, and enums
- [Advanced Features](./advanced-features) - UpdateJson, bulk operations, and watchers

:::tip

```typescript
import { CatbeeCookieService, CatbeeSsrCookieService } from '@ng-catbee/cookie';
```

Use `CatbeeCookieService` in browser contexts and `CatbeeSsrCookieService` for server-side rendering (SSR) scenarios.
:::

:::warning
`CatbeeSsrCookieService` provides only getting cookies from the request headers and does not support setting cookies.
:::

## Common Use Cases

### User Preferences

Store and retrieve user settings like theme, language, and notification preferences using type-safe JSON methods.

```typescript
const preferences = cookieService.getJsonWithDefault('userPrefs', {
  theme: 'light',
  language: 'en',
  notifications: true
}, { expires: 30 });
```

### Session Management

Track user sessions with unique identifiers and expiration handling.

```typescript
const sessionId = cookieService.getWithDefault(
  'sessionId',
  generateSessionId(),
  undefined,
  { expires: 1 }
);
```

### Feature Flags

Use boolean cookies to enable/disable features.

```typescript
const betaEnabled = cookieService.getBooleanWithDefault('betaFeatures', false);
```

### Shopping Cart

Persist shopping cart data across sessions.

```typescript
const cart = cookieService.getArrayWithDefault<CartItem>('cart', [], {
  expires: 7
});
```

### Analytics Tracking

Track page views and user behavior.

```typescript
const viewCount = cookieService.getNumberWithDefault('pageViews', 0);
cookieService.set('pageViews', (viewCount + 1).toString());
```

### GDPR Compliance

Manage cookie consent preferences.

```typescript
const consent = cookieService.getJsonWithDefault('cookieConsent', {
  necessary: true,
  analytics: false,
  marketing: false
}, { expires: 365 });
```

## Next Steps

Explore detailed examples in the following sections:

- **[Basic Usage](./basic-usage)** - Learn fundamental cookie operations
- **[Type-Safe Methods](./type-safe-methods)** - Use strongly-typed getters and setters
- **[Advanced Features](./advanced-features)** - Master complex cookie patterns
