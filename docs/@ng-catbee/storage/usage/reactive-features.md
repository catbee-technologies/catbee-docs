---
id: reactive-features
title: Reactive Features
sidebar_position: 3
---

## Watching Single Keys

### Basic Key Watching

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-theme-watcher',
  standalone: true,
  template: `
    <div [attr.data-theme]="currentTheme">
      <p>Current theme: {{ currentTheme }}</p>
      <button (click)="toggleTheme()">Toggle Theme</button>
    </div>
  `
})
export class ThemeWatcherComponent implements OnInit, OnDestroy {
  private localStorage = inject(CatbeeLocalStorageService);
  private destroy$ = new Subject<void>();

  currentTheme = 'light';

  ngOnInit() {
    // Watch for theme changes
    this.localStorage.watch('theme')
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme ?? 'light';
        this.applyTheme(this.currentTheme);
      });

    // Load initial theme
    this.currentTheme = this.localStorage.get('theme') ?? 'light';
    this.applyTheme(this.currentTheme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.localStorage.set('theme', newTheme);
    // The watch() observable will automatically update currentTheme
  }

  private applyTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Watching with Signals

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-settings-watcher',
  standalone: true,
  template: `
    <div class="settings">
      <p>Font Size: {{ fontSize() }}px</p>
      <button (click)="increaseFontSize()">Increase</button>
      <button (click)="decreaseFontSize()">Decrease</button>
    </div>
  `
})
export class SettingsWatcherComponent implements OnInit {
  private localStorage = inject(CatbeeLocalStorageService);
  fontSize = signal(16);

  ngOnInit() {
    // Watch fontSize changes and update signal
    this.localStorage.watch('fontSize').subscribe(value => {
      const size = parseInt(value ?? '16', 10);
      this.fontSize.set(size);
    });

    // Load initial value
    const initial = this.localStorage.getNumberWithDefault('fontSize', 16);
    this.fontSize.set(initial);
  }

  increaseFontSize() {
    const newSize = this.fontSize() + 2;
    this.localStorage.set('fontSize', String(newSize));
  }

  decreaseFontSize() {
    const newSize = Math.max(12, this.fontSize() - 2);
    this.localStorage.set('fontSize', String(newSize));
  }
}
```

## Watching All Changes

### Monitor All Storage Activity

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

interface StorageEvent {
  key: string | null;
  oldValue: string | null;
  newValue: string | null;
  timestamp: Date;
}

@Component({
  selector: 'app-storage-monitor',
  standalone: true,
  template: `
    <div class="monitor">
      <h3>Storage Activity Log</h3>
      <div class="events">
        @for (event of events(); track event.timestamp) {
          <div class="event">
            <strong>{{ event.key }}</strong>
            <span class="old">{{ event.oldValue }}</span>
            <span>→</span>
            <span class="new">{{ event.newValue }}</span>
            <time>{{ event.timestamp | date:'medium' }}</time>
          </div>
        }
      </div>
    </div>
  `
})
export class StorageMonitorComponent implements OnInit {
  private localStorage = inject(CatbeeLocalStorageService);
  events = signal<StorageEvent[]>([]);

  ngOnInit() {
    this.localStorage.watchAll().subscribe(event => {
      const newEvent: StorageEvent = {
        key: event.key,
        oldValue: event.oldValue,
        newValue: event.newValue,
        timestamp: new Date()
      };

      this.events.update(events => [newEvent, ...events].slice(0, 20));
      console.log('Storage changed:', newEvent);
    });
  }
}
```

## Cross-Tab Synchronization

### Sync State Across Tabs

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
}

@Component({
  selector: 'app-cart-sync',
  standalone: true,
  template: `
    <div class="cart">
      <h3>Shopping Cart (Synced across tabs)</h3>
      <p>Items: {{ cartItems().length }}</p>
      @for (item of cartItems(); track item.id) {
        <div class="item">
          {{ item.name }} ({{ item.quantity }})
          <button (click)="removeItem(item.id)">Remove</button>
        </div>
      }
      <button (click)="addRandomItem()">Add Item</button>
    </div>
  `
})
export class CartSyncComponent implements OnInit {
  private localStorage = inject(CatbeeLocalStorageService);
  cartItems = signal<CartItem[]>([]);

  ngOnInit() {
    // Load initial cart
    this.loadCart();

    // Watch for changes from other tabs
    this.localStorage.watch('cart').subscribe(() => {
      this.loadCart();
      console.log('Cart updated from another tab');
    });
  }

  private loadCart() {
    const items = this.localStorage.getArrayWithDefault<CartItem>('cart', []);
    this.cartItems.set(items);
  }

  addRandomItem() {
    const items = this.cartItems();
    const newItem: CartItem = {
      id: Date.now(),
      name: `Item ${items.length + 1}`,
      quantity: 1
    };

    const updatedCart = [...items, newItem];
    this.localStorage.setArray('cart', updatedCart);
    this.cartItems.set(updatedCart);
  }

  removeItem(id: number) {
    const items = this.cartItems().filter(item => item.id !== id);
    this.localStorage.setArray('cart', items);
    this.cartItems.set(items);
  }
}
```

### Real-Time Notifications

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  template: `
    <div class="notifications">
      <div class="badge">{{ unreadCount() }}</div>
      @for (notification of notifications(); track notification.id) {
        <div class="notification" [class.unread]="!notification.read">
          <p>{{ notification.message }}</p>
          <button (click)="markAsRead(notification.id)">Mark as Read</button>
        </div>
      }
    </div>
  `
})
export class NotificationsComponent implements OnInit {
  private localStorage = inject(CatbeeLocalStorageService);
  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);

  ngOnInit() {
    this.loadNotifications();

    // Sync notifications across tabs
    this.localStorage.watch('notifications').subscribe(() => {
      this.loadNotifications();
    });
  }

  private loadNotifications() {
    const notifs = this.localStorage.getArrayWithDefault<Notification>('notifications', []);
    this.notifications.set(notifs);
    this.unreadCount.set(notifs.filter(n => !n.read).length);
  }

  markAsRead(id: number) {
    const notifs = this.notifications();
    const notification = notifs.find(n => n.id === id);

    if (notification) {
      notification.read = true;
      this.localStorage.setArray('notifications', notifs);
      this.loadNotifications();
    }
  }
}
```

## Reactive Forms Integration

### Two-Way Binding with Storage

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-form-autosave',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <input formControlName="email" placeholder="Email">
      <input formControlName="username" placeholder="Username">
      <textarea formControlName="bio" placeholder="Bio"></textarea>
      <p class="status">{{ saveStatus }}</p>
    </form>
  `
})
export class FormAutosaveComponent implements OnInit {
  private fb = inject(FormBuilder);
  private localStorage = inject(CatbeeLocalStorageService);

  saveStatus = '';
  form!: FormGroup;

  ngOnInit() {
    // Create form
    this.form = this.fb.group({
      email: [''],
      username: [''],
      bio: ['']
    });

    // Load saved data
    const savedData = this.localStorage.getJsonWithDefault('formData', {
      email: '',
      username: '',
      bio: ''
    });
    this.form.patchValue(savedData);

    // Auto-save on changes
    this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        this.localStorage.setJson('formData', value);
        this.saveStatus = 'Saved at ' + new Date().toLocaleTimeString();
      });
  }
}
```

## Computed Values

### Derived State from Storage

```typescript
import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

interface UserPreferences {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
}

@Component({
  selector: 'app-typography',
  standalone: true,
  template: `
    <div [style]="computedStyles()">
      <p>Sample text with custom typography</p>
      <p>Font: {{ prefs().fontFamily }}</p>
      <p>Size: {{ prefs().fontSize }}px</p>
      <p>Line height: {{ prefs().lineHeight }}</p>
    </div>
  `
})
export class TypographyComponent implements OnInit {
  private localStorage = inject(CatbeeLocalStorageService);

  prefs = signal<UserPreferences>({
    fontSize: 16,
    lineHeight: 1.5,
    fontFamily: 'Arial'
  });

  computedStyles = computed(() => {
    const p = this.prefs();
    return {
      fontSize: `${p.fontSize}px`,
      lineHeight: `${p.lineHeight}`,
      fontFamily: p.fontFamily
    };
  });

  ngOnInit() {
    // Watch preferences
    this.localStorage.watch('typography').subscribe(() => {
      const prefs = this.localStorage.getJsonWithDefault<UserPreferences>(
        'typography',
        this.prefs()
      );
      this.prefs.set(prefs);
    });

    // Load initial
    const initial = this.localStorage.getJsonWithDefault<UserPreferences>(
      'typography',
      this.prefs()
    );
    this.prefs.set(initial);
  }
}
```

## Async Operations

### Loading States

```typescript
import { Component, inject, signal } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-data-loader',
  standalone: true,
  template: `
    <div>
      @if (loading()) {
        <p>Loading data...</p>
      } @else if (error()) {
        <p class="error">{{ error() }}</p>
      } @else {
        <pre>{{ data() | json }}</pre>
      }
      <button (click)="loadData()">Reload</button>
    </div>
  `
})
export class DataLoaderComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  loading = signal(false);
  error = signal<string | null>(null);
  data = signal<any>(null);

  loadData() {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Simulate async loading
      setTimeout(() => {
        const cachedData = this.localStorage.getJson('cachedData');

        if (cachedData) {
          this.data.set(cachedData);
        } else {
          this.error.set('No cached data found');
        }

        this.loading.set(false);
      }, 1000);
    } catch (err) {
      this.error.set('Failed to load data');
      this.loading.set(false);
    }
  }
}
```
