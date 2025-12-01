---
id: usage
title: Usage
sidebar_position: 3
---

# Usage Examples

This section contains practical examples for common IndexedDB operations and patterns.

## Quick Links

- [Basic CRUD Operations](./basic-crud) - Create, Read, Update, Delete
- [Advanced Queries](./advanced-queries) - Query builder, filtering, sorting, pagination
- [Bulk Operations](./bulk-operations) - Bulk add, update, delete
- [Database Management](./database-management) - Migrations, dynamic stores, export/import

## Common Use Cases

### Offline Data Storage

Store API responses locally for offline access and cache management.

```typescript
db.getAll<Article>('articles').subscribe(articles => {
  if (articles.length === 0) {
    // Fetch from API and cache
    http.get('/api/articles').subscribe(data => {
      db.bulkAdd('articles', data).subscribe();
    });
  }
});
```

### User Preferences

Persist user settings across sessions.

```typescript
const preferences = {
  theme: 'dark',
  language: 'en',
  notifications: true
};

db.update('settings', { id: 'user-prefs', ...preferences }).subscribe();
```

### Form Draft Auto-Save

Automatically save form data to prevent loss.

```typescript
form.valueChanges
  .pipe(debounceTime(2000))
  .subscribe(value => {
    db.update('drafts', { id: 'article-draft', data: value }).subscribe();
  });
```

### Shopping Cart Persistence

Store cart items locally for seamless shopping experience.

```typescript
interface CartItem {
  productId: number;
  quantity: number;
  price: number;
}

db.getAll<CartItem>('cart').subscribe(items => {
  console.log('Cart items:', items);
});
```

### Search History

Track and display user search history.

```typescript
db.add('searchHistory', {
  query: searchTerm,
  timestamp: Date.now()
}).subscribe();

// Get recent searches
db.query<SearchRecord>('searchHistory')
  .orderBy('timestamp', 'desc')
  .limit(10)
  .execute()
  .subscribe(history => {
    console.log('Recent searches:', history);
  });
```

### File Storage

Store files and blobs in IndexedDB.

```typescript
interface FileEntry {
  id?: number;
  name: string;
  type: string;
  size: number;
  blob: Blob;
}

const fileEntry: FileEntry = {
  name: file.name,
  type: file.type,
  size: file.size,
  blob: file
};

db.add('files', fileEntry).subscribe(saved => {
  console.log('File saved with ID:', saved.id);
});
```

### Pagination

Implement efficient pagination for large datasets.

```typescript
db.query<Product>('products')
  .orderBy('name', 'asc')
  .offset(page * pageSize)
  .limit(pageSize)
  .execute()
  .subscribe(products => {
    console.log(`Page ${page}:`, products);
  });
```

### Data Synchronization

Sync local data with server and track changes.

```typescript
// Mark as synced
db.update('articles', { id: 123, synced: true }).subscribe();

// Get unsynced items
db.query<Article>('articles')
  .where('synced', '=', false)
  .execute()
  .subscribe(unsynced => {
    // Send to server
  });
```

### Advanced Search

Build complex search queries with multiple filters.

```typescript
db.query<Product>('products')
  .where('category', '=', 'electronics')
  .where('price', '>=', 100)
  .where('price', '<=', 500)
  .where('inStock', '=', true)
  .orderBy('price', 'asc')
  .limit(20)
  .execute()
  .subscribe(products => {
    console.log('Filtered products:', products);
  });
```

### Event Monitoring

Monitor database changes in real-time.

```typescript
db.events.subscribe(event => {
  console.log(`${event.type} event in ${event.storeName}`);

  if (event.type === 'add') {
    console.log('New item added:', event.data);
  }
});
```

### Database Statistics

Get insights about your database usage.

```typescript
db.getDatabaseVersion().subscribe(version => {
  console.log('Version:', version);
});

db.getAllObjectStoreNames().subscribe(stores => {
  stores.forEach(store => {
    db.count(store).subscribe(count => {
      console.log(`${store}: ${count} records`);
    });
  });
});
```

### Cache with Expiration

Implement caching with automatic expiration.

```typescript
// Enable caching in config (5 minute expiry)
provideCatbeeIndexedDB({
  cache: { enabled: true, expirySeconds: 300 }
})

// Use cached data
db.cached(
  'users',
  'user-list',
  () => db.getAll<User>('users')
).subscribe(users => {
  // Returns cached data if available and not expired
});

// Force refresh
db.invalidateCache('users');
```

## Performance Tips

### Use Bulk Operations

When adding or updating multiple records, use bulk methods:

```typescript
// ❌ Slow: Multiple individual operations
items.forEach(item => db.add('products', item).subscribe());

// ✅ Fast: Single bulk operation
db.bulkAdd('products', items).subscribe();
```

### Leverage Indexes

Create indexes for fields you frequently query:

```typescript
// Configure index in app.config.ts
storeSchema: [
  { name: 'email', keypath: 'email', options: { unique: true } },
  { name: 'status', keypath: 'status', options: { unique: false } }
]

// Query using index (fast)
db.getAllByIndex('users', 'status', 'active').subscribe();
```

### Use Transactions for Atomic Operations

Group related operations in transactions:

```typescript
db.batch('orders', [
  { type: 'add', value: newOrder },
  { type: 'update', value: updatedInventory },
  { type: 'delete', key: oldOrderId }
]).subscribe();
```

### Cursor for Large Datasets

Use cursors for memory-efficient iteration:

```typescript
let count = 0;
db.openCursor({ storeName: 'logs', mode: DBMode.ReadOnly })
  .subscribe({
    next: (cursor) => {
      count++;
      cursor.continue();
    },
    complete: () => console.log('Processed', count, 'records')
  });
```

## Next Steps

Explore detailed examples in the following sections:

- **[Basic CRUD Operations](./basic-crud)** - Learn fundamental database operations
- **[Advanced Queries](./advanced-queries)** - Master complex querying techniques
- **[Bulk Operations](./bulk-operations)** - Efficient batch processing
- **[Database Management](./database-management)** - Migrations, dynamic stores, and maintenance
