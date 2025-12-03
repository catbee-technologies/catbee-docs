---
id: basic-usage
title: Basic Usage
sidebar_position: 1
---

## Setting and Getting Values

### Basic String Operations

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  template: `
    <div>
      <input [(ngModel)]="username" placeholder="Username">
      <button (click)="save()">Save</button>
      <button (click)="load()">Load</button>
      <p>Stored: {{ storedUsername }}</p>
    </div>
  `
})
export class UserSettingsComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  username = '';
  storedUsername = '';

  save() {
    this.localStorage.set('username', this.username);
    console.log('Username saved');
  }

  load() {
    this.storedUsername = this.localStorage.get('username') ?? 'Not found';
  }
}
```

### LocalStorage vs SessionStorage

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService, CatbeeSessionStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-storage-demo',
  standalone: true,
  template: `
    <div>
      <h3>LocalStorage (persists across sessions)</h3>
      <button (click)="saveLocal()">Save to LocalStorage</button>

      <h3>SessionStorage (cleared when tab closes)</h3>
      <button (click)="saveSession()">Save to SessionStorage</button>
    </div>
  `
})
export class StorageDemoComponent {
  private localStorage = inject(CatbeeLocalStorageService);
  private sessionStorage = inject(CatbeeSessionStorageService);

  saveLocal() {
    // Persists even after closing the browser
    this.localStorage.set('permanentData', 'This persists');
  }

  saveSession() {
    // Cleared when the browser tab is closed
    this.sessionStorage.set('tempData', 'This is temporary');
  }
}
```

## Checking Existence

### Has Method

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-auth-check',
  standalone: true,
  template: `
    <div>
      @if (isAuthenticated) {
        <p>Welcome back!</p>
        <button (click)="logout()">Logout</button>
      } @else {
        <p>Please log in</p>
        <button (click)="login()">Login</button>
      }
    </div>
  `
})
export class AuthCheckComponent implements OnInit {
  private localStorage = inject(CatbeeLocalStorageService);
  isAuthenticated = false;

  ngOnInit() {
    // Check if auth token exists
    this.isAuthenticated = this.localStorage.has('authToken');
  }

  login() {
    this.localStorage.set('authToken', 'sample-token-123');
    this.isAuthenticated = true;
  }

  logout() {
    this.localStorage.delete('authToken');
    this.isAuthenticated = false;
  }
}
```

## Deleting Values

### Delete Single Item

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-cache-manager'
})
export class CacheManagerComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  clearCache(cacheKey: string) {
    if (this.localStorage.has(cacheKey)) {
      this.localStorage.delete(cacheKey);
      console.log(`Cache cleared: ${cacheKey}`);
    }
  }
}
```

### Delete Multiple Items

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-cleanup'
})
export class CleanupComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  clearTempData() {
    // Delete multiple keys at once
    this.localStorage.deleteMany([
      'tempCache',
      'tempToken',
      'tempData'
    ]);
  }
}
```

### Clear All Storage

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-reset',
  template: `
    <button (click)="resetApp()" class="danger">
      Reset Application
    </button>
  `
})
export class ResetComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  resetApp() {
    if (confirm('Are you sure? This will clear all saved data.')) {
      this.localStorage.clear();
      console.log('All data cleared');
      window.location.reload();
    }
  }
}
```

## Conditional Setting

### Set If Not Exists

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-first-visit'
})
export class FirstVisitComponent implements OnInit {
  private localStorage = inject(CatbeeLocalStorageService);

  ngOnInit() {
    // Only set if user hasn't visited before
    this.localStorage.setIfNotExists('firstVisitDate', new Date().toISOString());

    // Track visit count
    const visits = this.localStorage.getNumberWithDefault('visitCount', 0);
    this.localStorage.set('visitCount', String(visits + 1));
  }
}
```

### Get With Default

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-preferences'
})
export class PreferencesComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  loadPreferences() {
    // Get value or use default (auto-sets if missing)
    const theme = this.localStorage.getWithDefault('theme', 'light', ['light', 'dark']);

    // Validation ensures only allowed values
    const language = this.localStorage.getWithDefault('language', 'en', ['en', 'es', 'fr']);

    return { theme, language };
  }
}
```

## Listing Stored Items

### Get All Keys

```typescript
import { Component, inject, signal } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-storage-inspector',
  standalone: true,
  template: `
    <div class="inspector">
      <h3>Storage Contents</h3>
      <ul>
        @for (key of allKeys(); track key) {
          <li>
            <strong>{{ key }}</strong>: {{ getValue(key) }}
            <button (click)="deleteItem(key)">Delete</button>
          </li>
        }
      </ul>
      <p>Total items: {{ allKeys().length }}</p>
    </div>
  `
})
export class StorageInspectorComponent {
  private localStorage = inject(CatbeeLocalStorageService);
  allKeys = signal<string[]>([]);

  ngOnInit() {
    this.loadKeys();
  }

  loadKeys() {
    this.allKeys.set(this.localStorage.keys());
  }

  getValue(key: string): string {
    return this.localStorage.get(key) ?? 'null';
  }

  deleteItem(key: string) {
    this.localStorage.delete(key);
    this.loadKeys();
  }
}
```

### Get All Entries

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-storage-dump'
})
export class StorageDumpComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  exportAllData() {
    const entries = this.localStorage.entries();
    const data: Record<string, string | null> = {};

    for (const [key, value] of entries) {
      data[key] = value;
    }

    console.log('All storage data:', data);
    return data;
  }
}
```

## Bulk Operations

### Multi-Get

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-user-profile'
})
export class UserProfileComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  loadUserProfile() {
    // Get multiple values efficiently
    const values = this.localStorage.multiGet([
      'username',
      'email',
      'avatar',
      'bio'
    ]);

    return {
      username: values.get('username'),
      email: values.get('email'),
      avatar: values.get('avatar'),
      bio: values.get('bio')
    };
  }
}
```

### Multi-Set

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-settings-save'
})
export class SettingsSaveComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  saveAllSettings(settings: Record<string, string>) {
    // Set multiple values at once
    this.localStorage.multiSet({
      theme: settings.theme,
      language: settings.language,
      fontSize: settings.fontSize,
      notifications: settings.notifications
    });
  }
}
```

## Storage Size

### Calculate Usage

```typescript
import { Component, inject, signal } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-storage-usage',
  standalone: true,
  template: `
    <div class="usage-stats">
      <h3>Storage Usage</h3>
      <p>Size: {{ formatSize(storageSize()) }}</p>
      <p>Items: {{ itemCount() }}</p>
      <button (click)="refresh()">Refresh</button>
    </div>
  `
})
export class StorageUsageComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  storageSize = signal(0);
  itemCount = signal(0);

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.storageSize.set(this.localStorage.size());
    this.itemCount.set(this.localStorage.keys().length);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
```
