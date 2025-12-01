---
id: type-safe-methods
title: Type-Safe Methods
sidebar_position: 2
---

:::tip

```typescript
import { CookieService, SsrCookieService } from '@ng-catbee/cookie';
```

Use `CookieService` in browser contexts and `SsrCookieService` for server-side rendering (SSR) scenarios.
:::

:::warning
`SsrCookieService` provides only getting cookies from the request headers and does not support setting cookies.
:::

## JSON Cookies

### Basic JSON Storage

```typescript
import { Component, inject } from '@angular/core';
import { CookieService } from '@ng-catbee/cookie';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  fontSize: number;
}

@Component({
  selector: 'app-preferences',
  standalone: true,
  template: `
    <div class="preferences">
      <h2>User Preferences</h2>

      <label>
        Theme:
        <select [(ngModel)]="preferences.theme" (change)="savePreferences()">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </label>

      <label>
        Notifications:
        <input type="checkbox" [(ngModel)]="preferences.notifications"
               (change)="savePreferences()" />
      </label>

      <button (click)="resetPreferences()">Reset to Defaults</button>
    </div>
  `
})
export class PreferencesComponent {
  private cookieService = inject(CookieService);

  preferences: UserPreferences = {
    theme: 'light',
    language: 'en',
    notifications: true,
    fontSize: 14
  };

  ngOnInit() {
    this.loadPreferences();
  }

  loadPreferences() {
    // Read-only: returns null if missing
    const prefs = this.cookieService.getJson<UserPreferences>('userPrefs');
    if (prefs) {
      this.preferences = prefs;
    }
  }

  loadPreferencesWithDefault() {
    // Auto-set: returns value or sets default if missing/invalid
    this.preferences = this.cookieService.getJsonWithDefault(
      'userPrefs',
      {
        theme: 'light',
        language: 'en',
        notifications: true,
        fontSize: 14
      },
      { expires: 30 }
    );
  }

  savePreferences() {
    this.cookieService.setJson('userPrefs', this.preferences, {
      expires: 30
    });
  }

  resetPreferences() {
    this.cookieService.delete('userPrefs');
    this.loadPreferencesWithDefault();
  }
}
```

### Complex Objects

```typescript
import { Component, inject } from '@angular/core';
import { CookieService } from '@ng-catbee/cookie';

interface ShoppingCart {
  items: CartItem[];
  total: number;
  currency: string;
  lastUpdated: string;
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  template: `
    <div class="cart">
      <h2>Shopping Cart ({{ cart.items.length }} items)</h2>

      @for (item of cart.items; track item.id) {
        <div class="cart-item">
          <span>{{ item.name }}</span>
          <span>{{ item.quantity }} x ${{ item.price }}</span>
          <button (click)="removeItem(item.id)">Remove</button>
        </div>
      }

      <div class="cart-total">
        Total: {{ cart.currency }}{{ cart.total }}
      </div>

      <button (click)="clearCart()">Clear Cart</button>
    </div>
  `
})
export class ShoppingCartComponent {
  private cookieService = inject(CookieService);

  cart: ShoppingCart = {
    items: [],
    total: 0,
    currency: 'USD',
    lastUpdated: new Date().toISOString()
  };

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cart = this.cookieService.getJsonWithDefault(
      'shoppingCart',
      this.cart,
      { expires: 7 }
    );
  }

  addItem(item: CartItem) {
    this.cart.items.push(item);
    this.cart.total += item.price * item.quantity;
    this.cart.lastUpdated = new Date().toISOString();
    this.saveCart();
  }

  removeItem(itemId: string) {
    const index = this.cart.items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      const item = this.cart.items[index];
      this.cart.total -= item.price * item.quantity;
      this.cart.items.splice(index, 1);
      this.cart.lastUpdated = new Date().toISOString();
      this.saveCart();
    }
  }

  saveCart() {
    this.cookieService.setJson('shoppingCart', this.cart, {
      expires: 7
    });
  }

  clearCart() {
    this.cart = {
      items: [],
      total: 0,
      currency: 'USD',
      lastUpdated: new Date().toISOString()
    };
    this.saveCart();
  }
}
```

## Array Cookies

### String Arrays

```typescript
import { Component, inject } from '@angular/core';
import { CookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-recent-searches',
  standalone: true,
  template: `
    <div class="recent-searches">
      <h3>Recent Searches</h3>

      @if (searches.length > 0) {
        <ul>
          @for (search of searches; track search) {
            <li>
              <a (click)="performSearch(search)">{{ search }}</a>
              <button (click)="removeSearch(search)">×</button>
            </li>
          }
        </ul>
        <button (click)="clearSearches()">Clear All</button>
      } @else {
        <p>No recent searches</p>
      }
    </div>
  `
})
export class RecentSearchesComponent {
  private cookieService = inject(CookieService);
  searches: string[] = [];
  maxSearches = 10;

  ngOnInit() {
    this.loadSearches();
  }

  loadSearches() {
    // Read-only: returns null if missing
    const searches = this.cookieService.getArray<string>('recentSearches');
    if (searches) {
      this.searches = searches;
    }
  }

  loadSearchesWithDefault() {
    // Auto-set: returns array or sets default if missing/invalid
    this.searches = this.cookieService.getArrayWithDefault(
      'recentSearches',
      [],
      { expires: 30 }
    );
  }

  addSearch(query: string) {
    // Remove if already exists
    this.searches = this.searches.filter(s => s !== query);

    // Add to beginning
    this.searches.unshift(query);

    // Keep only last N searches
    this.searches = this.searches.slice(0, this.maxSearches);

    this.saveSearches();
  }

  removeSearch(query: string) {
    this.searches = this.searches.filter(s => s !== query);
    this.saveSearches();
  }

  clearSearches() {
    this.searches = [];
    this.cookieService.delete('recentSearches');
  }

  saveSearches() {
    this.cookieService.setArray('recentSearches', this.searches, {
      expires: 30
    });
  }

  performSearch(query: string) {
    // Perform search...
    this.addSearch(query);
  }
}
```

### Object Arrays

```typescript
import { Component, inject } from '@angular/core';
import { CookieService } from '@ng-catbee/cookie';

interface RecentItem {
  id: string;
  title: string;
  url: string;
  timestamp: number;
}

@Component({
  selector: 'app-recent-items',
  standalone: true,
  template: `
    <div class="recent-items">
      <h3>Recently Viewed</h3>

      @for (item of recentItems; track item.id) {
        <div class="item">
          <a [href]="item.url">{{ item.title }}</a>
          <small>{{ formatTime(item.timestamp) }}</small>
        </div>
      }
    </div>
  `
})
export class RecentItemsComponent {
  private cookieService = inject(CookieService);
  recentItems: RecentItem[] = [];

  ngOnInit() {
    this.recentItems = this.cookieService.getArrayWithDefault<RecentItem>(
      'recentItems',
      [],
      { expires: 7 }
    );
  }

  addItem(id: string, title: string, url: string) {
    // Remove if already exists
    this.recentItems = this.recentItems.filter(item => item.id !== id);

    // Add to beginning
    this.recentItems.unshift({
      id,
      title,
      url,
      timestamp: Date.now()
    });

    // Keep only last 20 items
    this.recentItems = this.recentItems.slice(0, 20);

    this.saveItems();
  }

  saveItems() {
    this.cookieService.setArray('recentItems', this.recentItems, {
      expires: 7
    });
  }

  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }
}
```

## Boolean Cookies

### Feature Flags

```typescript
import { Component, inject } from '@angular/core';
import { CookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-feature-flags',
  standalone: true,
  template: `
    <div class="settings">
      <h2>Feature Settings</h2>

      <label>
        <input type="checkbox" [(ngModel)]="betaFeatures"
               (change)="saveBetaFeatures()" />
        Enable Beta Features
      </label>

      <label>
        <input type="checkbox" [(ngModel)]="darkMode"
               (change)="saveDarkMode()" />
        Dark Mode
      </label>

      <label>
        <input type="checkbox" [(ngModel)]="analyticsEnabled"
               (change)="saveAnalytics()" />
        Enable Analytics
      </label>
    </div>
  `
})
export class FeatureFlagsComponent {
  private cookieService = inject(CookieService);

  betaFeatures = false;
  darkMode = false;
  analyticsEnabled = true;

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    // Read-only: returns false if missing
    this.betaFeatures = this.cookieService.getBoolean('betaFeatures');
    this.darkMode = this.cookieService.getBoolean('darkMode');

    // Auto-set: returns value or sets default if missing/invalid
    this.analyticsEnabled = this.cookieService.getBooleanWithDefault(
      'analyticsEnabled',
      true,
      { expires: 365 }
    );
  }

  saveBetaFeatures() {
    this.cookieService.set('betaFeatures', this.betaFeatures.toString(), {
      expires: 365
    });
  }

  saveDarkMode() {
    this.cookieService.set('darkMode', this.darkMode.toString(), {
      expires: 365
    });
  }

  saveAnalytics() {
    this.cookieService.set('analyticsEnabled', this.analyticsEnabled.toString(), {
      expires: 365
    });
  }
}
```

### Cookie Consent

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  template: `
    @if (!cookiesAccepted && showBanner) {
      <div class="cookie-banner">
        <p>We use cookies to improve your experience.</p>
        <button (click)="acceptCookies()">Accept</button>
        <button (click)="declineCookies()">Decline</button>
      </div>
    }
  `
})
export class CookieBannerComponent implements OnInit {
  private cookieService = inject(CookieService);

  cookiesAccepted = false;
  showBanner = true;

  ngOnInit() {
    // Check if user has already made a choice
    const hasConsented = this.cookieService.has('cookieConsent');

    if (hasConsented) {
      this.cookiesAccepted = this.cookieService.getBoolean('cookieConsent');
      this.showBanner = false;
    }
  }

  acceptCookies() {
    this.cookieService.set('cookieConsent', 'true', {
      expires: 365,
      secure: true,
      sameSite: 'Lax'
    });
    this.cookiesAccepted = true;
    this.showBanner = false;
  }

  declineCookies() {
    this.cookieService.set('cookieConsent', 'false', {
      expires: 365,
      secure: true,
      sameSite: 'Lax'
    });
    this.cookiesAccepted = false;
    this.showBanner = false;
  }
}
```

## Number Cookies

### Counters and Analytics

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-page-analytics',
  standalone: true,
  template: `
    <div class="analytics">
      <p>Page views: {{ pageViews }}</p>
      <p>Visits: {{ visitCount }}</p>
      <p>Last visit: {{ lastVisit | date }}</p>
    </div>
  `
})
export class PageAnalyticsComponent implements OnInit {
  private cookieService = inject(CookieService);

  pageViews = 0;
  visitCount = 0;
  lastVisit: Date | null = null;

  ngOnInit() {
    this.trackPageView();
    this.trackVisit();
  }

  trackPageView() {
    // Read-only: returns NaN if missing
    const views = this.cookieService.getNumber('pageViews');

    // Auto-set with default: returns value or sets default if missing/invalid
    const currentViews = this.cookieService.getNumberWithDefault('pageViews', 0);

    this.pageViews = currentViews + 1;

    this.cookieService.set('pageViews', this.pageViews.toString(), {
      expires: 365
    });
  }

  trackVisit() {
    // Increment visit count if this is a new session
    if (!this.cookieService.has('currentSession')) {
      const visits = this.cookieService.getNumberWithDefault('visitCount', 0);
      this.visitCount = visits + 1;

      this.cookieService.set('visitCount', this.visitCount.toString(), {
        expires: 365
      });

      // Set session cookie (expires when browser closes)
      this.cookieService.set('currentSession', 'true');
    } else {
      this.visitCount = this.cookieService.getNumber('visitCount');
    }
  }
}
```

### Ratings and Scores

```typescript
import { Component, inject } from '@angular/core';
import { CookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-rating',
  standalone: true,
  template: `
    <div class="rating">
      <h3>Rate this article</h3>

      @if (!hasRated) {
        <div class="stars">
          @for (star of [1,2,3,4,5]; track star) {
            <button (click)="rate(star)">⭐</button>
          }
        </div>
      } @else {
        <p>Thank you for rating! You gave {{ userRating }} stars.</p>
      }

      <p>Average rating: {{ averageRating.toFixed(1) }} ({{ ratingCount }} ratings)</p>
    </div>
  `
})
export class RatingComponent {
  private cookieService = inject(CookieService);

  hasRated = false;
  userRating = 0;
  averageRating = 0;
  ratingCount = 0;

  ngOnInit() {
    this.loadRating();
  }

  loadRating() {
    // Check if user has already rated
    this.userRating = this.cookieService.getNumber('articleRating');
    this.hasRated = !isNaN(this.userRating);

    // Load aggregate data (would typically come from server)
    this.averageRating = this.cookieService.getNumberWithDefault('avgRating', 0);
    this.ratingCount = this.cookieService.getNumberWithDefault('ratingCount', 0);
  }

  rate(stars: number) {
    this.cookieService.set('articleRating', stars.toString(), {
      expires: 365
    });

    this.userRating = stars;
    this.hasRated = true;

    // Update aggregate (simplified - normally done server-side)
    this.ratingCount++;
    this.averageRating = ((this.averageRating * (this.ratingCount - 1)) + stars) / this.ratingCount;

    this.cookieService.set('avgRating', this.averageRating.toString());
    this.cookieService.set('ratingCount', this.ratingCount.toString());
  }
}
```

## Enum Cookies

### Theme Selection

```typescript
import { Component, inject } from '@angular/core';
import { CookieService } from '@ng-catbee/cookie';

type Theme = 'light' | 'dark' | 'auto';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  template: `
    <div class="theme-selector">
      <h3>Choose Theme</h3>

      <select [(ngModel)]="currentTheme" (change)="saveTheme()">
        @for (theme of themes; track theme) {
          <option [value]="theme">{{ theme | titlecase }}</option>
        }
      </select>
    </div>
  `
})
export class ThemeSelectorComponent {
  private cookieService = inject(CookieService);

  readonly themes: readonly Theme[] = ['light', 'dark', 'auto'];
  currentTheme: Theme = 'light';

  ngOnInit() {
    this.loadTheme();
  }

  loadTheme() {
    // Read-only: returns null if missing or invalid
    const theme = this.cookieService.getEnum<Theme>('theme', this.themes);
    if (theme) {
      this.currentTheme = theme;
    }
  }

  loadThemeWithDefault() {
    // Auto-set: returns value or sets default if missing/invalid
    this.currentTheme = this.cookieService.getEnumWithDefault(
      'theme',
      'light',
      this.themes,
      { expires: 365 }
    );
  }

  saveTheme() {
    this.cookieService.set('theme', this.currentTheme, {
      expires: 365
    });
  }
}
```

### Language Preferences

```typescript
import { Component, inject } from '@angular/core';
import { CookieService } from '@ng-catbee/cookie';

type Language = 'en' | 'es' | 'fr' | 'de' | 'ja';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  template: `
    <div class="language-selector">
      <select [(ngModel)]="currentLanguage" (change)="changeLanguage()">
        @for (lang of languages; track lang.code) {
          <option [value]="lang.code">{{ lang.name }}</option>
        }
      </select>
    </div>
  `
})
export class LanguageSelectorComponent {
  private cookieService = inject(CookieService);

  readonly languageCodes: readonly Language[] = ['en', 'es', 'fr', 'de', 'ja'];

  readonly languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' }
  ];

  currentLanguage: Language = 'en';

  ngOnInit() {
    this.currentLanguage = this.cookieService.getEnumWithDefault(
      'language',
      'en',
      this.languageCodes,
      { expires: 365 }
    );
  }

  changeLanguage() {
    // Validate before saving
    if (this.languageCodes.includes(this.currentLanguage)) {
      this.cookieService.set('language', this.currentLanguage, {
        expires: 365,
        path: '/'
      });

      // Reload page or update translations
      window.location.reload();
    }
  }
}
```

### User Roles

```typescript
import { Component, inject } from '@angular/core';
import { CookieService } from '@ng-catbee/cookie';

type UserRole = 'guest' | 'user' | 'moderator' | 'admin';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <h2>Welcome, {{ username }}</h2>
      <p>Role: {{ userRole }}</p>

      @if (userRole === 'admin' || userRole === 'moderator') {
        <div class="admin-panel">
          <h3>Administration</h3>
          <!-- Admin features -->
        </div>
      }

      @if (userRole === 'guest') {
        <div class="guest-message">
          <p>Sign up to unlock more features!</p>
        </div>
      }
    </div>
  `
})
export class UserDashboardComponent {
  private cookieService = inject(CookieService);

  readonly roles: readonly UserRole[] = ['guest', 'user', 'moderator', 'admin'];

  username = '';
  userRole: UserRole = 'guest';

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.username = this.cookieService.get('username') || 'Guest';

    // Get role with validation
    this.userRole = this.cookieService.getEnumWithDefault(
      'userRole',
      'guest',
      this.roles,
      { expires: 7 }
    );
  }

  hasPermission(requiredRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
      'guest': 0,
      'user': 1,
      'moderator': 2,
      'admin': 3
    };

    return roleHierarchy[this.userRole] >= roleHierarchy[requiredRole];
  }
}
```

## Next Steps

- [Advanced Features](./advanced-features) - Partial updates and bulk operations
- [API Reference](../api-reference) - Complete method documentation
- [Basic Usage](./basic-usage) - Learn fundamental operations
