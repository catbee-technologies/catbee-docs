---
id: advanced-queries
title: Advanced Queries
sidebar_position: 2
---

## Query Builder

The query builder provides a fluent API for building complex queries with filtering, sorting, and pagination.

### Basic Query

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { CommonModule } from '@angular/common';

interface Product {
  id?: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="products">
      <h2>Electronics Products</h2>
      <ul>
        @for (product of products(); track product.id) {
          <li>
            {{ product.name }} - ${{ product.price }}
            @if (product.inStock) {
              <span class="badge">In Stock</span>
            }
          </li>
        }
      </ul>
    </div>
  `
})
export class ProductSearchComponent implements OnInit {
  private db = inject(CatbeeIndexedDBService);

  products = signal<Product[]>([]);

  ngOnInit() {
    this.db.query<Product>('products')
      .where('category', '=', 'electronics')
      .execute()
      .subscribe(products => {
        this.products.set(products);
      });
  }
}
```

### Multiple Filters

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-filtered-products',
  standalone: true,
  template: `
    <div class="filtered-products">
      <h2>Available Electronics ($100-$500)</h2>
      <ul>
        @for (product of products(); track product.id) {
          <li>{{ product.name }} - ${{ product.price }}</li>
        }
      </ul>
    </div>
  `
})
export class FilteredProductsComponent {
  private db = inject(CatbeeIndexedDBService);

  products = signal<Product[]>([]);

  ngOnInit() {
    this.db.query<Product>('products')
      .where('category', '=', 'electronics')
      .where('price', '>=', 100)
      .where('price', '<=', 500)
      .where('inStock', '=', true)
      .execute()
      .subscribe(products => {
        this.products.set(products);
      });
  }
}
```

### Sorting Results

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-sorted-products',
  standalone: true,
  template: `
    <div class="controls">
      <button (click)="sortByPrice('asc')">Price: Low to High</button>
      <button (click)="sortByPrice('desc')">Price: High to Low</button>
      <button (click)="sortByName()">Sort by Name</button>
    </div>

    <div class="products">
      <ul>
        @for (product of products(); track product.id) {
          <li>{{ product.name }} - ${{ product.price }}</li>
        }
      </ul>
    </div>
  `
})
export class SortedProductsComponent {
  private db = inject(CatbeeIndexedDBService);

  products = signal<Product[]>([]);

  sortByPrice(direction: 'asc' | 'desc') {
    this.db.query<Product>('products')
      .where('category', '=', 'electronics')
      .orderBy('price', direction)
      .execute()
      .subscribe(products => {
        this.products.set(products);
      });
  }

  sortByName() {
    this.db.query<Product>('products')
      .where('category', '=', 'electronics')
      .orderBy('name', 'asc')
      .execute()
      .subscribe(products => {
        this.products.set(products);
      });
  }
}
```

### Pagination

```typescript
import { Component, inject, signal } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginated-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-container">
      <h2>Users - Page {{ currentPage() + 1 }}</h2>

      <ul class="user-list">
        @for (user of users(); track user.id) {
          <li>{{ user.name }} - {{ user.email }}</li>
        }
      </ul>

      <div class="pagination-controls">
        <button
          (click)="previousPage()"
          [disabled]="currentPage() === 0">
          Previous
        </button>
        <span>Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
        <button
          (click)="nextPage()"
          [disabled]="currentPage() >= totalPages() - 1">
          Next
        </button>
      </div>
    </div>
  `
})
export class PaginatedListComponent {
  private db = inject(CatbeeIndexedDBService);

  users = signal<User[]>([]);
  currentPage = signal(0);
  pageSize = 20;
  totalPages = signal(1);

  ngOnInit() {
    this.loadTotalPages();
    this.loadPage(0);
  }

  loadTotalPages() {
    this.db.count('users').subscribe(total => {
      this.totalPages.set(Math.ceil(total / this.pageSize));
    });
  }

  loadPage(page: number) {
    this.db.query<User>('users')
      .orderBy('name', 'asc')
      .offset(page * this.pageSize)
      .limit(this.pageSize)
      .execute()
      .subscribe(users => {
        this.users.set(users);
        this.currentPage.set(page);
      });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.loadPage(this.currentPage() + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 0) {
      this.loadPage(this.currentPage() - 1);
    }
  }
}
```

### Limit Results

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-top-products',
  standalone: true,
  template: `
    <div class="top-products">
      <h2>Top 10 Most Expensive Products</h2>
      <ol>
        @for (product of topProducts(); track product.id) {
          <li>{{ product.name }} - ${{ product.price }}</li>
        }
      </ol>
    </div>
  `
})
export class TopProductsComponent {
  private db = inject(CatbeeIndexedDBService);

  topProducts = signal<Product[]>([]);

  ngOnInit() {
    this.db.query<Product>('products')
      .orderBy('price', 'desc')
      .limit(10)
      .execute()
      .subscribe(products => {
        this.topProducts.set(products);
      });
  }
}
```

## Index-Based Queries

### Query by Index with Range

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-price-range',
  standalone: true,
  template: `
    <div class="price-range">
      <h2>Products in Price Range</h2>
      <ul>
        @for (product of products(); track product.id) {
          <li>{{ product.name }} - ${{ product.price }}</li>
        }
      </ul>
    </div>
  `
})
export class PriceRangeComponent {
  private db = inject(CatbeeIndexedDBService);

  products = signal<Product[]>([]);

  ngOnInit() {
    // Get products priced between $50 and $200
    const priceRange = IDBKeyRange.bound(50, 200);

    this.db.getAllByIndex<Product>('products', 'price', priceRange)
      .subscribe(products => {
        this.products.set(products);
      });
  }
}
```

### Query by Index with Direction

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-recent-users',
  standalone: true,
  template: `
    <div class="recent-users">
      <h2>Recently Registered Users</h2>
      <ul>
        @for (user of recentUsers(); track user.id) {
          <li>
            {{ user.name }} - {{ user.createdAt | date }}
          </li>
        }
      </ul>
    </div>
  `
})
export class RecentUsersComponent {
  private db = inject(CatbeeIndexedDBService);

  recentUsers = signal<User[]>([]);

  ngOnInit() {
    // Get users ordered by createdAt descending
    this.db.getAllByIndex<User>(
      'users',
      'createdAt',
      undefined,
      'prev' // Reverse order (newest first)
    ).subscribe(users => {
      // Take only the 10 most recent
      this.recentUsers.set(users.slice(0, 10));
    });
  }
}
```

### Count by Index

```typescript
import { Component, inject, signal } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-category-stats',
  standalone: true,
  template: `
    <div class="stats">
      <h2>Product Categories</h2>
      <ul>
        <li>Electronics: {{ electronicCount() }}</li>
        <li>Clothing: {{ clothingCount() }}</li>
        <li>Books: {{ bookCount() }}</li>
      </ul>
    </div>
  `
})
export class CategoryStatsComponent {
  private db = inject(CatbeeIndexedDBService);

  electronicCount = signal(0);
  clothingCount = signal(0);
  bookCount = signal(0);

  ngOnInit() {
    this.db.countByIndex('products', 'category', 'electronics')
      .subscribe(count => this.electronicCount.set(count));

    this.db.countByIndex('products', 'category', 'clothing')
      .subscribe(count => this.clothingCount.set(count));

    this.db.countByIndex('products', 'category', 'books')
      .subscribe(count => this.bookCount.set(count));
  }
}
```

## Cursor-Based Queries

### Iterate with Cursor

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService, DBMode } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-cursor-iteration',
  standalone: true,
  template: `
    <div class="results">
      <p>Processed {{ processedCount }} records</p>
      <button (click)="processAll()">Process All Users</button>
    </div>
  `
})
export class CursorIterationComponent {
  private db = inject(CatbeeIndexedDBService);

  processedCount = 0;

  processAll() {
    this.processedCount = 0;

    this.db.openCursor<User>({
      storeName: 'users',
      mode: DBMode.ReadOnly
    }).subscribe({
      next: (cursor) => {
        const user = cursor.value;
        console.log('Processing user:', user.name);
        this.processedCount++;

        // Continue to next record
        cursor.continue();
      },
      complete: () => {
        console.log('Finished processing', this.processedCount, 'users');
      }
    });
  }
}
```

### Cursor with Index

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService, DBMode } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-cursor-by-index',
  standalone: true,
  template: `...`
})
export class CursorByIndexComponent {
  private db = inject(CatbeeIndexedDBService);

  processAdminUsers() {
    const adminUsers: User[] = [];

    this.db.openCursorByIndex<User>({
      storeName: 'users',
      indexName: 'role',
      mode: DBMode.ReadOnly,
      query: 'admin'
    }).subscribe({
      next: (cursor) => {
        adminUsers.push(cursor.value);
        cursor.continue();
      },
      complete: () => {
        console.log('Found admin users:', adminUsers);
      }
    });
  }
}
```

### Cursor with Pagination

```typescript
import { Component, inject, signal } from '@angular/core';
import { CatbeeIndexedDBService, DBMode } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-cursor-pagination',
  standalone: true,
  template: `
    <div class="pagination">
      <ul>
        @for (item of currentPage(); track item.id) {
          <li>{{ item.name }}</li>
        }
      </ul>

      <button (click)="loadPreviousPage()" [disabled]="pageNum() === 0">
        Previous
      </button>
      <span>Page {{ pageNum() + 1 }}</span>
      <button (click)="loadNextPage()">Next</button>
    </div>
  `
})
export class CursorPaginationComponent {
  private db = inject(CatbeeIndexedDBService);

  currentPage = signal<User[]>([]);
  pageNum = signal(0);
  pageSize = 10;

  loadPage(page: number) {
    let count = 0;
    const skip = page * this.pageSize;
    const results: User[] = [];

    this.db.openCursor<User>({
      storeName: 'users',
      mode: DBMode.ReadOnly
    }).subscribe({
      next: (cursor) => {
        if (count >= skip && count < skip + this.pageSize) {
          results.push(cursor.value);
        }
        count++;

        if (count < skip + this.pageSize) {
          cursor.continue();
        }
      },
      complete: () => {
        this.currentPage.set(results);
        this.pageNum.set(page);
      }
    });
  }

  loadNextPage() {
    this.loadPage(this.pageNum() + 1);
  }

  loadPreviousPage() {
    if (this.pageNum() > 0) {
      this.loadPage(this.pageNum() - 1);
    }
  }
}
```

### Update Records During Iteration

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService, DBMode } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-bulk-update-cursor',
  standalone: true,
  template: `
    <button (click)="updateAllPrices()">Apply 10% Discount</button>
  `
})
export class BulkUpdateCursorComponent {
  private db = inject(CatbeeIndexedDBService);

  updateAllPrices() {
    let updatedCount = 0;

    this.db.openCursor<Product>({
      storeName: 'products',
      mode: DBMode.ReadWrite
    }).subscribe({
      next: (cursor) => {
        const product = cursor.value;

        // Apply 10% discount
        product.price = product.price * 0.9;

        // Update the record
        cursor.update(product);
        updatedCount++;

        cursor.continue();
      },
      complete: () => {
        console.log('Updated', updatedCount, 'products');
      }
    });
  }
}
```

## Complex Search

### Multi-Field Search

```typescript
import { Component, inject, signal } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-form">
      <h2>Advanced Product Search</h2>

      <select [(ngModel)]="category">
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="books">Books</option>
      </select>

      <input
        type="number"
        [(ngModel)]="minPrice"
        placeholder="Min Price"
      />
      <input
        type="number"
        [(ngModel)]="maxPrice"
        placeholder="Max Price"
      />

      <label>
        <input type="checkbox" [(ngModel)]="onlyInStock" />
        In Stock Only
      </label>

      <button (click)="search()">Search</button>

      <div class="results">
        <h3>Results ({{ results().length }})</h3>
        <ul>
          @for (product of results(); track product.id) {
            <li>
              {{ product.name }} - ${{ product.price }}
              @if (!product.inStock) {
                <span class="out-of-stock">Out of Stock</span>
              }
            </li>
          }
        </ul>
      </div>
    </div>
  `
})
export class AdvancedSearchComponent {
  private db = inject(CatbeeIndexedDBService);

  category = '';
  minPrice = 0;
  maxPrice = 10000;
  onlyInStock = false;

  results = signal<Product[]>([]);

  search() {
    let query = this.db.query<Product>('products');

    // Apply filters conditionally
    if (this.category) {
      query = query.where('category', '=', this.category);
    }

    if (this.minPrice > 0) {
      query = query.where('price', '>=', this.minPrice);
    }

    if (this.maxPrice < 10000) {
      query = query.where('price', '<=', this.maxPrice);
    }

    if (this.onlyInStock) {
      query = query.where('inStock', '=', true);
    }

    // Execute query
    query
      .orderBy('price', 'asc')
      .execute()
      .subscribe(products => {
        this.results.set(products);
      });
  }
}
```

### Text Search (Client-Side)

```typescript
import { Component, inject, signal } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search">
      <input
        [(ngModel)]="searchTerm"
        (keyup)="search()"
        placeholder="Search products..."
      />

      <ul>
        @for (product of filteredProducts(); track product.id) {
          <li>{{ product.name }} - {{ product.category }}</li>
        }
      </ul>
    </div>
  `
})
export class TextSearchComponent {
  private db = inject(CatbeeIndexedDBService);

  searchTerm = '';
  allProducts: Product[] = [];
  filteredProducts = signal<Product[]>([]);

  ngOnInit() {
    // Load all products once
    this.db.getAll<Product>('products').subscribe(products => {
      this.allProducts = products;
      this.filteredProducts.set(products);
    });
  }

  search() {
    const term = this.searchTerm.toLowerCase();

    const filtered = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );

    this.filteredProducts.set(filtered);
  }
}
```

## Performance Optimization

### Query with Limit for Large Datasets

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-optimized-query',
  standalone: true,
  template: `...`
})
export class OptimizedQueryComponent {
  private db = inject(CatbeeIndexedDBService);

  loadRecentItems() {
    // Only fetch what you need
    this.db.query<LogEntry>('logs')
      .orderBy('timestamp', 'desc')
      .limit(50)  // Only get latest 50
      .execute()
      .subscribe(logs => {
        console.log('Recent logs:', logs);
      });
  }
}
```

### Index-Based Filtering

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-indexed-filter',
  standalone: true,
  template: `...`
})
export class IndexedFilterComponent {
  private db = inject(CatbeeIndexedDBService);

  getActiveUsers() {
    // ✅ Fast: Uses index
    this.db.getAllByIndex<User>('users', 'status', 'active')
      .subscribe(users => {
        console.log('Active users:', users);
      });
  }

  getInactiveUsers() {
    // ❌ Slower: Scans all records
    this.db.query<User>('users')
      .where('status', '=', 'inactive')
      .execute()
      .subscribe(users => {
        console.log('Inactive users:', users);
      });
  }
}
```
