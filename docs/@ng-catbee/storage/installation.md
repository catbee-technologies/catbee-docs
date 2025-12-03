---
id: installation
title: Installation and Configuration
sidebar_position: 2
---

## Installation

Install the package via npm:

```bash
npm install @ng-catbee/storage
```

## Configuration (Optional)

### Standalone Apps

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCatbeeStorage } from '@ng-catbee/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCatbeeStorage({
      common: {
        encoding: 'default' // 'default', 'base64', 'custom'
      },
      localStorage: {
        encoding: 'base64' // Override for localStorage only
      },
      sessionStorage: {
        encoding: 'custom',
        customEncode: (value: string) => btoa(value),
        customDecode: (value: string) => atob(value)
      }
    })
  ]
};
```

### Module-based Apps

```typescript
import { NgModule } from '@angular/core';
import { CatbeeStorageModule } from '@ng-catbee/storage';

@NgModule({
  imports: [
    CatbeeStorageModule.forRoot({
      common: {
        encoding: 'default'
      },
      localStorage: {
        encoding: 'base64'
      }
    })
  ]
})
export class AppModule { }
```

## Configuration Options

### Encoding Strategies

| Strategy  | Description                              |
| --------- | ---------------------------------------- |
| `default` | No encoding - stores values as-is        |
| `base64`  | Base64 encoding for obfuscation          |
| `custom`  | Provide your own encode/decode functions |

### Custom Encoding

```typescript
provideCatbeeStorage({
  localStorage: {
    encoding: 'custom',
    customEncode: (value: string) => {
      // Your custom encoding logic
      return `encrypted_${btoa(value)}`;
    },
    customDecode: (value: string) => {
      // Your custom decoding logic
      return atob(value.replace('encrypted_', ''));
    }
  }
})
```

## Zero Configuration

The library works without configuration. Just inject the services:

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService, CatbeeSessionStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `...`
})
export class AppComponent {
  private localStorage = inject(CatbeeLocalStorageService);
  private sessionStorage = inject(CatbeeSessionStorageService);

  saveData() {
    this.localStorage.set('key', 'value');
    this.sessionStorage.set('tempKey', 'tempValue');
  }
}
```

## SSR Compatibility

The library gracefully handles server-side rendering. All storage operations are no-ops on the server and work normally in the browser.

## Next Steps

- [Basic Usage](./usage/basic-usage) - Learn fundamental operations
- [Type-Safe Methods](./usage/type-safe-methods) - Use JSON, boolean, number methods
- [Reactive Features](./usage/reactive-features) - Watch storage changes
- [API Reference](./api-reference) - Complete API documentation
