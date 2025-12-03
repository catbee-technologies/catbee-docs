---
id: installation
title: Installation and Configuration
sidebar_position: 2
---

## Installation

Install the package via npm:

```bash
npm install @ng-catbee/indexed-db
```

## Database Configuration

Configure your IndexedDB database with stores, schemas, and optional caching settings.

### Standalone Apps (Angular 17+)

Use the `provideCatbeeIndexedDB` function in your app configuration:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCatbeeIndexedDB } from '@ng-catbee/indexed-db';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCatbeeIndexedDB({
      name: 'MyAppDB',
      version: 1,
      objectStoresMeta: [
        {
          store: 'users',
          storeConfig: { keyPath: 'id', autoIncrement: true },
          storeSchema: [
            { name: 'email', keypath: 'email', options: { unique: true } },
            { name: 'name', keypath: 'name', options: { unique: false } },
            { name: 'role', keypath: 'role', options: { unique: false } }
          ]
        },
        {
          store: 'products',
          storeConfig: { keyPath: 'id', autoIncrement: true },
          storeSchema: [
            { name: 'sku', keypath: 'sku', options: { unique: true } },
            { name: 'category', keypath: 'category', options: { unique: false } },
            { name: 'price', keypath: 'price', options: { unique: false } }
          ]
        }
      ],
      cache: {
        enabled: true,
        expirySeconds: 300 // 5 minutes
      }
    })
  ]
};
```

### Module-based Apps

Import and configure the `CatbeeIndexedDBModule` in your root module:

```typescript
import { NgModule } from '@angular/core';
import { CatbeeIndexedDBModule } from '@ng-catbee/indexed-db';

@NgModule({
  imports: [
    CatbeeIndexedDBModule.forRoot({
      name: 'MyAppDB',
      version: 1,
      objectStoresMeta: [
        {
          store: 'users',
          storeConfig: { keyPath: 'id', autoIncrement: true },
          storeSchema: [
            { name: 'email', keypath: 'email', options: { unique: true } },
            { name: 'name', keypath: 'name', options: { unique: false } }
          ]
        }
      ]
    })
  ]
})
export class AppModule { }
```

## Configuration Options

### Database Configuration

```typescript
interface CatbeeIndexedDBConfig {
  name: string;                          // Database name
  version: number;                       // Database version
  objectStoresMeta: ObjectStoreMeta[];   // Store definitions
  migrationFactory?: () => Record<number, MigrationFunction>; // Optional migrations
  cache?: {                              // Optional caching
    enabled: boolean;
    expirySeconds: number;
  };
}
```

### Object Store Configuration

```typescript
interface ObjectStoreMeta {
  store: string;                         // Store name
  storeConfig: IDBObjectStoreParameters; // { keyPath: string, autoIncrement?: boolean }
  storeSchema: ObjectStoreSchema[];      // Index definitions
}

interface ObjectStoreSchema {
  name: string;                          // Index name
  keypath: string | string[];            // Field(s) to index
  options: IDBIndexParameters;           // { unique?: boolean, multiEntry?: boolean }
}
```

## Complete Example

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCatbeeIndexedDB } from '@ng-catbee/indexed-db';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCatbeeIndexedDB({
      name: 'EcommerceDB',
      version: 1,
      objectStoresMeta: [
        // Users store with email and role indexes
        {
          store: 'users',
          storeConfig: { keyPath: 'id', autoIncrement: true },
          storeSchema: [
            { name: 'email', keypath: 'email', options: { unique: true } },
            { name: 'username', keypath: 'username', options: { unique: true } },
            { name: 'role', keypath: 'role', options: { unique: false } },
            { name: 'createdAt', keypath: 'createdAt', options: { unique: false } }
          ]
        },
        // Products store with SKU, category, and price indexes
        {
          store: 'products',
          storeConfig: { keyPath: 'id', autoIncrement: true },
          storeSchema: [
            { name: 'sku', keypath: 'sku', options: { unique: true } },
            { name: 'category', keypath: 'category', options: { unique: false } },
            { name: 'price', keypath: 'price', options: { unique: false } },
            { name: 'inStock', keypath: 'inStock', options: { unique: false } }
          ]
        },
        // Orders store
        {
          store: 'orders',
          storeConfig: { keyPath: 'id', autoIncrement: true },
          storeSchema: [
            { name: 'userId', keypath: 'userId', options: { unique: false } },
            { name: 'status', keypath: 'status', options: { unique: false } },
            { name: 'createdAt', keypath: 'createdAt', options: { unique: false } }
          ]
        },
        // Cart items store
        {
          store: 'cart',
          storeConfig: { keyPath: 'productId', autoIncrement: false },
          storeSchema: []
        }
      ],
      // Enable caching for better performance
      cache: {
        enabled: true,
        expirySeconds: 300 // 5 minutes
      }
    })
  ]
};
```

## Database Initialization

The database opens lazily on the first operation. However, you can manually initialize it:

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<router-outlet />`
})
export class AppComponent implements OnInit {
  private db = inject(CatbeeIndexedDBService);

  ngOnInit() {
    // Optional: manually initialize database
    this.db.initialize().subscribe({
      next: () => console.log('Database initialized'),
      error: (err) => console.error('Database initialization failed', err)
    });
  }
}
```

## Using in Components

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { CommonModule } from '@angular/common';

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-container">
      <h2>Users</h2>
      <ul>
        @for (user of users; track user.id) {
          <li>{{ user.name }} - {{ user.email }} ({{ user.role }})</li>
        }
      </ul>
    </div>
  `
})
export class UsersComponent implements OnInit {
  private db = inject(CatbeeIndexedDBService);
  users: User[] = [];

  ngOnInit() {
    this.db.getAll<User>('users').subscribe(users => {
      this.users = users;
    });
  }
}
```

## Cache Configuration

Enable caching to improve performance for frequently accessed data:

```typescript
provideCatbeeIndexedDB({
  name: 'MyDB',
  version: 1,
  objectStoresMeta: [/* ... */],
  cache: {
    enabled: true,
    expirySeconds: 300  // Cache expires after 5 minutes
  }
})
```

Use the cached method for automatic cache management:

```typescript
// First call fetches from database and caches
// Subsequent calls within 5 minutes use cache
this.db.cached(
  'users',
  'user-123',
  () => this.db.getByID<User>('users', 123)
).subscribe(user => {
  console.log('User (possibly from cache):', user);
});

// Invalidate cache when needed
this.db.invalidateCache('users');  // Invalidate specific store
this.db.invalidateCache();         // Invalidate all cache
```

## SSR Compatibility

The library is SSR-safe and will gracefully handle server-side rendering scenarios where IndexedDB is not available:

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-data',
  standalone: true,
  template: `...`
})
export class DataComponent implements OnInit {
  private db = inject(CatbeeIndexedDBService);

  ngOnInit() {
    // IndexedDB operations only run in browser, no errors on server
    this.db.getAll('users').subscribe(users => {
      console.log('Users:', users);
    });
  }
}
```

## Next Steps

- [API Reference](./api-reference) - Complete API documentation
- [Usage Examples](./usage) - Learn common patterns and use cases
- [Basic CRUD Operations](./usage/basic-crud) - Create, Read, Update, Delete
- [Advanced Queries](./usage/advanced-queries) - Filtering, sorting, pagination
