---
id: type-safe-methods
title: Type-Safe Methods
sidebar_position: 2
---

## JSON Storage

### Basic JSON Objects

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

interface UserSettings {
  theme: string;
  language: string;
  notifications: boolean;
  fontSize: number;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="settings">
      <button (click)="saveSettings()">Save Settings</button>
      <button (click)="loadSettings()">Load Settings</button>
      <pre>{{ currentSettings | json }}</pre>
    </div>
  `
})
export class SettingsComponent {
  private localStorage = inject(CatbeeLocalStorageService);
  currentSettings: UserSettings | null = null;

  saveSettings() {
    const settings: UserSettings = {
      theme: 'dark',
      language: 'en',
      notifications: true,
      fontSize: 16
    };

    this.localStorage.setJson('userSettings', settings);
    console.log('Settings saved');
  }

  loadSettings() {
    // Returns null if not found or invalid JSON
    this.currentSettings = this.localStorage.getJson<UserSettings>('userSettings');
  }
}
```

### JSON With Defaults

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

interface AppConfig {
  apiUrl: string;
  timeout: number;
  retryAttempts: number;
  debug: boolean;
}

@Component({
  selector: 'app-config',
  standalone: true
})
export class AppConfigComponent implements OnInit {
  private localStorage = inject(CatbeeLocalStorageService);
  config!: AppConfig;

  ngOnInit() {
    // Auto-sets default if missing or invalid
    this.config = this.localStorage.getJsonWithDefault<AppConfig>('appConfig', {
      apiUrl: 'https://api.example.com',
      timeout: 5000,
      retryAttempts: 3,
      debug: false
    });

    console.log('Loaded config:', this.config);
  }

  updateApiUrl(newUrl: string) {
    this.config.apiUrl = newUrl;
    this.localStorage.setJson('appConfig', this.config);
  }
}
```

### Complex Nested Objects

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

interface UserProfile {
  id: string;
  personal: {
    firstName: string;
    lastName: string;
    email: string;
  };
  preferences: {
    theme: string;
    language: string;
    privacy: {
      shareEmail: boolean;
      showOnline: boolean;
    };
  };
  metadata: {
    createdAt: string;
    lastLogin: string;
  };
}

@Component({
  selector: 'app-profile'
})
export class ProfileComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  saveProfile(profile: UserProfile) {
    this.localStorage.setJson('userProfile', profile);
  }

  loadProfile(): UserProfile | null {
    return this.localStorage.getJson<UserProfile>('userProfile');
  }
}
```

## Array Storage

### String Arrays

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-tags',
  standalone: true,
  template: `
    <div>
      <input #tagInput placeholder="Add tag">
      <button (click)="addTag(tagInput.value); tagInput.value = ''">Add</button>

      <ul>
        @for (tag of tags; track tag) {
          <li>{{ tag }}</li>
        }
      </ul>
    </div>
  `
})
export class TagsComponent {
  private localStorage = inject(CatbeeLocalStorageService);
  tags: string[] = [];

  ngOnInit() {
    // Returns empty array if not found
    this.tags = this.localStorage.getArrayWithDefault<string>('tags', []);
  }

  addTag(tag: string) {
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.localStorage.setArray('tags', this.tags);
    }
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
    this.localStorage.setArray('tags', this.tags);
  }
}
```

### Object Arrays

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-todos',
  standalone: true,
  template: `
    <div class="todos">
      @for (todo of todos; track todo.id) {
        <div class="todo-item">
          <input
            type="checkbox"
            [checked]="todo.completed"
            (change)="toggleTodo(todo.id)">
          <span [class.completed]="todo.completed">{{ todo.title }}</span>
        </div>
      }
    </div>
  `
})
export class TodosComponent {
  private localStorage = inject(CatbeeLocalStorageService);
  todos: TodoItem[] = [];

  ngOnInit() {
    this.todos = this.localStorage.getArrayWithDefault<TodoItem>('todos', []);
  }

  addTodo(title: string) {
    const newTodo: TodoItem = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.todos.push(newTodo);
    this.saveTodos();
  }

  toggleTodo(id: number) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
    }
  }

  private saveTodos() {
    this.localStorage.setArray('todos', this.todos);
  }
}
```

## Boolean Storage

### Feature Flags

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-features',
  standalone: true,
  template: `
    <div class="features">
      @if (showNewUI()) {
        <div class="new-ui">New UI Enabled!</div>
      }

      @if (darkModeEnabled()) {
        <div class="dark-mode">Dark Mode Active</div>
      }
    </div>
  `
})
export class FeaturesComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  // Recognizes: true, false, 1, 0, yes, no, on, off
  showNewUI = () => this.localStorage.getBooleanWithDefault('newUI', false);
  darkModeEnabled = () => this.localStorage.getBooleanWithDefault('darkMode', false);

  enableNewUI() {
    this.localStorage.set('newUI', 'true');
  }

  toggleDarkMode() {
    const current = this.darkModeEnabled();
    this.localStorage.set('darkMode', String(!current));
  }
}
```

### Cookie Consent

```typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  template: `
    @if (!hasConsent()) {
      <div class="cookie-banner">
        <p>We use cookies to improve your experience.</p>
        <button (click)="acceptCookies()">Accept</button>
        <button (click)="declineCookies()">Decline</button>
      </div>
    }
  `
})
export class CookieBannerComponent implements OnInit {
  private localStorage = inject(CatbeeLocalStorageService);
  hasConsent = signal(false);

  ngOnInit() {
    // Check if user has already made a choice
    const consent = this.localStorage.getBoolean('cookieConsent');
    this.hasConsent.set(consent !== null);
  }

  acceptCookies() {
    this.localStorage.set('cookieConsent', 'true');
    this.hasConsent.set(true);
  }

  declineCookies() {
    this.localStorage.set('cookieConsent', 'false');
    this.hasConsent.set(true);
  }
}
```

## Number Storage

### Counters

```typescript
import { Component, inject, signal } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div class="counter">
      <p>Count: {{ count() }}</p>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
      <button (click)="reset()">Reset</button>
    </div>
  `
})
export class CounterComponent {
  private localStorage = inject(CatbeeLocalStorageService);
  count = signal(0);

  ngOnInit() {
    // Load saved count or default to 0
    const savedCount = this.localStorage.getNumberWithDefault('counter', 0);
    this.count.set(savedCount);
  }

  increment() {
    const newCount = this.count() + 1;
    this.count.set(newCount);
    this.localStorage.set('counter', String(newCount));
  }

  decrement() {
    const newCount = this.count() - 1;
    this.count.set(newCount);
    this.localStorage.set('counter', String(newCount));
  }

  reset() {
    this.count.set(0);
    this.localStorage.set('counter', '0');
  }
}
```

### User Ratings

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

interface ProductRating {
  productId: string;
  rating: number;
  timestamp: string;
}

@Component({
  selector: 'app-rating'
})
export class RatingComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  saveRating(productId: string, rating: number) {
    // Store individual rating
    this.localStorage.set(`rating_${productId}`, String(rating));

    // Update average rating count
    const totalRatings = this.localStorage.getNumberWithDefault('totalRatings', 0);
    this.localStorage.set('totalRatings', String(totalRatings + 1));
  }

  getRating(productId: string): number | null {
    return this.localStorage.getNumber(`rating_${productId}`);
  }

  getAverageRating(): number {
    const total = this.localStorage.getNumberWithDefault('totalRatings', 0);
    const sum = this.localStorage.getNumberWithDefault('ratingSum', 0);
    return total > 0 ? sum / total : 0;
  }
}
```

## Enum Storage

### Theme Selection

```typescript
import { Component, inject, signal } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

type Theme = 'light' | 'dark' | 'auto';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  template: `
    <div class="theme-switcher">
      <label>
        <input
          type="radio"
          value="light"
          [checked]="theme() === 'light'"
          (change)="setTheme('light')">
        Light
      </label>
      <label>
        <input
          type="radio"
          value="dark"
          [checked]="theme() === 'dark'"
          (change)="setTheme('dark')">
        Dark
      </label>
      <label>
        <input
          type="radio"
          value="auto"
          [checked]="theme() === 'auto'"
          (change)="setTheme('auto')">
        Auto
      </label>
    </div>
  `
})
export class ThemeSwitcherComponent {
  private localStorage = inject(CatbeeLocalStorageService);
  theme = signal<Theme>('light');

  ngOnInit() {
    // Validates value is one of the allowed themes
    const savedTheme = this.localStorage.getEnumWithDefault<Theme>(
      'theme',
      'light',
      ['light', 'dark', 'auto']
    );
    this.theme.set(savedTheme);
    this.applyTheme(savedTheme);
  }

  setTheme(newTheme: Theme) {
    this.theme.set(newTheme);
    this.localStorage.set('theme', newTheme);
    this.applyTheme(newTheme);
  }

  private applyTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
```

### Language Preferences

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

type Language = 'en' | 'es' | 'fr' | 'de' | 'ja';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  template: `
    <select [value]="currentLanguage" (change)="changeLanguage($event)">
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
      <option value="ja">日本語</option>
    </select>
  `
})
export class LanguageSelectorComponent {
  private localStorage = inject(CatbeeLocalStorageService);
  currentLanguage: Language = 'en';

  ngOnInit() {
    this.currentLanguage = this.localStorage.getEnumWithDefault<Language>(
      'language',
      'en',
      ['en', 'es', 'fr', 'de', 'ja']
    );
  }

  changeLanguage(event: Event) {
    const select = event.target as HTMLSelectElement;
    const lang = select.value as Language;

    this.currentLanguage = lang;
    this.localStorage.set('language', lang);

    // Trigger language change in your app
    this.loadLanguageResources(lang);
  }

  private loadLanguageResources(lang: Language) {
    // Load translation files, etc.
  }
}
```

### User Role Management

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLocalStorageService } from '@ng-catbee/storage';

type UserRole = 'guest' | 'user' | 'moderator' | 'admin';

@Component({
  selector: 'app-role-manager'
})
export class RoleManagerComponent {
  private localStorage = inject(CatbeeLocalStorageService);

  saveUserRole(role: UserRole) {
    this.localStorage.set('userRole', role);
  }

  getUserRole(): UserRole {
    // Returns validated role or default to 'guest'
    return this.localStorage.getEnumWithDefault<UserRole>(
      'userRole',
      'guest',
      ['guest', 'user', 'moderator', 'admin']
    );
  }

  hasAdminAccess(): boolean {
    const role = this.getUserRole();
    return role === 'admin' || role === 'moderator';
  }

  canModerate(): boolean {
    const role = this.getUserRole();
    return ['admin', 'moderator'].includes(role);
  }
}
```
