---
id: installation
title: Installation
sidebar_position: 2
---

## Installation

Install the package via npm:

```bash
npm install @ng-catbee/jwt
```

## Zero Configuration

This library works out of the box with zero configuration. Simply inject the `JwtService` and start using it.

### Standalone Apps (Angular 17+)

No additional setup required. Just inject the service directly:

```typescript
import { Component, inject } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `...`
})
export class AppComponent {
  private jwtService = inject(JwtService);

  decodeToken(token: string) {
    return this.jwtService.decodePayload(token);
  }
}
```

### Module-based Apps

The service is provided in root by default, so no module imports needed:

```typescript
import { Component, inject } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';

@Component({
  selector: 'app-root',
  template: `...`
})
export class AppComponent {
  private jwtService = inject(JwtService);
}
```

## Next Steps

- [Usage Guide](./usage/basic-usage) - Learn how to decode and validate JWTs
- [API Reference](./api-reference) - Complete API documentation
