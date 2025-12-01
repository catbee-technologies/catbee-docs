---
id: bulk-operations
title: Bulk Operations
sidebar_position: 3
---

## Bulk Add

### Adding Multiple Items

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-bulk-add',
  standalone: true,
  template: `
    <button (click)="addMultipleUsers()">Add 100 Users</button>
    <p *ngIf="status">{{ status }}</p>
  `
})
export class BulkAddComponent {
  private db = inject(CatbeeIndexedDBService);

  status = '';

  addMultipleUsers() {
    const users: User[] = [];

    // Generate 100 users
    for (let i = 0; i < 100; i++) {
      users.push({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        role: i % 3 === 0 ? 'admin' : 'user'
      });
    }

    this.db.bulkAdd('users', users).subscribe({
      next: (keys) => {
        this.status = `Successfully added ${keys.length} users`;
        console.log('Generated IDs:', keys);
      },
      error: (err) => {
        this.status = 'Error adding users';
        console.error(err);
      }
    });
  }
}
```

### Bulk Add from API

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { switchMap } from 'rxjs/operators';

interface Article {
  id?: number;
  title: string;
  content: string;
  author: string;
}

@Component({
  selector: 'app-import-articles',
  standalone: true,
  template: `
    <button (click)="importArticles()">Import Articles from API</button>
    <p>{{ status }}</p>
  `
})
export class ImportArticlesComponent {
  private http = inject(HttpClient);
  private db = inject(CatbeeIndexedDBService);

  status = '';

  importArticles() {
    this.status = 'Fetching articles...';

    this.http.get<Article[]>('/api/articles')
      .pipe(
        switchMap(articles => {
          this.status = `Importing ${articles.length} articles...`;
          return this.db.bulkAdd('articles', articles);
        })
      )
      .subscribe({
        next: (keys) => {
          this.status = `Successfully imported ${keys.length} articles`;
        },
        error: (err) => {
          this.status = 'Import failed';
          console.error(err);
        }
      });
  }
}
```

### Bulk Add with Deduplication

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-bulk-add-dedupe',
  standalone: true,
  template: `...`
})
export class BulkAddDedupeComponent {
  private db = inject(CatbeeIndexedDBService);

  async addProductsWithDeduplication(products: Product[]) {
    const uniqueProducts: Product[] = [];

    for (const product of products) {
      // Check if SKU already exists
      const existing = await this.db
        .getByIndex<Product>('products', 'sku', product.sku)
        .toPromise();

      if (!existing) {
        uniqueProducts.push(product);
      } else {
        console.log('Skipping duplicate SKU:', product.sku);
      }
    }

    if (uniqueProducts.length > 0) {
      this.db.bulkAdd('products', uniqueProducts).subscribe(keys => {
        console.log(`Added ${keys.length} new products`);
      });
    }
  }
}
```

## Bulk Update

### Updating Multiple Items

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-bulk-update',
  standalone: true,
  template: `
    <button (click)="updateMultipleUsers()">Update Users</button>
  `
})
export class BulkUpdateComponent {
  private db = inject(CatbeeIndexedDBService);

  updateMultipleUsers() {
    const updates: User[] = [
      { id: 1, name: 'Alice Updated', email: 'alice@example.com', role: 'admin' },
      { id: 2, name: 'Bob Updated', email: 'bob@example.com', role: 'user' },
      { id: 3, name: 'Charlie Updated', email: 'charlie@example.com', role: 'moderator' }
    ];

    this.db.bulkPut('users', updates).subscribe({
      next: (lastKey) => {
        console.log('Bulk update completed, last key:', lastKey);
      },
      error: (err) => console.error('Bulk update failed:', err)
    });
  }
}
```

### Bulk Update with Fetch

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-bulk-discount',
  standalone: true,
  template: `
    <button (click)="applyBulkDiscount()">Apply 10% Discount</button>
  `
})
export class BulkDiscountComponent {
  private db = inject(CatbeeIndexedDBService);

  applyBulkDiscount() {
    // Fetch all products in a category
    this.db.getAllByIndex<Product>('products', 'category', 'electronics')
      .subscribe(products => {
        // Apply discount to all
        const updated = products.map(p => ({
          ...p,
          price: p.price * 0.9,
          onSale: true
        }));

        // Bulk update
        this.db.bulkPut('products', updated).subscribe(() => {
          console.log(`Updated ${updated.length} products`);
        });
      });
  }
}
```

### Conditional Bulk Update

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-conditional-update',
  standalone: true,
  template: `...`
})
export class ConditionalUpdateComponent {
  private db = inject(CatbeeIndexedDBService);

  updateExpensiveProducts() {
    this.db.getAll<Product>('products').subscribe(products => {
      // Filter and update only products over $100
      const expensiveProducts = products
        .filter(p => p.price > 100)
        .map(p => ({
          ...p,
          premium: true,
          shippingCost: 0  // Free shipping for expensive items
        }));

      if (expensiveProducts.length > 0) {
        this.db.bulkPut('products', expensiveProducts).subscribe(() => {
          console.log(`Updated ${expensiveProducts.length} premium products`);
        });
      }
    });
  }
}
```

## Bulk Delete

### Deleting Multiple Items by Keys

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-bulk-delete',
  standalone: true,
  template: `
    <button (click)="deleteSelectedUsers()">Delete Selected Users</button>
  `
})
export class BulkDeleteComponent {
  private db = inject(CatbeeIndexedDBService);

  deleteSelectedUsers() {
    const userIdsToDelete = [1, 5, 10, 15, 20];

    this.db.bulkDelete('users', userIdsToDelete).subscribe({
      next: (remainingCount) => {
        console.log(`Deleted users. Remaining items:`, remainingCount);
      },
      error: (err) => console.error('Bulk delete failed:', err)
    });
  }
}
```

### Delete All by Index

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-delete-by-index',
  standalone: true,
  template: `
    <button (click)="deleteGuestUsers()">Delete All Guest Users</button>
  `
})
export class DeleteByIndexComponent {
  private db = inject(CatbeeIndexedDBService);

  deleteGuestUsers() {
    this.db.deleteAllByIndex('users', 'role', 'guest').subscribe({
      next: () => {
        console.log('All guest users deleted');
      },
      error: (err) => console.error('Delete failed:', err)
    });
  }
}
```

### Delete with Query

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-delete-with-query',
  standalone: true,
  template: `
    <button (click)="deleteOldLogs()">Delete Old Logs</button>
  `
})
export class DeleteWithQueryComponent {
  private db = inject(CatbeeIndexedDBService);

  deleteOldLogs() {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    this.db.delete<LogEntry>('logs', log => log.timestamp < thirtyDaysAgo)
      .subscribe(remaining => {
        console.log(`Deleted old logs. Remaining: ${remaining.length}`);
      });
  }
}
```

## Bulk Get

### Fetching Multiple Items by Keys

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bulk-get',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users">
      <h2>Selected Users</h2>
      <ul>
        @for (user of users; track user.id) {
          <li>{{ user.name }} - {{ user.email }}</li>
        }
      </ul>
    </div>
  `
})
export class BulkGetComponent {
  private db = inject(CatbeeIndexedDBService);

  users: User[] = [];

  ngOnInit() {
    const userIds = [1, 3, 5, 7, 9];

    this.db.bulkGet<User>('users', userIds).subscribe({
      next: (users) => {
        this.users = users.filter(u => u !== undefined);
        console.log('Fetched users:', this.users);
      },
      error: (err) => console.error('Bulk get failed:', err)
    });
  }
}
```

### Bulk Get with Processing

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-bulk-get-process',
  standalone: true,
  template: `...`
})
export class BulkGetProcessComponent {
  private db = inject(CatbeeIndexedDBService);

  async loadOrdersWithDetails(orderIds: number[]) {
    // Bulk fetch orders
    const orders = await this.db
      .bulkGet<Order>('orders', orderIds)
      .toPromise();

    // Process each order
    const ordersWithDetails = orders
      .filter(order => order !== undefined)
      .map(order => ({
        ...order,
        total: this.calculateTotal(order),
        status: this.getStatus(order)
      }));

    return ordersWithDetails;
  }

  private calculateTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private getStatus(order: Order): string {
    // Business logic for status
    return order.shipped ? 'Shipped' : 'Processing';
  }
}
```

## Batch Operations

### Mixed Operations in Single Transaction

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-batch-operations',
  standalone: true,
  template: `
    <button (click)="performBatchOperations()">Execute Batch</button>
  `
})
export class BatchOperationsComponent {
  private db = inject(CatbeeIndexedDBService);

  performBatchOperations() {
    this.db.batch('users', [
      // Add new users
      {
        type: 'add',
        value: { name: 'New User 1', email: 'new1@example.com', role: 'user' }
      },
      {
        type: 'add',
        value: { name: 'New User 2', email: 'new2@example.com', role: 'user' }
      },
      // Update existing user
      {
        type: 'update',
        value: { id: 5, name: 'Updated User', email: 'updated@example.com', role: 'admin' }
      },
      // Delete users
      { type: 'delete', key: 10 },
      { type: 'delete', key: 11 }
    ]).subscribe({
      next: () => {
        console.log('Batch operations completed successfully');
      },
      error: (err) => {
        console.error('Batch failed, all changes rolled back:', err);
      }
    });
  }
}
```

### Batch with Validation

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-validated-batch',
  standalone: true,
  template: `...`
})
export class ValidatedBatchComponent {
  private db = inject(CatbeeIndexedDBService);

  async performValidatedBatch(operations: any[]) {
    // Validate all operations first
    const validOperations = [];

    for (const op of operations) {
      if (op.type === 'add') {
        // Check for duplicates
        const existing = await this.db
          .getByIndex<User>('users', 'email', op.value.email)
          .toPromise();

        if (!existing) {
          validOperations.push(op);
        } else {
          console.warn('Skipping duplicate email:', op.value.email);
        }
      } else {
        validOperations.push(op);
      }
    }

    // Execute validated operations
    if (validOperations.length > 0) {
      this.db.batch('users', validOperations).subscribe({
        next: () => console.log(`Executed ${validOperations.length} operations`),
        error: (err) => console.error('Batch failed:', err)
      });
    }
  }
}
```

## Import/Export

### Export Data

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-export-data',
  standalone: true,
  template: `
    <button (click)="exportUsers()">Export Users</button>
    <button (click)="exportAllData()">Export All Data</button>
  `
})
export class ExportDataComponent {
  private db = inject(CatbeeIndexedDBService);

  exportUsers() {
    this.db.export<User>('users').subscribe(users => {
      const json = JSON.stringify(users, null, 2);
      this.downloadFile(json, 'users-backup.json');
    });
  }

  exportAllData() {
    this.db.getAllObjectStoreNames().subscribe(storeNames => {
      const exports: Record<string, any[]> = {};
      let pending = storeNames.length;

      storeNames.forEach(storeName => {
        this.db.export(storeName).subscribe(data => {
          exports[storeName] = data;
          pending--;

          if (pending === 0) {
            const json = JSON.stringify(exports, null, 2);
            this.downloadFile(json, 'database-backup.json');
          }
        });
      });
    });
  }

  private downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
```

### Import Data

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-import-data',
  standalone: true,
  template: `
    <input
      type="file"
      accept="application/json"
      (change)="onFileSelected($event)"
    />
    <button (click)="importData()">Import</button>
    <p>{{ status }}</p>
  `
})
export class ImportDataComponent {
  private db = inject(CatbeeIndexedDBService);

  selectedFile: File | null = null;
  status = '';

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  importData() {
    if (!this.selectedFile) {
      this.status = 'Please select a file';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = JSON.parse(e.target.result);
        this.importToDatabase(data);
      } catch (err) {
        this.status = 'Invalid JSON file';
        console.error(err);
      }
    };
    reader.readAsText(this.selectedFile);
  }

  private importToDatabase(data: User[]) {
    this.status = `Importing ${data.length} records...`;

    this.db.import('users', data).subscribe({
      next: () => {
        this.status = `Successfully imported ${data.length} records`;
      },
      error: (err) => {
        this.status = 'Import failed';
        console.error(err);
      }
    });
  }
}
```

### Import with Merge

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-import-merge',
  standalone: true,
  template: `...`
})
export class ImportMergeComponent {
  private db = inject(CatbeeIndexedDBService);

  async importWithMerge(data: User[]) {
    // Get existing users
    const existing = await this.db.getAll<User>('users').toPromise();
    const existingEmails = new Set(existing.map(u => u.email));

    // Separate new and updates
    const newUsers: User[] = [];
    const updates: User[] = [];

    data.forEach(user => {
      if (existingEmails.has(user.email)) {
        updates.push(user);
      } else {
        newUsers.push(user);
      }
    });

    // Import new users
    if (newUsers.length > 0) {
      await this.db.bulkAdd('users', newUsers).toPromise();
    }

    // Update existing users
    if (updates.length > 0) {
      await this.db.bulkPut('users', updates).toPromise();
    }

    console.log(`Imported ${newUsers.length} new users, updated ${updates.length}`);
  }
}
```

## Performance Tips

### Chunked Bulk Operations

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-chunked-bulk',
  standalone: true,
  template: `...`
})
export class ChunkedBulkComponent {
  private db = inject(CatbeeIndexedDBService);

  async addLargeDataset(items: Product[]) {
    const chunkSize = 100;

    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);

      await this.db.bulkAdd('products', chunk).toPromise();

      console.log(`Processed ${Math.min(i + chunkSize, items.length)} of ${items.length}`);
    }

    console.log('Import complete');
  }
}
```

### Parallel Bulk Operations

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-parallel-bulk',
  standalone: true,
  template: `...`
})
export class ParallelBulkComponent {
  private db = inject(CatbeeIndexedDBService);

  importMultipleStores(data: any) {
    // Import to multiple stores in parallel
    forkJoin({
      users: this.db.bulkAdd('users', data.users),
      products: this.db.bulkAdd('products', data.products),
      orders: this.db.bulkAdd('orders', data.orders)
    }).subscribe({
      next: (results) => {
        console.log('All imports completed:', results);
      },
      error: (err) => console.error('Import failed:', err)
    });
  }
}
```
