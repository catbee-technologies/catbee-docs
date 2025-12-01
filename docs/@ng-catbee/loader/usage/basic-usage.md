---
id: basic-usage
title: Basic Usage
sidebar_position: 1
---

# Basic Usage

Learn the fundamentals of using the @ng-catbee/loader package in your Angular applications.

## Quick Start

### 1. Add the Component

First, import and add the `CatbeeLoader` component to your template:

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader />

    <button (click)="showLoader()">Show Loader</button>
    <button (click)="hideLoader()">Hide Loader</button>
  `,
})
export class ExampleComponent {
  private loaderService = inject(CatbeeLoaderService);

  async showLoader() {
    await this.loaderService.show('default');
  }

  async hideLoader() {
    await this.loaderService.hide('default');
  }
}
```

### 2. Control the Loader

Use the `CatbeeLoaderService` to show and hide loaders programmatically:

```typescript
// Show a loader
await this.loaderService.show('default');

// Hide a loader
await this.loaderService.hide('default');
```

## Showing and Hiding Loaders

### Basic Show/Hide

The simplest way to use the loader:

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-basic',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader />
    <button (click)="loadData()">Load Data</button>
  `,
})
export class BasicComponent {
  private loaderService = inject(CatbeeLoaderService);

  async loadData() {
    // Show loader
    await this.loaderService.show('default');

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Hide loader
    await this.loaderService.hide('default');
  }
}
```

### With Error Handling

Always use try/finally blocks to ensure loaders are hidden even when errors occur:

```typescript
async loadData() {
  await this.loaderService.show('default');

  try {
    // Perform async operation that might fail
    await this.fetchData();
    console.log('Data loaded successfully');
  } catch (error) {
    console.error('Failed to load data:', error);
  } finally {
    // Always hide the loader
    await this.loaderService.hide('default');
  }
}
```

## Basic Configuration

### Setting Loader Size

Use the `size` input to control the loader size:

```typescript
<ng-catbee-loader size="small" />
<ng-catbee-loader size="medium" />
<ng-catbee-loader size="large" />
```

Available sizes:

- `small` - Compact loader for tight spaces
- `medium` - Standard size (default)
- `large` - Large loader for prominent display

### Customizing Colors

Change the loader and background colors:

```typescript
<ng-catbee-loader
  [backgroundColor]="'rgba(0, 0, 0, 0.8)'"
  [loaderColor]="'#ffffff'"
/>
```

**Color Examples:**

```typescript
// Dark overlay with white spinner
<ng-catbee-loader
  [backgroundColor]="'rgba(0, 0, 0, 0.9)'"
  [loaderColor]="'#ffffff'"
/>

// Blue overlay with yellow spinner
<ng-catbee-loader
  [backgroundColor]="'rgba(0, 123, 255, 0.8)'"
  [loaderColor]="'#ffff00'"
/>

// Light overlay with dark spinner
<ng-catbee-loader
  [backgroundColor]="'rgba(255, 255, 255, 0.9)'"
  [loaderColor]="'#333333'"
/>

// Transparent overlay with brand color
<ng-catbee-loader
  [backgroundColor]="'rgba(0, 0, 0, 0.5)'"
  [loaderColor]="'#00bcd4'"
/>
```

### Adding a Loading Message

Display a message to users while loading:

```typescript
<ng-catbee-loader
  [message]="'Loading your data...'"
/>
```

**Dynamic messages:**

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader
      name="data-loader"
      [message]="loadingMessage"
    />
  `,
})
export class MessageComponent {
  private loaderService = inject(CatbeeLoaderService);
  loadingMessage = '';

  async loadData() {
    this.loadingMessage = 'Fetching data...';
    await this.loaderService.show('data-loader');

    await this.fetchData();

    this.loadingMessage = 'Processing...';
    await this.processData();

    await this.loaderService.hide('data-loader');
  }

  private async fetchData() {
    // Simulate fetch
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async processData() {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

## Using Delays

### Hide with Delay

Add a delay before hiding the loader to ensure minimum display time:

```typescript
async quickOperation() {
  await this.loaderService.show('default');

  // Fast operation that might finish too quickly
  await this.quickFetch();

  // Ensure loader shows for at least 500ms before hiding
  await this.loaderService.hide('default', 500);
}
```

This prevents the loader from flashing on screen for very short operations.

### Show with Delayed Hide

```typescript
async saveData() {
  await this.loaderService.show('default');

  try {
    await this.save();

    // Show success message by waiting before hiding
    await this.loaderService.hide('default', 1000);
  } catch (error) {
    // Hide immediately on error
    await this.loaderService.hide('default');
  }
}
```

## Checking Loader State

### Check if Visible

```typescript
const isShowing = this.loaderService.isVisible('default');

if (isShowing) {
  console.log('Loader is currently visible');
} else {
  console.log('Loader is hidden');
}
```

### Get Loader State

```typescript
const state = this.loaderService.getState('default');

if (state) {
  console.log('Loader name:', state.name);
  console.log('Is visible:', state.visible);
  console.log('Current options:', state.options);
}
```

### Watch for Changes

React to loader state changes:

```typescript
ngOnInit() {
  this.loaderService.watch('default').subscribe(state => {
    console.log('Loader state changed');
    console.log('Visible:', state.visible);

    if (state.visible) {
      console.log('Loader was shown with options:', state.options);
    } else {
      console.log('Loader was hidden');
    }
  });
}
```

## Complete Example

Here's a complete example combining all basic features:

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-complete',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader
      name="main-loader"
      size="medium"
      [backgroundColor]="'rgba(0, 0, 0, 0.8)'"
      [loaderColor]="'#00bcd4'"
      [message]="loadingMessage"
    />

    <div class="actions">
      <button (click)="loadData()">Load Data</button>
      <button (click)="saveData()">Save Data</button>
      <button (click)="quickAction()">Quick Action</button>
    </div>

    <div class="status">
      <p>Loader visible: {{ isLoaderVisible }}</p>
    </div>
  `,
  styles: [`
    .actions {
      display: flex;
      gap: 1rem;
      margin: 1rem;
    }

    .status {
      margin: 1rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
    }
  `]
})
export class CompleteComponent implements OnInit {
  private loaderService = inject(CatbeeLoaderService);

  loadingMessage = '';
  isLoaderVisible = false;

  ngOnInit() {
    // Watch for loader state changes
    this.loaderService.watch('main-loader').subscribe(state => {
      this.isLoaderVisible = state.visible;
    });
  }

  async loadData() {
    this.loadingMessage = 'Loading data...';
    await this.loaderService.show('main-loader');

    try {
      await this.fetchData();
      console.log('Data loaded successfully');
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      await this.loaderService.hide('main-loader');
    }
  }

  async saveData() {
    this.loadingMessage = 'Saving your changes...';
    await this.loaderService.show('main-loader');

    try {
      await this.save();

      this.loadingMessage = 'Saved successfully!';
      // Keep showing for a moment to display success
      await this.loaderService.hide('main-loader', 1000);
    } catch (error) {
      console.error('Save failed:', error);
      await this.loaderService.hide('main-loader');
    }
  }

  async quickAction() {
    this.loadingMessage = 'Processing...';
    await this.loaderService.show('main-loader');

    await this.quickProcess();

    // Ensure minimum display time of 500ms
    await this.loaderService.hide('main-loader', 500);
  }

  private async fetchData() {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async save() {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }

  private async quickProcess() {
    return new Promise(resolve => setTimeout(resolve, 100));
  }
}
```

## Best Practices

1. **Always Use Try/Finally**: Ensure loaders are hidden even when errors occur

   ```typescript
   try {
     await this.loaderService.show('default');
     await this.operation();
   } finally {
     await this.loaderService.hide('default');
   }
   ```

2. **Use Descriptive Names**: Make debugging easier with meaningful loader names

   ```typescript
   <ng-catbee-loader name="user-data-loader" />
   <ng-catbee-loader name="form-submit-loader" />
   ```

3. **Provide User Feedback**: Use messages to inform users what's happening

   ```typescript
   [message]="'Loading user profile...'"
   ```

4. **Handle Quick Operations**: Use delays to prevent loader flashing

   ```typescript
   await this.loaderService.hide('default', 500);
   ```

5. **Check Loader State**: Avoid showing already-visible loaders
   ```typescript
   if (!this.loaderService.isVisible('default')) {
     await this.loaderService.show('default');
   }
   ```

## Next Steps

- [Animations](./animations.md) - Explore 50+ animation styles
- [Multiple Loaders](./multiple-loaders.md) - Manage multiple concurrent loaders
- [Advanced Features](./advanced-features.md) - Custom templates, fullscreen mode, and more
