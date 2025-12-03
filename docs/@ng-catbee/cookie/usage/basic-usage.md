---
id: basic-usage
title: Basic Cookie Operations
sidebar_position: 1
---

:::tip

```typescript
import { CatbeeCookieService, CatbeeSsrCookieService } from '@ng-catbee/cookie';
```

Use `CatbeeCookieService` in browser contexts and `CatbeeSsrCookieService` for server-side rendering (SSR) scenarios.
:::

:::warning
`CatbeeSsrCookieService` provides only getting cookies from the request headers and does not support setting cookies.
:::

## Setting Cookies

### Simple Cookie

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-user',
  standalone: true,
  template: `
    <button (click)="saveUsername()">Save Username</button>
  `
})
export class UserComponent {
  private cookieService = inject(CatbeeCookieService);

  saveUsername() {
    this.cookieService.set('username', 'john_doe');
  }
}
```

### Cookie with Expiration

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-session',
  standalone: true,
  template: `
    <button (click)="createSession()">Create Session</button>
  `
})
export class SessionComponent {
  private cookieService = inject(CatbeeCookieService);

  createSession() {
    // Expires in 7 days
    this.cookieService.set('sessionId', 'abc123xyz', {
      expires: 7
    });
  }

  createTemporaryToken() {
    // Expires at specific date
    const expirationDate = new Date('2025-12-31');
    this.cookieService.set('tempToken', 'token123', {
      expires: expirationDate
    });
  }
}
```

### Secure Cookies

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-auth',
  standalone: true,
  template: `
    <button (click)="saveAuthToken()">Save Auth Token</button>
  `
})
export class AuthComponent {
  private cookieService = inject(CatbeeCookieService);

  saveAuthToken() {
    this.cookieService.set('authToken', 'secure-token-123', {
      secure: true,      // HTTPS only
      sameSite: 'Strict', // CSRF protection
      expires: 1         // 1 day
    });
  }
}
```

## Getting Cookies

### Basic Retrieval

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <div>
      @if (username) {
        <p>Welcome back, {{ username }}!</p>
      } @else {
        <p>Please log in</p>
      }
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private cookieService = inject(CatbeeCookieService);
  username: string | null = null;

  ngOnInit() {
    this.username = this.cookieService.get('username');
  }
}
```

### With Default Value

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div>
      <p>Language: {{ language }}</p>
    </div>
  `
})
export class SettingsComponent {
  private cookieService = inject(CatbeeCookieService);

  get language(): string {
    // Returns existing value or 'en' if not found
    return this.cookieService.getWithDefault('language', 'en');
  }
}
```

### Checking Existence

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-welcome',
  standalone: true,
  template: `
    <div>
      @if (isFirstVisit) {
        <div class="welcome-banner">
          <h2>Welcome to our site!</h2>
          <button (click)="dismissBanner()">Got it</button>
        </div>
      }
    </div>
  `
})
export class WelcomeComponent {
  private cookieService = inject(CatbeeCookieService);

  get isFirstVisit(): boolean {
    return !this.cookieService.has('returning_visitor');
  }

  dismissBanner() {
    this.cookieService.set('returning_visitor', 'true', {
      expires: 365
    });
  }
}
```

## Deleting Cookies

### Single Cookie

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: `
    <button (click)="logout()">Logout</button>
  `
})
export class LogoutComponent {
  private cookieService = inject(CatbeeCookieService);

  logout() {
    this.cookieService.delete('authToken');
    this.cookieService.delete('sessionId');
  }
}
```

### Delete with Options

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-cleanup',
  standalone: true,
  template: `
    <button (click)="clearCookies()">Clear Cookies</button>
  `
})
export class CleanupComponent {
  private cookieService = inject(CatbeeCookieService);

  clearCookies() {
    // Must match the path/domain used when setting
    this.cookieService.delete('sitePrefs', {
      path: '/',
      domain: '.example.com'
    });
  }
}
```

### Multiple Cookies

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-reset',
  standalone: true,
  template: `
    <button (click)="resetUserData()">Reset All Data</button>
    <button (click)="clearAllCookies()">Clear Everything</button>
  `
})
export class ResetComponent {
  private cookieService = inject(CatbeeCookieService);

  resetUserData() {
    // Delete specific cookies
    this.cookieService.deleteMany([
      'username',
      'sessionId',
      'preferences',
      'cart'
    ]);
  }

  clearAllCookies() {
    // Delete all accessible cookies
    this.cookieService.deleteAll();
  }
}
```

## Conditional Setting

### Set Only If Not Exists

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-analytics',
  standalone: true,
  template: `
    <div>User ID: {{ userId }}</div>
  `
})
export class AnalyticsComponent implements OnInit {
  private cookieService = inject(CatbeeCookieService);
  userId = '';

  ngOnInit() {
    // Set a unique user ID only on first visit
    this.cookieService.setIfNotExists('userId', this.generateUserId(), {
      expires: 365
    });

    this.userId = this.cookieService.get('userId') || '';
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

## Working with Cookie Lists

### Get All Cookies

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-debug',
  standalone: true,
  template: `
    <div class="debug-panel">
      <h3>All Cookies</h3>
      <pre>{{ allCookies | json }}</pre>

      <h3>Cookie Names</h3>
      <ul>
        @for (name of cookieNames; track name) {
          <li>{{ name }}</li>
        }
      </ul>
    </div>
  `
})
export class DebugComponent {
  private cookieService = inject(CatbeeCookieService);

  get allCookies(): Record<string, string> {
    return this.cookieService.getAll();
  }

  get cookieNames(): string[] {
    return this.cookieService.keys();
  }

  get cookieValues(): string[] {
    return this.cookieService.values();
  }

  get cookieEntries(): [string, string][] {
    return this.cookieService.entries();
  }
}
```

### Iterate Over Cookies

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-cookie-manager',
  standalone: true,
  template: `
    <div>
      @for (entry of cookies; track entry[0]) {
        <div class="cookie-item">
          <strong>{{ entry[0] }}</strong>: {{ entry[1] }}
          <button (click)="deleteCookie(entry[0])">Delete</button>
        </div>
      }
    </div>
  `
})
export class CookieManagerComponent implements OnInit {
  private cookieService = inject(CatbeeCookieService);
  cookies: [string, string][] = [];

  ngOnInit() {
    this.loadCookies();
  }

  loadCookies() {
    this.cookies = this.cookieService.entries();
  }

  deleteCookie(name: string) {
    this.cookieService.delete(name);
    this.loadCookies();
  }
}
```

## Path and Domain Configuration

### Different Paths

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-paths',
  standalone: true,
  template: `...`
})
export class PathsComponent {
  private cookieService = inject(CatbeeCookieService);

  saveGlobalPreference() {
    // Available across entire site
    this.cookieService.set('siteTheme', 'dark', {
      path: '/'
    });
  }

  saveAdminPreference() {
    // Only available under /admin
    this.cookieService.set('adminLayout', 'compact', {
      path: '/admin'
    });
  }
}
```

### Subdomain Cookies

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-domains',
  standalone: true,
  template: `...`
})
export class DomainsComponent {
  private cookieService = inject(CatbeeCookieService);

  saveForCurrentDomain() {
    // Only for current subdomain (e.g., app.example.com)
    this.cookieService.set('appData', 'value');
  }

  saveForAllSubdomains() {
    // Available for all subdomains (*.example.com)
    this.cookieService.set('sharedData', 'value', {
      domain: '.example.com'
    });
  }
}
```

## Next Steps

- [Type-Safe Methods](./type-safe-methods) - Work with JSON, booleans, numbers, and enums
- [Advanced Features](./advanced-features) - Partial updates, bulk operations, and more
- [API Reference](../api-reference) - Complete method documentation
