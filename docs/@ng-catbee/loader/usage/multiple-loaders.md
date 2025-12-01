---
id: multiple-loaders
title: Multiple Loaders
sidebar_position: 3
---

# Multiple Loaders

Learn how to manage multiple named loaders simultaneously in your Angular application.

## Why Multiple Loaders?

Multiple loaders allow you to:

- Show loading states for different sections independently
- Use different animations for different operations
- Manage complex UI states with multiple async operations
- Provide better user experience with contextual loading indicators

## Creating Named Loaders

Each loader must have a unique `name` to be controlled independently:

```typescript
import { Component } from '@angular/core';
import { CatbeeLoader } from '@ng-catbee/loader';

@Component({
  selector: 'app-multi',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <!-- Main content loader -->
    <ng-catbee-loader name="main-content" />

    <!-- Sidebar loader -->
    <ng-catbee-loader name="sidebar" />

    <!-- Header loader -->
    <ng-catbee-loader name="header" />
  `,
})
export class MultiLoaderComponent { }
```

## Independent Control

Control each loader independently using its name:

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-independent',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader name="main" />
    <ng-catbee-loader name="sidebar" />

    <div class="content">
      <button (click)="loadMain()">Load Main</button>
      <button (click)="loadSidebar()">Load Sidebar</button>
      <button (click)="loadBoth()">Load Both</button>
    </div>
  `,
})
export class IndependentComponent {
  private loaderService = inject(CatbeeLoaderService);

  async loadMain() {
    await this.loaderService.show('main');
    await this.fetchMainContent();
    await this.loaderService.hide('main');
  }

  async loadSidebar() {
    await this.loaderService.show('sidebar');
    await this.fetchSidebarData();
    await this.loaderService.hide('sidebar');
  }

  async loadBoth() {
    // Show both loaders
    await this.loaderService.show('main');
    await this.loaderService.show('sidebar');

    // Load data in parallel
    await Promise.all([
      this.fetchMainContent(),
      this.fetchSidebarData()
    ]);

    // Hide both loaders
    await this.loaderService.hide('main');
    await this.loaderService.hide('sidebar');
  }

  private async fetchMainContent() {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async fetchSidebarData() {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }
}
```

## Different Configurations

Each loader can have its own configuration:

```typescript
<ng-catbee-loader
  name="main"
  animation="ball-spin-clockwise"
  size="large"
  [backgroundColor]="'rgba(0, 0, 0, 0.8)'"
  [loaderColor]="'#2196F3'"
  [fullscreen]="true"
  [message]="'Loading main content...'"
/>

<ng-catbee-loader
  name="sidebar"
  animation="line-scale"
  size="medium"
  [backgroundColor]="'rgba(255, 255, 255, 0.9)'"
  [loaderColor]="'#FF9800'"
  [fullscreen]="false"
  [zIndex]="1000"
  [message]="'Loading sidebar...'"
/>

<ng-catbee-loader
  name="header"
  animation="ball-pulse"
  size="small"
  [backgroundColor]="'transparent'"
  [loaderColor]="'#4CAF50'"
  [fullscreen]="false"
/>
```

## Section-Specific Loaders

Use loaders for specific UI sections:

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <!-- Different loaders for different sections -->
    <ng-catbee-loader
      name="user-profile"
      animation="ball-spin-clockwise"
      [message]="'Loading profile...'"
    />

    <ng-catbee-loader
      name="recent-activity"
      animation="line-scale"
      [message]="'Loading activity...'"
    />

    <ng-catbee-loader
      name="statistics"
      animation="ball-grid-pulse"
      [message]="'Loading statistics...'"
    />

    <ng-catbee-loader
      name="notifications"
      animation="ball-pulse"
      [message]="'Loading notifications...'"
    />

    <div class="dashboard">
      <section class="profile">
        <h2>User Profile</h2>
        <button (click)="loadProfile()">Refresh Profile</button>
      </section>

      <section class="activity">
        <h2>Recent Activity</h2>
        <button (click)="loadActivity()">Refresh Activity</button>
      </section>

      <section class="stats">
        <h2>Statistics</h2>
        <button (click)="loadStats()">Refresh Stats</button>
      </section>

      <section class="notifications">
        <h2>Notifications</h2>
        <button (click)="loadNotifications()">Refresh Notifications</button>
      </section>
    </div>
  `,
  styles: [`
    .dashboard {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 1rem;
    }

    section {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  `]
})
export class DashboardComponent {
  private loaderService = inject(CatbeeLoaderService);

  async loadProfile() {
    await this.loaderService.show('user-profile');
    try {
      await this.fetchUserProfile();
    } finally {
      await this.loaderService.hide('user-profile');
    }
  }

  async loadActivity() {
    await this.loaderService.show('recent-activity');
    try {
      await this.fetchRecentActivity();
    } finally {
      await this.loaderService.hide('recent-activity');
    }
  }

  async loadStats() {
    await this.loaderService.show('statistics');
    try {
      await this.fetchStatistics();
    } finally {
      await this.loaderService.hide('statistics');
    }
  }

  async loadNotifications() {
    await this.loaderService.show('notifications');
    try {
      await this.fetchNotifications();
    } finally {
      await this.loaderService.hide('notifications');
    }
  }

  private async fetchUserProfile() {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async fetchRecentActivity() {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }

  private async fetchStatistics() {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async fetchNotifications() {
    return new Promise(resolve => setTimeout(resolve, 800));
  }
}
```

## Managing Multiple Loaders

### Hide All Loaders

Hide all active loaders at once:

```typescript
async resetAll() {
  // Hide all loaders regardless of their names
  await this.loaderService.hideAll();
}
```

### Check Visible Loaders

Get a list of all currently visible loaders:

```typescript
getActiveLoaders() {
  const visibleLoaders = this.loaderService.getVisibleLoaders();
  console.log('Currently visible:', visibleLoaders);
  // Example output: ['main', 'sidebar', 'header']
  return visibleLoaders;
}

hasAnyLoaders() {
  return this.loaderService.getVisibleLoaders().length > 0;
}
```

### Sequential Loading

Load data sequentially, showing different loaders:

```typescript
async loadSequentially() {
  // Step 1: Load user data
  await this.loaderService.show('user', {
    message: 'Loading user data...'
  });
  await this.fetchUserData();
  await this.loaderService.hide('user');

  // Step 2: Load preferences
  await this.loaderService.show('preferences', {
    message: 'Loading preferences...'
  });
  await this.fetchPreferences();
  await this.loaderService.hide('preferences');

  // Step 3: Load settings
  await this.loaderService.show('settings', {
    message: 'Loading settings...'
  });
  await this.fetchSettings();
  await this.loaderService.hide('settings');
}
```

### Parallel Loading

Load data in parallel with different loaders:

```typescript
async loadParallel() {
  // Show all loaders
  await Promise.all([
    this.loaderService.show('user', { message: 'Loading user...' }),
    this.loaderService.show('preferences', { message: 'Loading preferences...' }),
    this.loaderService.show('settings', { message: 'Loading settings...' })
  ]);

  // Load all data in parallel
  const [userData, preferences, settings] = await Promise.all([
    this.fetchUserData(),
    this.fetchPreferences(),
    this.fetchSettings()
  ]);

  // Hide all loaders
  await Promise.all([
    this.loaderService.hide('user'),
    this.loaderService.hide('preferences'),
    this.loaderService.hide('settings')
  ]);

  return { userData, preferences, settings };
}
```

## Fullscreen vs Inline Loaders

Combine fullscreen and inline loaders:

```typescript
<ng-catbee-loader
  name="global"
  [fullscreen]="true"
  [zIndex]="999999"
  animation="ball-spin-clockwise"
  [message]="'Processing...'"
/>

<ng-catbee-loader
  name="section-a"
  [fullscreen]="false"
  [zIndex]="1000"
  animation="line-scale"
  [width]="'100%'"
  [height]="'200px'"
/>

<ng-catbee-loader
  name="section-b"
  [fullscreen]="false"
  [zIndex]="1000"
  animation="ball-pulse"
  [width]="'100%'"
  [height]="'200px'"
/>
```

## Different Animations

Use different animations for different loaders:

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-animations',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader
      name="primary"
      animation="ball-spin-clockwise"
      [loaderColor]="'#2196F3'"
    />

    <ng-catbee-loader
      name="secondary"
      animation="line-scale"
      [loaderColor]="'#FF9800'"
    />

    <ng-catbee-loader
      name="tertiary"
      animation="pacman"
      [loaderColor]="'#4CAF50'"
    />

    <div class="actions">
      <button (click)="primaryAction()">Primary Action</button>
      <button (click)="secondaryAction()">Secondary Action</button>
      <button (click)="tertiaryAction()">Tertiary Action</button>
    </div>
  `,
})
export class AnimationsComponent {
  private loaderService = inject(CatbeeLoaderService);

  async primaryAction() {
    await this.loaderService.show('primary', {
      message: 'Primary loading...'
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.loaderService.hide('primary');
  }

  async secondaryAction() {
    await this.loaderService.show('secondary', {
      message: 'Secondary loading...'
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.loaderService.hide('secondary');
  }

  async tertiaryAction() {
    await this.loaderService.show('tertiary', {
      message: 'Tertiary loading...'
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.loaderService.hide('tertiary');
  }
}
```

## Complete Example

Here's a comprehensive example using multiple loaders:

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-complete-multi',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <!-- Global fullscreen loader -->
    <ng-catbee-loader
      name="global"
      animation="ball-spin-clockwise"
      [fullscreen]="true"
      [message]="'Processing...'"
    />

    <!-- Header loader -->
    <ng-catbee-loader
      name="header"
      animation="ball-pulse"
      size="small"
      [fullscreen]="false"
      [backgroundColor]="'transparent'"
    />

    <!-- Main content loader -->
    <ng-catbee-loader
      name="content"
      animation="ball-grid-pulse"
      [fullscreen]="false"
      [message]="'Loading content...'"
    />

    <!-- Sidebar loader -->
    <ng-catbee-loader
      name="sidebar"
      animation="line-scale"
      size="small"
      [fullscreen]="false"
      [message]="'Loading sidebar...'"
    />

    <!-- Form loader -->
    <ng-catbee-loader
      name="form"
      animation="cog"
      [message]="'Saving...'"
    />

    <div class="app-layout">
      <header>
        <h1>My Application</h1>
        <button (click)="refreshHeader()">Refresh Header</button>
      </header>

      <aside>
        <h2>Sidebar</h2>
        <button (click)="refreshSidebar()">Refresh Sidebar</button>
      </aside>

      <main>
        <h2>Main Content</h2>
        <button (click)="refreshContent()">Refresh Content</button>
        <button (click)="submitForm()">Submit Form</button>
        <button (click)="refreshAll()">Refresh All</button>
        <button (click)="resetAll()">Hide All Loaders</button>
      </main>

      <footer>
        <p>Active loaders: {{ activeLoaders.join(', ') || 'None' }}</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-layout {
      display: grid;
      grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
      grid-template-columns: 250px 1fr;
      grid-template-rows: auto 1fr auto;
      min-height: 100vh;
      gap: 1rem;
    }

    header { grid-area: header; padding: 1rem; background: #f5f5f5; }
    aside { grid-area: sidebar; padding: 1rem; background: #e0e0e0; }
    main { grid-area: main; padding: 1rem; }
    footer { grid-area: footer; padding: 1rem; background: #f5f5f5; text-align: center; }

    button {
      margin: 0.5rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
  `]
})
export class CompleteMultiComponent implements OnInit {
  private loaderService = inject(CatbeeLoaderService);
  activeLoaders: string[] = [];

  ngOnInit() {
    // Watch for loader changes
    this.updateActiveLoaders();
    setInterval(() => this.updateActiveLoaders(), 500);
  }

  updateActiveLoaders() {
    this.activeLoaders = this.loaderService.getVisibleLoaders();
  }

  async refreshHeader() {
    await this.loaderService.show('header');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      await this.loaderService.hide('header');
    }
  }

  async refreshContent() {
    await this.loaderService.show('content');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      await this.loaderService.hide('content');
    }
  }

  async refreshSidebar() {
    await this.loaderService.show('sidebar');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      await this.loaderService.hide('sidebar');
    }
  }

  async submitForm() {
    await this.loaderService.show('form');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      await this.loaderService.hide('form');
    }
  }

  async refreshAll() {
    // Show all loaders
    await Promise.all([
      this.loaderService.show('header'),
      this.loaderService.show('content'),
      this.loaderService.show('sidebar')
    ]);

    // Load all data in parallel
    await Promise.all([
      new Promise(resolve => setTimeout(resolve, 1000)),
      new Promise(resolve => setTimeout(resolve, 2000)),
      new Promise(resolve => setTimeout(resolve, 1500))
    ]);

    // Hide all loaders
    await Promise.all([
      this.loaderService.hide('header'),
      this.loaderService.hide('content'),
      this.loaderService.hide('sidebar')
    ]);
  }

  async resetAll() {
    await this.loaderService.hideAll();
  }
}
```

## Best Practices

1. **Use Descriptive Names**: Make names meaningful

   ```typescript
   // ✅ Good
   <ng-catbee-loader name="user-profile" />
   <ng-catbee-loader name="order-history" />

   // ❌ Bad
   <ng-catbee-loader name="loader1" />
   <ng-catbee-loader name="loader2" />
   ```

2. **Manage Z-Index**: Ensure proper stacking

   ```typescript
   <ng-catbee-loader name="global" [zIndex]="999999" [fullscreen]="true" />
   <ng-catbee-loader name="modal" [zIndex]="10000" [fullscreen]="false" />
   <ng-catbee-loader name="section" [zIndex]="1000" [fullscreen]="false" />
   ```

3. **Clean Up**: Always hide loaders when done

   ```typescript
   try {
     await this.loaderService.show('my-loader');
     await this.operation();
   } finally {
     await this.loaderService.hide('my-loader');
   }
   ```

4. **Track State**: Monitor active loaders
   ```typescript
   const activeLoaders = this.loaderService.getVisibleLoaders();
   if (activeLoaders.length > 0) {
     console.log('Some loaders are still active');
   }
   ```

## Next Steps

- [Advanced Features](./advanced-features.md) - Custom templates, delays, and more
- [API Reference](../api-reference.md) - Complete API documentation
- [Basic Usage](./basic-usage.md) - Review basic concepts
