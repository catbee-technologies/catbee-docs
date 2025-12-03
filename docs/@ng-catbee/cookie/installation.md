---
id: installation
title: Installation and Configuration
sidebar_position: 2
---

## Installation

Install the package via npm:

```bash
npm install @ng-catbee/cookie
```

:::tip

```typescript
import { CatbeeCookieService, CatbeeSsrCookieService } from '@ng-catbee/cookie';
```

Use `CatbeeCookieService` in browser contexts and `CatbeeSsrCookieService` for server-side rendering (SSR) scenarios.
:::

:::warning
`CatbeeSsrCookieService` provides only getting cookies from the request headers and does not support setting cookies.
:::

## Configuration

The library works with zero configuration, but you can optionally set global defaults for all cookie operations.

### Standalone Apps

Use the `provideCatbeeCookie` function in your app configuration:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCatbeeCookie } from '@ng-catbee/cookie';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCatbeeCookie({
      path: '/',
      secure: true,
      sameSite: 'Lax',
    })
  ]
};
```

### Module-based Apps

Import and configure the `CatbeeCookieModule` in your root module:

```typescript
import { NgModule } from '@angular/core';
import { CatbeeCookieModule } from '@ng-catbee/cookie';

@NgModule({
  imports: [
    CatbeeCookieModule.forRoot({
      path: '/',
      secure: true,
      sameSite: 'Lax'
    })
  ]
})
export class AppModule { }
```

## Configuration Options

All configuration options are optional. If not provided, sensible defaults will be used.

```typescript
interface CookieOptions {
  expires?: Date | number;  // Expiration date or days from now
  path?: string;            // Cookie path (default: '/')
  domain?: string;          // Cookie domain (default: current domain)
  secure?: boolean;         // HTTPS only (default: false)
  sameSite?: 'Lax' | 'Strict' | 'None'; // CSRF protection (default: 'Lax')
  partitioned?: boolean;    // Partitioned cookie (CHIPS)
}
```

### Configuration Priority

Options follow this priority order:

1. **Method-level options** - Passed to individual method calls
2. **Global configuration** - Set via `provideCatbeeCookie` or `forRoot`
3. **Built-in defaults** - Library defaults

Example:

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `...`
})
export class ExampleComponent {
  private cookieService = inject(CatbeeCookieService);

  saveCookie() {
    // This will use global config for path/sameSite
    // but override with secure: false
    this.cookieService.set('user', 'john', {
      secure: false,  // Overrides global config
      expires: 7      // Adds to global config
    });
  }
}
```

## Zero Configuration Usage

You can start using the service immediately without any configuration:

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <button (click)="save()">Save Cookie</button>
    <button (click)="load()">Load Cookie</button>
    <p>{{ value }}</p>
  `
})
export class AppComponent {
  private cookieService = inject(CatbeeCookieService);
  value = '';

  save() {
    this.cookieService.set('username', 'john_doe', { expires: 7 });
  }

  load() {
    this.value = this.cookieService.get('username') || 'Not found';
  }
}
```

## Server-Side Rendering (SSR)

The library is fully compatible with Server-Side Rendering. It gracefully handles the absence of the browser's `document` object on the server.

When running on the server:

- Cookie reads return `null` or default values
- Cookie writes are safely ignored
- No runtime errors occur

```typescript
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CatbeeCookieService, CatbeeSsrCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-ssr-safe',
  standalone: true,
  template: `...`
})
export class SsrSafeComponent {
  private cookieService = inject(CatbeeCookieService);
  private ssrCookieService = inject(CatbeeSsrCookieService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    const username = this.cookieService.get('username'); // null on server

    if (isPlatformServer(this.platformId)) { // Optional check for server
      console.log('Running on server');
      const username = this.ssrCookieService.get('username');
      console.log('Username from SSR cookie service:', username);
    }
  }
}
```

## Next Steps

- [Usage Guide](./usage/basic-usage) - Learn basic cookie operations
- [API Reference](./api-reference) - Complete API documentation
- [Type-Safe Methods](./usage/type-safe-methods) - Work with JSON, numbers, booleans, and enums
