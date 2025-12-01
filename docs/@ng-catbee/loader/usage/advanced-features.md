---
id: advanced-features
title: Advanced Features
sidebar_position: 4
---

# Advanced Features

Explore advanced features of the @ng-catbee/loader package including custom templates, fullscreen modes, delays, and state management.

## Custom Templates

Create completely custom loaders with your own HTML.

### Basic Custom Template

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-custom',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader
      name="custom"
      [customTemplate]="customHtml"
    />
  `,
})
export class CustomTemplateComponent {
  private loaderService = inject(CatbeeLoaderService);

  customHtml = `
    <div style="text-align: center; color: white;">
      <h2>Loading...</h2>
      <div style="font-size: 3rem;">⏳</div>
      <p>Please wait while we prepare your content</p>
    </div>
  `;

  async load() {
    await this.loaderService.show('custom');
  }
}
```

### Styled Custom Template

```typescript
customHtml = `
  <div style="
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: white;
  ">
    <div style="
      width: 60px;
      height: 60px;
      border: 5px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    "></div>

    <h2 style="margin: 0; font-size: 1.5rem;">
      Processing Your Request
    </h2>

    <p style="margin: 0; opacity: 0.8;">
      This may take a few moments...
    </p>

    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  </div>
`;
```

### Progress Bar Template

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader
      name="progress"
      [customTemplate]="progressTemplate"
    />
  `,
})
export class ProgressComponent {
  private loaderService = inject(CatbeeLoaderService);

  progressTemplate = `
    <div style="
      width: 80%;
      max-width: 500px;
      color: white;
      text-align: center;
    ">
      <h3 style="margin-bottom: 1rem;">Uploading Files...</h3>

      <div style="
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        overflow: hidden;
        height: 30px;
        margin-bottom: 0.5rem;
      ">
        <div style="
          background: linear-gradient(90deg, #00bcd4, #2196F3);
          height: 100%;
          width: 65%;
          transition: width 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        ">
          65%
        </div>
      </div>

      <p style="opacity: 0.8; margin: 0;">
        Uploading file 3 of 5...
      </p>
    </div>
  `;
}
```

### Animated Custom Template

```typescript
customHtml = `
  <div style="text-align: center; color: white;">
    <div style="
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0 auto 1rem;
    ">
      <div class="pulse-ring"></div>
      <div class="pulse-ring" style="animation-delay: 0.5s;"></div>
      <div class="pulse-ring" style="animation-delay: 1s;"></div>

      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
      ">
        📡
      </div>
    </div>

    <h2>Connecting to Server...</h2>
    <p style="opacity: 0.8;">Establishing secure connection</p>

    <style>
      .pulse-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        animation: pulse 2s ease-out infinite;
      }

      @keyframes pulse {
        0% {
          transform: scale(0.5);
          opacity: 1;
        }
        100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
    </style>
  </div>
`;
```

## Fullscreen Mode

### Fullscreen vs Inline

Control whether the loader covers the entire screen or stays within its container:

```typescript
<!-- Fullscreen loader (default) -->
<ng-catbee-loader
  name="fullscreen"
  [fullscreen]="true"
  [zIndex]="999999"
/>

<!-- Inline loader within container -->
<ng-catbee-loader
  name="inline"
  [fullscreen]="false"
  [width]="'100%'"
  [height]="'300px'"
/>
```

### Inline Loader Example

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-inline',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <div class="container">
      <div class="section">
        <h2>Section 1</h2>

        <div style="position: relative; height: 200px; border: 1px solid #ddd;">
          <ng-catbee-loader
            name="section1"
            [fullscreen]="false"
            [width]="'100%'"
            [height]="'100%'"
            animation="ball-spin-clockwise"
          />

          <p>Content here...</p>
        </div>

        <button (click)="loadSection1()">Load Section 1</button>
      </div>

      <div class="section">
        <h2>Section 2</h2>

        <div style="position: relative; height: 200px; border: 1px solid #ddd;">
          <ng-catbee-loader
            name="section2"
            [fullscreen]="false"
            [width]="'100%'"
            [height]="'100%'"
            animation="line-scale"
          />

          <p>Content here...</p>
        </div>

        <button (click)="loadSection2()">Load Section 2</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      padding: 1rem;
    }

    .section {
      padding: 1rem;
    }
  `]
})
export class InlineComponent {
  private loaderService = inject(CatbeeLoaderService);

  async loadSection1() {
    await this.loaderService.show('section1');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.loaderService.hide('section1');
  }

  async loadSection2() {
    await this.loaderService.show('section2');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.loaderService.hide('section2');
  }
}
```

## Show and Hide Delays

### Hide Delay

Ensure loaders display for a minimum duration:

```typescript
async quickOperation() {
  await this.loaderService.show('default');

  // Very fast operation
  await this.instantFetch();

  // Ensure loader shows for at least 500ms
  await this.loaderService.hide('default', 500);
}
```

This prevents the loader from flashing on screen too quickly, which can be jarring for users.

### Progressive Loading with Delays

```typescript
async multiStepLoad() {
  // Step 1
  await this.loaderService.show('default', {
    message: 'Initializing...'
  });
  await this.initialize();
  await this.loaderService.hide('default', 300);

  // Brief pause
  await new Promise(resolve => setTimeout(resolve, 100));

  // Step 2
  await this.loaderService.show('default', {
    message: 'Loading data...'
  });
  await this.loadData();
  await this.loaderService.hide('default', 300);

  // Brief pause
  await new Promise(resolve => setTimeout(resolve, 100));

  // Step 3
  await this.loaderService.show('default', {
    message: 'Finalizing...'
  });
  await this.finalize();
  await this.loaderService.hide('default', 500);
}
```

## Watching Loader State

### Subscribe to State Changes

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CatbeeLoaderService } from '@ng-catbee/loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-watcher',
  template: `
    <ng-catbee-loader name="watched" />

    <div class="status">
      <h3>Loader Status</h3>
      <p>Name: {{ loaderName }}</p>
      <p>Visible: {{ isVisible }}</p>
      <p>Message: {{ currentMessage || 'None' }}</p>
    </div>
  `,
})
export class WatcherComponent implements OnInit, OnDestroy {
  private loaderService = inject(CatbeeLoaderService);
  private subscription?: Subscription;

  loaderName = '';
  isVisible = false;
  currentMessage = '';

  ngOnInit() {
    this.subscription = this.loaderService.watch('watched').subscribe(state => {
      this.loaderName = state.name;
      this.isVisible = state.visible;
      this.currentMessage = state.options?.message || '';

      console.log('Loader state changed:', state);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
```

### React to Visibility Changes

```typescript
ngOnInit() {
  this.loaderService.watch('myLoader').subscribe(state => {
    if (state.visible) {
      console.log('Loader shown with options:', state.options);
      this.onLoaderShown();
    } else {
      console.log('Loader hidden');
      this.onLoaderHidden();
    }
  });
}

onLoaderShown() {
  // Disable form inputs
  // Start timeout timer
  // Update UI state
}

onLoaderHidden() {
  // Re-enable form inputs
  // Clear timeout timer
  // Update UI state
}
```

## Runtime Configuration Override

Override component settings when showing loaders:

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-override',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader
      name="dynamic"
      animation="ball-spin-clockwise"
      size="medium"
      [backgroundColor]="'rgba(0, 0, 0, 0.7)'"
    />
  `,
})
export class OverrideComponent {
  private loaderService = inject(CatbeeLoaderService);

  async normalLoad() {
    // Use component defaults
    await this.loaderService.show('dynamic');
    await this.operation();
    await this.loaderService.hide('dynamic');
  }

  async urgentLoad() {
    // Override with urgent styling
    await this.loaderService.show('dynamic', {
      backgroundColor: 'rgba(255, 0, 0, 0.8)',
      loaderColor: '#ffffff',
      message: 'Urgent: Processing critical data!',
      animation: 'cog',
      size: 'large'
    });

    await this.urgentOperation();
    await this.loaderService.hide('dynamic');
  }

  async successLoad() {
    // Override with success styling
    await this.loaderService.show('dynamic', {
      backgroundColor: 'rgba(76, 175, 80, 0.8)',
      loaderColor: '#ffffff',
      message: 'Success! Completing...',
      animation: 'ball-pulse',
      size: 'medium'
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.loaderService.hide('dynamic');
  }

  private async operation() {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async urgentOperation() {
    return new Promise(resolve => setTimeout(resolve, 3000));
  }
}
```

## Component Output Events

Listen to visibility changes:

```typescript
import { Component } from '@angular/core';
import { CatbeeLoader } from '@ng-catbee/loader';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader
      name="events"
      (visibleChange)="onVisibilityChange($event)"
    />

    <div class="log">
      <h3>Event Log</h3>
      <ul>
        <li *ngFor="let event of events">{{ event }}</li>
      </ul>
    </div>
  `,
})
export class EventsComponent {
  events: string[] = [];

  onVisibilityChange(visible: boolean) {
    const timestamp = new Date().toLocaleTimeString();
    const message = visible
      ? `${timestamp}: Loader shown`
      : `${timestamp}: Loader hidden`;

    this.events.unshift(message);

    // Keep only last 10 events
    if (this.events.length > 10) {
      this.events.pop();
    }
  }
}
```

## Width and Height Customization

Customize loader dimensions for inline display:

```typescript
<ng-catbee-loader
  name="custom-size"
  [fullscreen]="false"
  [width]="'500px'"
  [height]="'300px'"
  animation="ball-grid-pulse"
/>

<!-- Responsive sizing -->
<ng-catbee-loader
  name="responsive"
  [fullscreen]="false"
  [width]="'100%'"
  [height]="'50vh'"
  animation="line-scale"
/>

<!-- Fixed size -->
<ng-catbee-loader
  name="fixed"
  [fullscreen]="false"
  [width]="'400px'"
  [height]="'400px'"
  animation="pacman"
/>
```

## Complete Advanced Example

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-advanced',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <!-- Default loader with custom template -->
    <ng-catbee-loader
      name="custom"
      [customTemplate]="customTemplate"
      (visibleChange)="onLoaderChange($event)"
    />

    <!-- Inline loader for specific section -->
    <div class="content-section" style="position: relative; height: 300px;">
      <ng-catbee-loader
        name="section"
        [fullscreen]="false"
        [width]="'100%'"
        [height]="'100%'"
        animation="ball-grid-pulse"
        [backgroundColor]="'rgba(255, 255, 255, 0.95)'"
        [loaderColor]="'#2196F3'"
      />

      <h2>Content Section</h2>
      <p>This section has its own inline loader</p>
    </div>

    <div class="controls">
      <button (click)="showCustomLoader()">Show Custom</button>
      <button (click)="showSectionLoader()">Load Section</button>
      <button (click)="showWithOverride()">Show with Override</button>
      <button (click)="quickLoad()">Quick Load (with delay)</button>
      <button (click)="hideAll()">Hide All</button>
    </div>

    <div class="status">
      <h3>Loader Status</h3>
      <p>Custom loader visible: {{ customLoaderVisible }}</p>
      <p>Active loaders: {{ activeLoaders.join(', ') || 'None' }}</p>
      <p>Last event: {{ lastEvent }}</p>
    </div>
  `,
  styles: [`
    .content-section {
      margin: 2rem 0;
      padding: 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
    }

    .controls {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin: 1rem 0;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      background: #2196F3;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover {
      background: #1976D2;
    }

    .status {
      margin-top: 2rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
    }
  `]
})
export class AdvancedComponent implements OnInit, OnDestroy {
  private loaderService = inject(CatbeeLoaderService);
  private subscription?: Subscription;

  customLoaderVisible = false;
  activeLoaders: string[] = [];
  lastEvent = 'None';

  customTemplate = `
    <div style="
      text-align: center;
      color: white;
      animation: fadeIn 0.3s ease-in;
    ">
      <div style="
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>

      <h2 style="
        margin: 0 0 0.5rem;
        font-size: 1.8rem;
        font-weight: 600;
      ">
        Custom Loader
      </h2>

      <p style="
        margin: 0;
        opacity: 0.9;
        font-size: 1.1rem;
      ">
        With custom HTML template
      </p>

      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </div>
  `;

  ngOnInit() {
    // Watch custom loader state
    this.subscription = this.loaderService.watch('custom').subscribe(state => {
      this.customLoaderVisible = state.visible;
    });

    // Update active loaders periodically
    setInterval(() => {
      this.activeLoaders = this.loaderService.getVisibleLoaders();
    }, 500);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async showCustomLoader() {
    await this.loaderService.show('custom');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.loaderService.hide('custom');
  }

  async showSectionLoader() {
    await this.loaderService.show('section');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.loaderService.hide('section');
  }

  async showWithOverride() {
    await this.loaderService.show('custom', {
      backgroundColor: 'rgba(76, 175, 80, 0.9)',
      message: 'Overridden configuration!',
      customTemplate: `
        <div style="text-align: center; color: white;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
          <h2>Success Override</h2>
          <p>This uses runtime configuration</p>
        </div>
      `
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.loaderService.hide('custom');
  }

  async quickLoad() {
    await this.loaderService.show('custom');

    // Simulate very quick operation
    await new Promise(resolve => setTimeout(resolve, 100));

    // Ensure minimum display time of 800ms
    await this.loaderService.hide('custom', 800);
  }

  async hideAll() {
    await this.loaderService.hideAll();
  }

  onLoaderChange(visible: boolean) {
    const timestamp = new Date().toLocaleTimeString();
    this.lastEvent = `${timestamp}: Loader ${visible ? 'shown' : 'hidden'}`;
  }
}
```

## Best Practices

1. **Custom Templates**: Keep them simple and performant
2. **Fullscreen Mode**: Use for critical operations that require user attention
3. **Inline Mode**: Use for section-specific loading states
4. **Delays**: Prevent loader flashing with minimum display times
5. **State Watching**: Subscribe only when needed, unsubscribe in `ngOnDestroy`
6. **Runtime Overrides**: Use for contextual variations of the same loader
7. **Events**: React to visibility changes for complex state management

## Next Steps

- [API Reference](../api-reference.md) - Complete API documentation
- [Basic Usage](./basic-usage.md) - Review fundamentals
- [Multiple Loaders](./multiple-loaders.md) - Managing multiple loaders
