---
id: database-management
title: Database Management
sidebar_position: 4
---

## Database Migrations

### Version Upgrades

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCatbeeIndexedDB } from '@ng-catbee/indexed-db';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCatbeeIndexedDB({
      name: 'MyAppDB',
      version: 3,  // Incremented version
      objectStoresMeta: [
        {
          store: 'users',
          storeConfig: { keyPath: 'id', autoIncrement: true },
          storeSchema: [
            { name: 'email', keypath: 'email', options: { unique: true } },
            { name: 'name', keypath: 'name', options: { unique: false } },
            { name: 'role', keypath: 'role', options: { unique: false } }
          ]
        }
      ],
      migrationFactory: () => ({
        // Migration from version 1 to 2
        2: (db, transaction) => {
          const userStore = transaction.objectStore('users');

          // Add new index
          if (!userStore.indexNames.contains('role')) {
            userStore.createIndex('role', 'role', { unique: false });
          }
        },
        // Migration from version 2 to 3
        3: (db, transaction) => {
          // Create new object store
          if (!db.objectStoreNames.contains('settings')) {
            const settingsStore = db.createObjectStore('settings', {
              keyPath: 'key'
            });
            settingsStore.createIndex('category', 'category', { unique: false });
          }
        }
      })
    })
  ]
};
```

### Adding Indexes

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCatbeeIndexedDB } from '@ng-catbee/indexed-db';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCatbeeIndexedDB({
      name: 'MyAppDB',
      version: 4,
      objectStoresMeta: [
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
      migrationFactory: () => ({
        4: (db, transaction) => {
          const productStore = transaction.objectStore('products');

          // Add new price index for range queries
          if (!productStore.indexNames.contains('price')) {
            productStore.createIndex('price', 'price', { unique: false });
          }
        }
      })
    })
  ]
};
```

### Data Migration

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCatbeeIndexedDB } from '@ng-catbee/indexed-db';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCatbeeIndexedDB({
      name: 'MyAppDB',
      version: 5,
      objectStoresMeta: [
        {
          store: 'users',
          storeConfig: { keyPath: 'id', autoIncrement: true },
          storeSchema: [
            { name: 'email', keypath: 'email', options: { unique: true } },
            { name: 'fullName', keypath: 'fullName', options: { unique: false } }
          ]
        }
      ],
      migrationFactory: () => ({
        5: (db, transaction) => {
          const userStore = transaction.objectStore('users');

          // Migrate data: combine firstName + lastName to fullName
          const request = userStore.openCursor();

          request.onsuccess = (event: any) => {
            const cursor = event.target.result;

            if (cursor) {
              const user = cursor.value;

              // Transform data
              if (user.firstName && user.lastName) {
                user.fullName = `${user.firstName} ${user.lastName}`;
                delete user.firstName;
                delete user.lastName;

                cursor.update(user);
              }

              cursor.continue();
            }
          };
        }
      })
    })
  ]
};
```

### Removing Old Stores

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCatbeeIndexedDB } from '@ng-catbee/indexed-db';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCatbeeIndexedDB({
      name: 'MyAppDB',
      version: 6,
      objectStoresMeta: [
        // New store configuration
        {
          store: 'users',
          storeConfig: { keyPath: 'id', autoIncrement: true },
          storeSchema: []
        }
      ],
      migrationFactory: () => ({
        6: (db, transaction) => {
          // Delete deprecated store
          if (db.objectStoreNames.contains('oldCache')) {
            db.deleteObjectStore('oldCache');
          }
        }
      })
    })
  ]
};
```

## Dynamic Store Creation

### Creating Stores at Runtime

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-dynamic-store',
  standalone: true,
  template: `
    <button (click)="createUserStore()">Create User Store</button>
    <button (click)="createLogStore()">Create Log Store</button>
    <p>{{ status }}</p>
  `
})
export class DynamicStoreComponent {
  private db = inject(CatbeeIndexedDBService);

  status = '';

  async createUserStore() {
    try {
      await this.db.createObjectStore({
        store: 'dynamic-users',
        storeConfig: {
          keyPath: 'id',
          autoIncrement: true
        },
        storeSchema: [
          { name: 'username', keypath: 'username', options: { unique: true } },
          { name: 'email', keypath: 'email', options: { unique: true } },
          { name: 'createdAt', keypath: 'createdAt', options: { unique: false } }
        ]
      });

      this.status = 'User store created successfully';
    } catch (err) {
      this.status = 'Failed to create store';
      console.error(err);
    }
  }

  async createLogStore() {
    try {
      await this.db.createDynamicObjectStore({
        store: 'logs',
        storeConfig: {
          keyPath: 'id',
          autoIncrement: true
        },
        storeSchema: [
          { name: 'timestamp', keypath: 'timestamp', options: { unique: false } },
          { name: 'level', keypath: 'level', options: { unique: false } }
        ]
      });

      this.status = 'Log store created successfully';
    } catch (err) {
      this.status = 'Failed to create store';
      console.error(err);
    }
  }
}
```

### Dynamic Store with Migrations

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-dynamic-store-migration',
  standalone: true,
  template: `...`
})
export class DynamicStoreMigrationComponent {
  private db = inject(CatbeeIndexedDBService);

  async createStoreWithMigration() {
    await this.db.createObjectStore(
      {
        store: 'analytics',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { name: 'eventType', keypath: 'eventType', options: { unique: false } },
          { name: 'userId', keypath: 'userId', options: { unique: false } }
        ]
      },
      {
        // Migration function for this new store
        1: (db, transaction) => {
          const store = transaction.objectStore('analytics');
          // Add initial data or additional configuration
          console.log('Analytics store initialized');
        }
      }
    );
  }
}
```

## Store Management

### Listing All Stores

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="store-list">
      <h2>Available Stores</h2>
      <ul>
        @for (store of stores(); track store) {
          <li>{{ store }}</li>
        }
      </ul>
    </div>
  `
})
export class StoreListComponent implements OnInit {
  private db = inject(CatbeeIndexedDBService);

  stores = signal<string[]>([]);

  ngOnInit() {
    this.db.getAllObjectStoreNames().subscribe(names => {
      this.stores.set(names);
    });
  }
}
```

### Deleting Stores

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-delete-store',
  standalone: true,
  template: `
    <button (click)="deleteOldStore()">Delete Old Cache Store</button>
  `
})
export class DeleteStoreComponent {
  private db = inject(CatbeeIndexedDBService);

  deleteOldStore() {
    if (!confirm('Delete the cache store? This cannot be undone!')) {
      return;
    }

    this.db.deleteObjectStore('cache').subscribe({
      next: () => {
        console.log('Store deleted successfully');
      },
      error: (err) => {
        console.error('Failed to delete store:', err);
      }
    });
  }
}
```

### Store Statistics

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

interface StoreStats {
  name: string;
  count: number;
}

@Component({
  selector: 'app-store-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats">
      <h2>Database Statistics</h2>
      <p>Version: {{ version() }}</p>
      <p>Total Records: {{ totalRecords() }}</p>

      <h3>Stores</h3>
      <table>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Record Count</th>
          </tr>
        </thead>
        <tbody>
          @for (stat of stats(); track stat.name) {
            <tr>
              <td>{{ stat.name }}</td>
              <td>{{ stat.count }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class StoreStatsComponent implements OnInit {
  private db = inject(CatbeeIndexedDBService);

  version = signal<number | string>(0);
  stats = signal<StoreStats[]>([]);
  totalRecords = signal(0);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    forkJoin({
      version: this.db.getDatabaseVersion(),
      stores: this.db.getAllObjectStoreNames()
    }).subscribe(({ version, stores }) => {
      this.version.set(version);

      // Get counts for each store
      const countObservables: Record<string, any> = {};
      stores.forEach(store => {
        countObservables[store] = this.db.count(store);
      });

      forkJoin(countObservables).subscribe(counts => {
        const storeStats: StoreStats[] = stores.map(store => ({
          name: store,
          count: counts[store]
        }));

        this.stats.set(storeStats);

        const total = Object.values(counts).reduce(
          (sum: number, count: any) => sum + count,
          0
        );
        this.totalRecords.set(total);
      });
    });
  }
}
```

## Database Operations

### Getting Database Version

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-db-version',
  standalone: true,
  template: `<p>Database Version: {{ version }}</p>`
})
export class DbVersionComponent implements OnInit {
  private db = inject(CatbeeIndexedDBService);

  version: number | string = 0;

  ngOnInit() {
    this.db.getDatabaseVersion().subscribe(version => {
      this.version = version;
    });
  }
}
```

### Deleting Database

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-delete-db',
  standalone: true,
  template: `
    <button (click)="deleteDatabase()" class="danger">
      Delete Entire Database
    </button>
  `
})
export class DeleteDbComponent {
  private db = inject(CatbeeIndexedDBService);

  deleteDatabase() {
    const confirmed = confirm(
      'Delete the entire database? This will remove ALL data and cannot be undone!'
    );

    if (!confirmed) return;

    this.db.deleteDatabase().subscribe({
      next: () => {
        console.log('Database deleted successfully');
        alert('Database deleted. Please reload the application.');
      },
      error: (err) => {
        console.error('Failed to delete database:', err);
        alert('Failed to delete database');
      }
    });
  }
}
```

### Closing Database Connection

```typescript
import { Component, inject, OnDestroy } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-db-connection',
  standalone: true,
  template: `...`
})
export class DbConnectionComponent implements OnDestroy {
  private db = inject(CatbeeIndexedDBService);

  ngOnDestroy() {
    // Close database connection when component is destroyed
    this.db.close();
    console.log('Database connection closed');
  }
}
```

## Export and Import

### Full Database Export

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-full-export',
  standalone: true,
  template: `
    <button (click)="exportDatabase()">Export Full Database</button>
  `
})
export class FullExportComponent {
  private db = inject(CatbeeIndexedDBService);

  exportDatabase() {
    this.db.getAllObjectStoreNames().subscribe(storeNames => {
      const exports: Record<string, any> = {};
      const observables: Record<string, any> = {};

      storeNames.forEach(storeName => {
        observables[storeName] = this.db.export(storeName);
      });

      forkJoin(observables).subscribe(data => {
        const backup = {
          version: null as any,
          timestamp: new Date().toISOString(),
          stores: data
        };

        this.db.getDatabaseVersion().subscribe(version => {
          backup.version = version;
          this.downloadBackup(backup);
        });
      });
    });
  }

  private downloadBackup(data: any) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `database-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
```

### Full Database Import

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-full-import',
  standalone: true,
  template: `
    <input
      type="file"
      accept="application/json"
      (change)="onFileSelected($event)"
    />
    <button (click)="importDatabase()">Import Database</button>
    <p>{{ status }}</p>
  `
})
export class FullImportComponent {
  private db = inject(CatbeeIndexedDBService);

  selectedFile: File | null = null;
  status = '';

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  importDatabase() {
    if (!this.selectedFile) {
      this.status = 'Please select a backup file';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const backup = JSON.parse(e.target.result);
        this.restoreDatabase(backup);
      } catch (err) {
        this.status = 'Invalid backup file';
        console.error(err);
      }
    };
    reader.readAsText(this.selectedFile);
  }

  private restoreDatabase(backup: any) {
    this.status = 'Restoring database...';

    const importObservables: Record<string, any> = {};

    Object.keys(backup.stores).forEach(storeName => {
      const data = backup.stores[storeName];
      importObservables[storeName] = this.db.import(storeName, data);
    });

    forkJoin(importObservables).subscribe({
      next: () => {
        this.status = 'Database restored successfully';
      },
      error: (err) => {
        this.status = 'Restore failed';
        console.error(err);
      }
    });
  }
}
```

### Selective Store Export

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-selective-export',
  standalone: true,
  template: `
    <div class="export-options">
      <h3>Select Stores to Export</h3>
      @for (store of availableStores; track store) {
        <label>
          <input
            type="checkbox"
            [(ngModel)]="selectedStores[store]"
          />
          {{ store }}
        </label>
      }
      <button (click)="exportSelected()">Export Selected</button>
    </div>
  `
})
export class SelectiveExportComponent {
  private db = inject(CatbeeIndexedDBService);

  availableStores: string[] = [];
  selectedStores: Record<string, boolean> = {};

  ngOnInit() {
    this.db.getAllObjectStoreNames().subscribe(stores => {
      this.availableStores = stores;
      stores.forEach(store => {
        this.selectedStores[store] = false;
      });
    });
  }

  exportSelected() {
    const storesToExport = Object.keys(this.selectedStores)
      .filter(store => this.selectedStores[store]);

    if (storesToExport.length === 0) {
      alert('Please select at least one store');
      return;
    }

    const exports: Record<string, any> = {};
    let pending = storesToExport.length;

    storesToExport.forEach(storeName => {
      this.db.export(storeName).subscribe(data => {
        exports[storeName] = data;
        pending--;

        if (pending === 0) {
          const json = JSON.stringify(exports, null, 2);
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'partial-backup.json';
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    });
  }
}
```

## Database State Monitoring

### Monitor Connection State

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-db-state',
  standalone: true,
  template: `
    <div class="db-state">
      <h3>Database Status</h3>
      <p>State: <span [class]="stateClass()">{{ state() }}</span></p>
    </div>
  `
})
export class DbStateComponent implements OnInit {
  private db = inject(CatbeeIndexedDBService);

  state = signal('unknown');

  ngOnInit() {
    this.db.dbState.subscribe(state => {
      this.state.set(state);
      console.log('Database state changed:', state);
    });
  }

  stateClass() {
    const state = this.state();
    return {
      'state-open': state === 'open',
      'state-error': state === 'error',
      'state-closed': state === 'closed'
    };
  }
}
```

### Monitor Database Events

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-db-events',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="events">
      <h3>Recent Database Events</h3>
      <ul>
        @for (event of events(); track $index) {
          <li>
            <strong>{{ event.type }}</strong> in {{ event.storeName }}
            @if (event.data) {
              <pre>{{ event.data | json }}</pre>
            }
          </li>
        }
      </ul>
    </div>
  `
})
export class DbEventsComponent implements OnInit {
  private db = inject(CatbeeIndexedDBService);

  events = signal<any[]>([]);

  ngOnInit() {
    this.db.events.subscribe(event => {
      console.log('Database event:', event);

      const currentEvents = this.events();
      currentEvents.unshift(event);

      // Keep only last 20 events
      if (currentEvents.length > 20) {
        currentEvents.pop();
      }

      this.events.set([...currentEvents]);
    });
  }
}
```

## Cleanup and Maintenance

### Clear Old Data

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-cleanup',
  standalone: true,
  template: `
    <button (click)="cleanupOldLogs()">Cleanup Old Logs</button>
  `
})
export class CleanupComponent {
  private db = inject(CatbeeIndexedDBService);

  cleanupOldLogs() {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    this.db.delete<LogEntry>('logs', log => log.timestamp < thirtyDaysAgo)
      .subscribe(remaining => {
        console.log(`Deleted old logs. Remaining: ${remaining.length}`);
      });
  }
}
```

### Optimize Database

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-optimize',
  standalone: true,
  template: `
    <button (click)="optimizeDatabase()">Optimize Database</button>
  `
})
export class OptimizeComponent {
  private db = inject(CatbeeIndexedDBService);

  async optimizeDatabase() {
    // Export all data
    const stores = await this.db.getAllObjectStoreNames().toPromise();
    const backup: Record<string, any[]> = {};

    for (const store of stores) {
      backup[store] = await this.db.export(store).toPromise();
    }

    // Delete database
    await this.db.deleteDatabase().toPromise();

    // Reinitialize
    await this.db.initialize().toPromise();

    // Restore data
    for (const store of stores) {
      if (backup[store].length > 0) {
        await this.db.import(store, backup[store]).toPromise();
      }
    }

    console.log('Database optimized');
  }
}
```
