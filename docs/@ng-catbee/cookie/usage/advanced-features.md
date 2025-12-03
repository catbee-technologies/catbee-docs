---
id: advanced-features
title: Advanced Features
sidebar_position: 3
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

## Partial JSON Updates

### UpdateJson Method

The `updateJson` method allows you to update specific properties of a JSON cookie without replacing the entire object.

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

interface AppSettings {
  theme: string;
  language: string;
  notifications: boolean;
  sidebar: boolean;
  fontSize: number;
  autoSave: boolean;
}

@Component({
  selector: 'app-settings-manager',
  standalone: true,
  template: `
    <div class="settings">
      <h2>Application Settings</h2>

      <div class="setting-group">
        <h3>Appearance</h3>
        <button (click)="toggleTheme()">Toggle Theme</button>
        <button (click)="increaseFontSize()">Increase Font Size</button>
      </div>

      <div class="setting-group">
        <h3>Behavior</h3>
        <button (click)="toggleNotifications()">
          {{ settings.notifications ? 'Disable' : 'Enable' }} Notifications
        </button>
        <button (click)="toggleAutoSave()">
          {{ settings.autoSave ? 'Disable' : 'Enable' }} Auto-Save
        </button>
      </div>

      <button (click)="resetSettings()">Reset to Defaults</button>
    </div>
  `
})
export class SettingsManagerComponent {
  private cookieService = inject(CatbeeCookieService);

  readonly defaultSettings: AppSettings = {
    theme: 'light',
    language: 'en',
    notifications: true,
    sidebar: true,
    fontSize: 14,
    autoSave: true
  };

  settings: AppSettings = { ...this.defaultSettings };

  ngOnInit() {
    this.settings = this.cookieService.getJsonWithDefault(
      'appSettings',
      this.defaultSettings,
      { expires: 365 }
    );
  }

  toggleTheme() {
    const newTheme = this.settings.theme === 'light' ? 'dark' : 'light';

    // Update only the theme property
    this.cookieService.updateJson(
      'appSettings',
      { theme: newTheme },
      this.defaultSettings
    );

    this.settings.theme = newTheme;
  }

  toggleNotifications() {
    const newValue = !this.settings.notifications;

    this.cookieService.updateJson(
      'appSettings',
      { notifications: newValue },
      this.defaultSettings
    );

    this.settings.notifications = newValue;
  }

  increaseFontSize() {
    const newSize = this.settings.fontSize + 2;

    this.cookieService.updateJson(
      'appSettings',
      { fontSize: newSize },
      this.defaultSettings
    );

    this.settings.fontSize = newSize;
  }

  toggleAutoSave() {
    const newValue = !this.settings.autoSave;

    this.cookieService.updateJson(
      'appSettings',
      { autoSave: newValue },
      this.defaultSettings
    );

    this.settings.autoSave = newValue;
  }

  updateMultipleSettings() {
    // Update multiple properties at once
    this.cookieService.updateJson(
      'appSettings',
      {
        theme: 'dark',
        fontSize: 16,
        sidebar: false
      },
      this.defaultSettings
    );
  }

  resetSettings() {
    this.cookieService.setJson('appSettings', this.defaultSettings, {
      expires: 365
    });
    this.settings = { ...this.defaultSettings };
  }
}
```

### User Profile Updates

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
}

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  template: `
    <form (ngSubmit)="saveProfile()">
      <input [(ngModel)]="profile.name" name="name" placeholder="Name" />
      <input [(ngModel)]="profile.email" name="email" placeholder="Email" />
      <textarea [(ngModel)]="profile.bio" name="bio" placeholder="Bio"></textarea>
      <input [(ngModel)]="profile.location" name="location" placeholder="Location" />

      <button type="submit">Save Profile</button>
    </form>
  `
})
export class ProfileEditorComponent {
  private cookieService = inject(CatbeeCookieService);

  readonly defaultProfile: UserProfile = {
    name: '',
    email: '',
    avatar: '',
    bio: '',
    location: '',
    website: ''
  };

  profile: UserProfile = { ...this.defaultProfile };

  ngOnInit() {
    this.profile = this.cookieService.getJsonWithDefault(
      'userProfile',
      this.defaultProfile,
      { expires: 90 }
    );
  }

  saveProfile() {
    // Update all modified fields
    this.cookieService.updateJson(
      'userProfile',
      this.profile,
      this.defaultProfile,
      { expires: 90 }
    );
  }

  updateAvatar(avatarUrl: string) {
    // Update only the avatar
    this.cookieService.updateJson(
      'userProfile',
      { avatar: avatarUrl },
      this.defaultProfile
    );
    this.profile.avatar = avatarUrl;
  }
}
```

## Bulk Operations

### Deleting Multiple Cookies

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-session-manager',
  standalone: true,
  template: `
    <div class="session-manager">
      <h2>Session Management</h2>

      <button (click)="logout()">Logout</button>
      <button (click)="clearUserData()">Clear User Data</button>
      <button (click)="clearAnalytics()">Clear Analytics</button>
      <button (click)="clearEverything()">Clear All Cookies</button>
    </div>
  `
})
export class SessionManagerComponent {
  private cookieService = inject(CatbeeCookieService);

  logout() {
    // Clear authentication-related cookies
    this.cookieService.deleteMany([
      'authToken',
      'refreshToken',
      'sessionId',
      'userId'
    ]);
  }

  clearUserData() {
    // Clear user preferences and data
    this.cookieService.deleteMany([
      'userPrefs',
      'userProfile',
      'recentSearches',
      'shoppingCart',
      'wishlist'
    ]);
  }

  clearAnalytics() {
    // Clear analytics cookies
    this.cookieService.deleteMany([
      'pageViews',
      'visitCount',
      'lastVisit',
      'sessionStart'
    ]);
  }

  clearEverything() {
    // Delete all accessible cookies
    this.cookieService.deleteAll();
  }

  clearCookiesWithPath() {
    // Delete all cookies for a specific path
    this.cookieService.deleteAll({ path: '/' });
  }
}
```

### Setting Multiple Cookies

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

interface SessionData {
  userId: string;
  sessionId: string;
  loginTime: string;
  expiresAt: string;
}

@Component({
  selector: 'app-session-initializer',
  standalone: true,
  template: `...`
})
export class SessionInitializerComponent {
  private cookieService = inject(CatbeeCookieService);

  initializeSession(sessionData: SessionData) {
    const options = {
      expires: 1, // 1 day
      secure: true,
      sameSite: 'Strict' as const
    };

    // Set multiple cookies for session
    this.cookieService.set('userId', sessionData.userId, options);
    this.cookieService.set('sessionId', sessionData.sessionId, options);
    this.cookieService.set('loginTime', sessionData.loginTime, options);
    this.cookieService.set('expiresAt', sessionData.expiresAt, options);

    // Or use a helper method
    this.setMultipleCookies({
      'userId': sessionData.userId,
      'sessionId': sessionData.sessionId,
      'loginTime': sessionData.loginTime,
      'expiresAt': sessionData.expiresAt
    }, options);
  }

  private setMultipleCookies(
    cookies: Record<string, string>,
    options: any
  ) {
    Object.entries(cookies).forEach(([name, value]) => {
      this.cookieService.set(name, value, options);
    });
  }
}
```

## Cookie Inspection and Debugging

### Cookie Inspector

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

interface CookieInfo {
  name: string;
  value: string;
  size: number;
}

@Component({
  selector: 'app-cookie-inspector',
  standalone: true,
  template: `
    <div class="cookie-inspector">
      <h2>Cookie Inspector</h2>

      <div class="stats">
        <p>Total Cookies: {{ totalCookies }}</p>
        <p>Total Size: {{ totalSize }} bytes</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (cookie of cookieList; track cookie.name) {
            <tr>
              <td>{{ cookie.name }}</td>
              <td class="value">{{ cookie.value }}</td>
              <td>{{ cookie.size }} bytes</td>
              <td>
                <button (click)="deleteCookie(cookie.name)">Delete</button>
                <button (click)="viewDetails(cookie)">Details</button>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <button (click)="refresh()">Refresh</button>
      <button (click)="exportCookies()">Export</button>
    </div>
  `
})
export class CookieInspectorComponent implements OnInit {
  private cookieService = inject(CatbeeCookieService);

  cookieList: CookieInfo[] = [];
  totalCookies = 0;
  totalSize = 0;

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    const entries = this.cookieService.entries();

    this.cookieList = entries.map(([name, value]) => ({
      name,
      value,
      size: this.calculateSize(name, value)
    }));

    this.totalCookies = this.cookieList.length;
    this.totalSize = this.cookieList.reduce((sum, cookie) => sum + cookie.size, 0);
  }

  private calculateSize(name: string, value: string): number {
    // Cookie size = name + value + overhead
    return new Blob([`${name}=${value}`]).size;
  }

  deleteCookie(name: string) {
    this.cookieService.delete(name);
    this.refresh();
  }

  viewDetails(cookie: CookieInfo) {
    console.log('Cookie Details:', {
      name: cookie.name,
      value: cookie.value,
      size: cookie.size,
      // Try to parse as JSON
      parsed: this.tryParseJson(cookie.value)
    });
  }

  private tryParseJson(value: string): any {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  exportCookies() {
    const data = this.cookieService.getAll();
    const json = JSON.stringify(data, null, 2);

    // Download as JSON file
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cookies-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
```

## Cookie Watchers and Change Detection

### Reactive Cookie Observer

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-cookie-watcher',
  standalone: true,
  template: `
    <div class="watcher">
      <h2>Cookie Watcher</h2>

      <p>Username: {{ username$ | async }}</p>
      <p>Theme: {{ theme$ | async }}</p>

      <button (click)="updateUsername()">Update Username</button>
      <button (click)="updateTheme()">Toggle Theme</button>
    </div>
  `
})
export class CookieWatcherComponent implements OnInit, OnDestroy {
  private cookieService = inject(CatbeeCookieService);

  username$ = new BehaviorSubject<string>('');
  theme$ = new BehaviorSubject<string>('light');

  private subscription?: Subscription;

  ngOnInit() {
    // Initial values
    this.username$.next(this.cookieService.get('username') || 'Guest');
    this.theme$.next(this.cookieService.get('theme') || 'light');

    // Poll for changes every second
    this.subscription = interval(1000).subscribe(() => {
      this.checkForChanges();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private checkForChanges() {
    const currentUsername = this.cookieService.get('username') || 'Guest';
    const currentTheme = this.cookieService.get('theme') || 'light';

    if (currentUsername !== this.username$.value) {
      this.username$.next(currentUsername);
    }

    if (currentTheme !== this.theme$.value) {
      this.theme$.next(currentTheme);
    }
  }

  updateUsername() {
    const names = ['Alice', 'Bob', 'Charlie', 'Diana'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    this.cookieService.set('username', randomName);
  }

  updateTheme() {
    const currentTheme = this.theme$.value;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.cookieService.set('theme', newTheme);
  }
}
```

### Cross-Tab Synchronization

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sync-manager',
  standalone: true,
  template: `
    <div class="sync-manager">
      <h2>Cross-Tab Cookie Sync</h2>

      <p>Shared Counter: {{ counter }}</p>
      <button (click)="increment()">Increment</button>

      <p>Theme: {{ theme }}</p>
      <button (click)="toggleTheme()">Toggle Theme</button>

      <p class="info">
        Changes are synced across all open tabs!
      </p>
    </div>
  `
})
export class SyncManagerComponent implements OnInit, OnDestroy {
  private cookieService = inject(CatbeeCookieService);

  counter = 0;
  theme = 'light';

  private storageSubscription?: Subscription;

  ngOnInit() {
    this.loadValues();
    this.watchForChanges();
  }

  ngOnDestroy() {
    this.storageSubscription?.unsubscribe();
  }

  private loadValues() {
    this.counter = this.cookieService.getNumberWithDefault('syncCounter', 0);
    this.theme = this.cookieService.getWithDefault('syncTheme', 'light');
  }

  private watchForChanges() {
    // Listen for storage events (fired in other tabs)
    this.storageSubscription = fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        filter(event => event.key === 'cookie-sync')
      )
      .subscribe(() => {
        this.loadValues();
      });
  }

  increment() {
    this.counter++;
    this.cookieService.set('syncCounter', this.counter.toString());
    this.broadcastChange();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.cookieService.set('syncTheme', this.theme);
    this.broadcastChange();
  }

  private broadcastChange() {
    // Trigger storage event for other tabs
    localStorage.setItem('cookie-sync', Date.now().toString());
    localStorage.removeItem('cookie-sync');
  }
}
```

## Cookie Validation and Sanitization

### Input Validation

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-validated-input',
  standalone: true,
  template: `
    <form (ngSubmit)="saveSettings()">
      <input [(ngModel)]="username" name="username"
             placeholder="Username (3-20 chars)" />

      <input type="number" [(ngModel)]="age" name="age"
             placeholder="Age (1-120)" />

      <select [(ngModel)]="country" name="country">
        @for (c of allowedCountries; track c) {
          <option [value]="c">{{ c }}</option>
        }
      </select>

      <button type="submit">Save</button>

      @if (errorMessage) {
        <p class="error">{{ errorMessage }}</p>
      }
    </form>
  `
})
export class ValidatedInputComponent {
  private cookieService = inject(CatbeeCookieService);

  username = '';
  age = 0;
  country = '';
  errorMessage = '';

  readonly allowedCountries = ['USA', 'UK', 'Canada', 'Australia'];

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.username = this.cookieService.get('username') || '';
    this.age = this.cookieService.getNumber('age');
    this.country = this.cookieService.getEnumWithDefault(
      'country',
      'USA',
      this.allowedCountries
    );
  }

  saveSettings() {
    this.errorMessage = '';

    // Validate username
    if (!this.validateUsername(this.username)) {
      this.errorMessage = 'Username must be 3-20 characters';
      return;
    }

    // Validate age
    if (!this.validateAge(this.age)) {
      this.errorMessage = 'Age must be between 1 and 120';
      return;
    }

    // Validate country
    if (!this.allowedCountries.includes(this.country)) {
      this.errorMessage = 'Invalid country selected';
      return;
    }

    // Sanitize and save
    this.cookieService.set('username', this.sanitizeString(this.username), {
      expires: 365
    });
    this.cookieService.set('age', this.age.toString(), {
      expires: 365
    });
    this.cookieService.set('country', this.country, {
      expires: 365
    });
  }

  private validateUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 20;
  }

  private validateAge(age: number): boolean {
    return age >= 1 && age <= 120;
  }

  private sanitizeString(input: string): string {
    // Remove special characters that could cause issues
    return input.replace(/[^\w\s-]/g, '').trim();
  }
}
```

## Migration and Versioning

### Cookie Version Management

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

interface UserPreferencesV1 {
  theme: string;
  language: string;
}

interface UserPreferencesV2 {
  theme: string;
  language: string;
  fontSize: number;
  notifications: boolean;
}

@Component({
  selector: 'app-preferences-migrator',
  standalone: true,
  template: `...`
})
export class PreferencesMigratorComponent implements OnInit {
  private cookieService = inject(CatbeeCookieService);

  ngOnInit() {
    this.migratePreferences();
  }

  private migratePreferences() {
    const version = this.cookieService.getNumber('prefsVersion');

    if (isNaN(version) || version < 2) {
      // Load old format
      const oldPrefs = this.cookieService.getJson<UserPreferencesV1>('userPrefs');

      if (oldPrefs) {
        // Migrate to new format
        const newPrefs: UserPreferencesV2 = {
          theme: oldPrefs.theme,
          language: oldPrefs.language,
          fontSize: 14, // New default
          notifications: true // New default
        };

        // Save in new format
        this.cookieService.setJson('userPrefs', newPrefs, { expires: 365 });
        this.cookieService.set('prefsVersion', '2');

        console.log('Migrated preferences to v2');
      }
    }
  }
}
```

## Next Steps

- [API Reference](../api-reference) - Complete method documentation
- [Basic Usage](./basic-usage) - Learn fundamental operations
- [Type-Safe Methods](./type-safe-methods) - Work with typed data
