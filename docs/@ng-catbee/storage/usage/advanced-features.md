---
id: advanced-features
title: Advanced Features
sidebar_position: 4
---

## Encoding Strategies

### Base64 Encoding

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCatbeeStorage } from '@ng-catbee/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCatbeeStorage({
      common: {
        encoding: 'base64' // All storage will use base64
      }
    })
  ]
};
```

### Custom Encoding

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCatbeeStorage } from '@ng-catbee/storage';

// Simple XOR encryption example (not secure, just for demonstration)
function simpleEncrypt(value: string): string {
  const key = 42;
  return btoa(
    value.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join('')
  );
}

function simpleDecrypt(value: string): string {
  const key = 42;
  return atob(value)
    .split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join('');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideCatbeeStorage({
      localStorage: {
        encoding: 'custom',
        customEncode: simpleEncrypt,
        customDecode: simpleDecrypt
      }
    })
  ]
};
```

### Mixed Encoding

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-mixed-encoding'
})
export class MixedEncodingComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  saveData() {
    // Save with encoding (default behavior)
    this.localStorage.set('encodedData', 'sensitive-value');

    // Skip encoding for specific values
    this.localStorage.set('rawData', 'public-value', true);
  }

  loadData() {
    // Get with decoding (default behavior)
    const encoded = this.localStorage.get('encodedData');

    // Skip decoding for specific values
    const raw = this.localStorage.get('rawData', true);
  }
}
```

## Partial JSON Updates

### Update Nested Properties

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

interface AppSettings {
  ui: {
    theme: string;
    sidebar: boolean;
    density: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    analytics: boolean;
    cookies: boolean;
  };
}

@Component({
  selector: 'app-settings-updater',
  standalone: true,
  template: `
    <div>
      <button (click)="toggleTheme()">Toggle Theme</button>
      <button (click)="toggleNotifications()">Toggle Notifications</button>
    </div>
  `
})
export class SettingsUpdaterComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  private defaultSettings: AppSettings = {
    ui: { theme: 'light', sidebar: true, density: 'comfortable' },
    notifications: { email: true, push: false, sms: false },
    privacy: { analytics: false, cookies: true }
  };

  toggleTheme() {
    const current = this.localStorage.getJsonWithDefault<AppSettings>(
      'appSettings',
      this.defaultSettings
    );

    // Only update the theme property
    this.localStorage.updateJson<AppSettings>(
      'appSettings',
      {
        ui: { ...current.ui, theme: current.ui.theme === 'light' ? 'dark' : 'light' }
      },
      this.defaultSettings
    );
  }

  toggleNotifications() {
    const current = this.localStorage.getJsonWithDefault<AppSettings>(
      'appSettings',
      this.defaultSettings
    );

    // Only update notification settings
    this.localStorage.updateJson<AppSettings>(
      'appSettings',
      {
        notifications: {
          ...current.notifications,
          email: !current.notifications.email
        }
      },
      this.defaultSettings
    );
  }
}
```

## SSR Handling

### Server-Safe Operations

```typescript
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-ssr-safe',
  standalone: true,
  template: `
    <div>
      @if (isBrowser) {
        <p>Client-side: {{ userData }}</p>
      } @else {
        <p>Server-side rendering</p>
      }
    </div>
  `
})
export class SsrSafeComponent {
  private localStorage = inject(CatbeeLocalStorageService);
  private platformId = inject(PLATFORM_ID);

  isBrowser = isPlatformBrowser(this.platformId);
  userData: string | null = null;

  ngOnInit() {
    // The library handles SSR automatically, but you can add extra checks
    if (this.isBrowser) {
      this.userData = this.localStorage.get('user');
    }
  }

  saveData(data: string) {
    // Safe to call - no-op on server
    this.localStorage.set('user', data);
  }
}
```

## Validation and Sanitization

### Input Validation

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-validated-input'
})
export class ValidatedInputComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  saveEmail(email: string) {
    // Validate before saving
    if (this.isValidEmail(email)) {
      this.localStorage.set('userEmail', email);
      return true;
    }
    console.error('Invalid email format');
    return false;
  }

  saveAge(age: number) {
    // Validate range
    if (age >= 13 && age <= 120) {
      this.localStorage.set('userAge', String(age));
      return true;
    }
    console.error('Invalid age');
    return false;
  }

  saveUsername(username: string) {
    // Sanitize input
    const sanitized = username.trim().toLowerCase();

    if (sanitized.length >= 3 && sanitized.length <= 20) {
      this.localStorage.set('username', sanitized);
      return true;
    }
    console.error('Username must be 3-20 characters');
    return false;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

## Migration and Versioning

### Data Migration

```typescript
import { Injectable, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

interface UserDataV1 {
  name: string;
  email: string;
}

interface UserDataV2 {
  firstName: string;
  lastName: string;
  email: string;
  version: number;
}

@Injectable({ providedIn: 'root' })
export class MigrationService {
  private localStorage = inject(CatbeeLocalStorageService);
  private readonly CURRENT_VERSION = 2;

  migrateUserData() {
    const versionKey = 'userDataVersion';
    const currentVersion = this.localStorage.getNumberWithDefault(versionKey, 1);

    if (currentVersion < this.CURRENT_VERSION) {
      console.log(`Migrating from v${currentVersion} to v${this.CURRENT_VERSION}`);

      if (currentVersion === 1) {
        this.migrateV1toV2();
      }

      this.localStorage.set(versionKey, String(this.CURRENT_VERSION));
    }
  }

  private migrateV1toV2() {
    const oldData = this.localStorage.getJson<UserDataV1>('userData');

    if (oldData) {
      const [firstName, lastName] = oldData.name.split(' ');

      const newData: UserDataV2 = {
        firstName: firstName || oldData.name,
        lastName: lastName || '',
        email: oldData.email,
        version: 2
      };

      this.localStorage.setJson('userData', newData);
      console.log('Migration complete');
    }
  }
}
```

## Bulk Operations

### Export/Import

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-data-portability',
  standalone: true,
  template: `
    <div>
      <button (click)="exportData()">Export All Data</button>
      <button (click)="importData()">Import Data</button>
      <input #fileInput type="file" accept=".json" (change)="handleFileImport($event)" hidden>
    </div>
  `
})
export class DataPortabilityComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  exportData() {
    const entries = this.localStorage.entries();
    const data: Record<string, string | null> = {};

    for (const [key, value] of entries) {
      data[key] = value;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `storage-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  importData() {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    input?.click();
  }

  handleFileImport(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);

          // Import all data
          this.localStorage.multiSet(data);
          console.log('Data imported successfully');
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      };
      reader.readAsText(file);
    }
  }
}
```

### Batch Processing

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-batch-processor'
})
export class BatchProcessorComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  batchSaveUserPreferences(prefs: Record<string, any>) {
    const batch: Record<string, string> = {};

    for (const [key, value] of Object.entries(prefs)) {
      if (typeof value === 'object') {
        batch[`pref_${key}`] = JSON.stringify(value);
      } else {
        batch[`pref_${key}`] = String(value);
      }
    }

    this.localStorage.multiSet(batch);
  }

  batchLoadPreferences(): Record<string, any> {
    const keys = this.localStorage.keys()
      .filter(key => key.startsWith('pref_'));

    const values = this.localStorage.multiGet(keys);
    const prefs: Record<string, any> = {};

    values.forEach((value, key) => {
      const prefKey = key.replace('pref_', '');
      try {
        prefs[prefKey] = JSON.parse(value!);
      } catch {
        prefs[prefKey] = value;
      }
    });

    return prefs;
  }

  clearOldCacheItems(maxAgeMs: number) {
    const keys = this.localStorage.keys()
      .filter(key => key.startsWith('cache_'));

    const toDelete: string[] = [];
    const now = Date.now();

    for (const key of keys) {
      const item = this.localStorage.getJson<{ timestamp: number }>(key);
      if (item && (now - item.timestamp) > maxAgeMs) {
        toDelete.push(key);
      }
    }

    if (toDelete.length > 0) {
      this.localStorage.deleteMany(toDelete);
      console.log(`Deleted ${toDelete.length} old cache items`);
    }
  }
}
```

## Storage Quota Management

### Monitor Storage Limits

```typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-storage-quota',
  standalone: true,
  template: `
    <div class="quota-monitor">
      <h3>Storage Usage</h3>
      <div class="progress">
        <div
          class="bar"
          [style.width.%]="usagePercentage()"
          [class.warning]="usagePercentage() > 75"
        ></div>
      </div>
      <p>{{ formatSize(currentSize()) }} / ~5 MB</p>
      <p>{{ usagePercentage() }}% used</p>

      @if (usagePercentage() > 90) {
        <button (click)="cleanup()">Cleanup Old Data</button>
      }
    </div>
  `
})
export class StorageQuotaComponent implements OnInit {
  private localStorage = inject(CatbeeLocalStorageService);

  currentSize = signal(0);
  maxSize = 5 * 1024 * 1024; // Approximate 5MB limit

  usagePercentage = () => (this.currentSize() / this.maxSize) * 100;

  ngOnInit() {
    this.updateSize();
  }

  updateSize() {
    this.currentSize.set(this.localStorage.size());
  }

  cleanup() {
    // Remove old cache items
    const keys = this.localStorage.keys().filter(k => k.startsWith('cache_'));
    this.localStorage.deleteMany(keys);
    this.updateSize();
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
```
