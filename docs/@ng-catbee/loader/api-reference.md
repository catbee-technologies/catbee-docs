---
id: api-reference
title: API Reference
sidebar_position: 4
---

# API Reference

Complete API documentation for the @ng-catbee/loader package.

## `CatbeeLoader` Component

The main component for displaying loading indicators in your application.

#### Importing the Component

```typescript
import { CatbeeLoader } from '@ng-catbee/loader';

@Component({
  standalone: true,
  imports: [CatbeeLoader],
  // ...
})
```

### Component Inputs

| Input             | Type                             | Default                 | Description                                                                                    |
| ----------------- | -------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| `name`            | `string`                         | `'default'`             | Unique identifier for the loader. Used to control the loader programmatically via the service. |
| `animation`       | `LoaderAnimation`                | `'ball-spin-clockwise'` | Animation style to use. See [Available Animations](#available-animations) for all options.     |
| `size`            | `'small' \| 'medium' \| 'large'` | `''`                    | Predefined size for the loader. Empty string uses default size from animation.                 |
| `backgroundColor` | `string`                         | `'rgba(0,0,0,0.7)'`     | Background color of the overlay. Supports any valid CSS color value.                           |
| `loaderColor`     | `string`                         | `'#ffffff'`             | Color of the loader/spinner. Supports any valid CSS color value.                               |
| `fullscreen`      | `boolean`                        | `true`                  | Whether to show the loader as a fullscreen overlay or inline within its container.             |
| `zIndex`          | `number`                         | `999999`                | CSS z-index value for the loader overlay. Adjust if you need to control stacking order.        |
| `message`         | `string`                         | `null`                  | Optional loading message to display below the loader.                                          |
| `customTemplate`  | `string`                         | `null`                  | Custom HTML template to replace the default loader. Use for complete customization.            |
| `blurBackground` | `boolean` | `false` | Apply blur effect to background (fullscreen only) |
| `blurPixels` | `number` | `5` | Amount of blur in pixels (requires `blurBackground: true`) |
| `blockScroll` | `boolean` | `true` | Prevent body scrolling when loader is visible (fullscreen only) |
| `width`           | `string`                         | `'100%'`                | Width of the loader container. Accepts any valid CSS width value.                              |
| `height`          | `string`                         | `'100%'`                | Height of the loader container. Accepts any valid CSS height value.                            |

### Component Outputs

| Output          | Type                    | Description                                                    |
| --------------- | ----------------------- | -------------------------------------------------------------- |
| `visibleChange` | `EventEmitter<boolean>` | Emits `true` when the loader is shown and `false` when hidden. |

#### Example

```typescript
<ng-catbee-loader
  name="my-loader"
  animation="ball-grid-pulse"
  size="large"
  [backgroundColor]="'rgba(0, 123, 255, 0.8)'"
  [loaderColor]="'#ffffff'"
  [fullscreen]="true"
  [zIndex]="999999"
  [message]="'Loading your data...'"
  (visibleChange)="onVisibilityChange($event)"
/>
```

## `CatbeeLoaderService`

Service for programmatically controlling loaders.

:::tip Service Aliases

```typescript
import { CatbeeLoaderService } from '@ng-catbee/loader';
```

You can also import the service using the shorter alias:

```typescript
import { LoaderService } from '@ng-catbee/loader';
```

Both `CatbeeLoaderService` and `LoaderService` refer to the same service.
:::

### API Summary

- [**`show(name?: string, options?: LoaderDisplayOptions): Promise<void>`**](#show) - Shows a loader by name with optional runtime configuration.
- [**`hide(name?: string, delay?: number): Promise<void>`**](#hide) - Hides a loader by name with optional delay.
- [**`hideAll(): Promise<void>`**](#hideall) - Hides all currently visible loaders.
- [**`isVisible(name?: string): boolean`**](#isvisible) - Checks if a loader is currently visible.
- [**`getState(name?: string): LoaderState \| undefined`**](#getstate) - Gets the current state of a loader.
- [**`getVisibleLoaders(): string[]`**](#getvisibleloaders) - Gets the names of all currently visible loaders.
- [**`watch(name?: string): Observable<LoaderState>`**](#watch) - Observes state changes for a specific loader.
- [**`loader$: Observable<LoaderState>`**](#loader) - Observable that emits all loader state changes across all loaders.

##### Importing the Service

```typescript
import { inject } from '@angular/core';
import { CatbeeLoaderService } from '@ng-catbee/loader';

export class MyComponent {
  private loaderService = inject(CatbeeLoaderService);
}
```

## Loader Methods

### `show()`

Shows a loader by name with optional runtime configuration.

**Method Signature:**

```typescript
show(name?: string, options?: LoaderDisplayOptions): Promise<void>
```

**Parameters:**

- `name` (string): Name of the loader to show
- `options` (LoaderDisplayOptions, optional): Runtime configuration to override component inputs

**Returns:** Promise that resolves when the loader is shown

**Example:**

```typescript
// Basic usage
await this.loaderService.show('default');

// With runtime options
await this.loaderService.show('my-loader', {
  backgroundColor: 'rgba(255, 0, 0, 0.5)',
  loaderColor: '#ffff00',
  size: 'large',
  animation: 'pacman',
  message: 'Processing...',
  fullscreen: false,
  zIndex: 10000
});
```

### `hide()`

Hides a loader by name with optional delay.

**Method Signature:**

```typescript
hide(name?: string, delay?: number): Promise<void>
```

**Parameters:**

- `name` (string): Name of the loader to hide
- `delay` (number, optional): Delay in milliseconds before hiding the loader

**Returns:** Promise that resolves when the loader is hidden

**Example:**

```typescript
// Hide immediately
await this.loaderService.hide('default');

// Hide after 500ms
await this.loaderService.hide('default', 500);
```

### `hideAll()`

Hides all currently visible loaders.

**Method Signature:**

```typescript
hideAll(): Promise<void>
```

**Returns:** Promise that resolves when all loaders are hidden

**Example:**

```typescript
await this.loaderService.hideAll();
```

### `isVisible()`

Checks if a loader is currently visible.

**Method Signature:**

```typescript
isVisible(name?: string): boolean
```

**Parameters:**

- `name` (string): Name of the loader to check

**Returns:** `true` if the loader is visible, `false` otherwise

**Example:**

```typescript
if (this.loaderService.isVisible('my-loader')) {
  console.log('Loader is showing');
}
```

### `getState()`

Gets the current state of a loader.

**Method Signature:**

```typescript
getState(name?: string): LoaderState | undefined
```

**Parameters:**

- `name` (string): Name of the loader

**Returns:** The loader state object or `undefined` if the loader doesn't exist

**Example:**

```typescript
const state = this.loaderService.getState('my-loader');
console.log('Loader state:', state);
```

### `getVisibleLoaders()`

Gets the names of all currently visible loaders.

**Method Signature:**

```typescript
getVisibleLoaders(): string[]
```

**Returns:** Array of loader names that are currently visible

**Example:**

```typescript
const visibleLoaders = this.loaderService.getVisibleLoaders();
console.log('Visible loaders:', visibleLoaders); // ['loader1', 'loader2']
```

### `watch()`

Observes state changes for a specific loader.

**Method Signature:**

```typescript
watch(name?: string): Observable<LoaderState>
```

**Parameters:**

- `name` (string): Name of the loader to watch

**Returns:** Observable that emits the loader state whenever it changes

**Example:**

```typescript
this.loaderService.watch('my-loader').subscribe(state => {
  console.log('Loader state changed:', state);
  console.log('Is visible:', state.visible);
  console.log('Options:', state.options);
});
```

### `loader$`

Observable that emits all loader state changes across all loaders in the application.

**Property Type:**

```typescript
loader$: Observable<LoaderState>
```

**Returns:** Observable that emits whenever any loader's state changes (shown or hidden)

**Example:**

```typescript
// Monitor all loader activity across the application
this.loaderService.loader$.subscribe(state => {
  console.log('Loader state changed:', state.name);
  console.log('Is visible:', state.visible);
  if (state.options) {
    console.log('Options:', state.options);
  }
});
```

**Use Cases:**

```typescript
// Track all loader activity for analytics
export class LoaderAnalyticsService {
  private loaderService = inject(CatbeeLoaderService);

  constructor() {
    this.loaderService.loader$.subscribe(state => {
      this.logLoaderEvent({
        loaderName: state.name,
        action: state.visible ? 'shown' : 'hidden',
        timestamp: new Date()
      });
    });
  }
}

// Display a global loading indicator based on any loader activity
export class GlobalLoadingIndicator {
  private loaderService = inject(CatbeeLoaderService);
  protected hasActiveLoaders = signal(false);

  constructor() {
    this.loaderService.loader$.subscribe(state => {
      // Check if any loaders are still visible
      const visibleLoaders = this.loaderService.getVisibleLoaders();
      this.hasActiveLoaders.set(visibleLoaders.length > 0);
    });
  }
}
```

## Interfaces

### `LoaderDisplayOptions`

Runtime options for configuring a loader when calling `show()`.

```typescript
interface LoaderDisplayOptions {
  backgroundColor?: string;
  loaderColor?: string;
  size?: LoaderSize;
  animation?: LoaderAnimation;
  fullscreen?: boolean;
  zIndex?: number;
  customTemplate?: string;
  message?: string;
  blurBackground?: boolean;
  blurPixels?: number;
  blockScroll?: boolean;
}
```

### `LoaderState`

Represents the current state of a loader.

```typescript
interface LoaderState {
  name: string;
  visible: boolean;
  options?: LoaderDisplayOptions;
}
```

### `CatbeeLoaderGlobalConfig`

Configuration interface for global loader defaults.

```typescript
interface CatbeeLoaderGlobalConfig {
  animation?: CatbeeLoaderAnimation;
  size?: CatbeeLoaderSize;
  backgroundColor?: string;
  loaderColor?: string;
  zIndex?: number;
  fullscreen?: boolean;
  message?: string | null;
  customTemplate?: string | null;
  blurBackground?: boolean;
  blurPixels?: number;
  blockScroll?: boolean;
}
```

## Type Aliases

### `LoaderAnimation`

All available animation styles. Must have corresponding CSS file imported.

```typescript
type LoaderAnimation =
  // Ball Animations
  | 'ball-8bits' | 'ball-atom' | 'ball-beat' | 'ball-circus' | 'ball-climbing-dot'
  | 'ball-clip-rotate' | 'ball-clip-rotate-multiple' | 'ball-clip-rotate-pulse'
  | 'ball-elastic-dots' | 'ball-fall' | 'ball-fussion'
  | 'ball-grid-beat' | 'ball-grid-pulse' | 'ball-newton-cradle'
  | 'ball-pulse' | 'ball-pulse-rise' | 'ball-pulse-sync'
  | 'ball-rotate' | 'ball-running-dots' | 'ball-scale'
  | 'ball-scale-multiple' | 'ball-scale-pulse'
  | 'ball-scale-ripple' | 'ball-scale-ripple-multiple'
  | 'ball-spin' | 'ball-spin-clockwise' | 'ball-spin-clockwise-fade'
  | 'ball-spin-clockwise-fade-rotating' | 'ball-spin-fade' | 'ball-spin-fade-rotating'
  | 'ball-spin-rotate' | 'ball-square-clockwise-spin' | 'ball-square-spin'
  | 'ball-triangle-path' | 'ball-zig-zag' | 'ball-zig-zag-deflect'
  // Line Animations
  | 'line-scale' | 'line-scale-party'
  | 'line-scale-pulse-out' | 'line-scale-pulse-out-rapid'
  | 'line-spin-clockwise-fade' | 'line-spin-clockwise-fade-rotating'
  | 'line-spin-fade' | 'line-spin-fade-rotating'
  // Other Animations
  | 'cog' | 'cube-transition' | 'fire' | 'pacman'
  | 'square-jelly-box' | 'square-loader' | 'square-spin'
  | 'timer' | 'triangle-skew-spin';
```

### `LoaderSize`

Predefined loader sizes.

```typescript
type LoaderSize = 'small' | 'medium' | 'large';
```

## Available Animations

The library includes 50+ beautiful loading animations. Each animation requires its corresponding CSS file to be imported.

:::tip Animation Preview
Preview all animations at: [https://labs.danielcardoso.net/load-awesome/animations.html](https://labs.danielcardoso.net/load-awesome/animations.html)
:::

### Ball Animations

- `ball-8bits`, `ball-atom`, `ball-beat`, `ball-circus`, `ball-climbing-dot`
- `ball-clip-rotate`, `ball-clip-rotate-multiple`, `ball-clip-rotate-pulse`
- `ball-elastic-dots`, `ball-fall`, `ball-fussion`
- `ball-grid-beat`, `ball-grid-pulse`, `ball-newton-cradle`
- `ball-pulse`, `ball-pulse-rise`, `ball-pulse-sync`
- `ball-rotate`, `ball-running-dots`, `ball-scale`
- `ball-scale-multiple`, `ball-scale-pulse`
- `ball-scale-ripple`, `ball-scale-ripple-multiple`
- `ball-spin`, `ball-spin-clockwise`, `ball-spin-clockwise-fade`
- `ball-spin-clockwise-fade-rotating`, `ball-spin-fade`, `ball-spin-fade-rotating`
- `ball-spin-rotate`, `ball-square-clockwise-spin`, `ball-square-spin`
- `ball-triangle-path`, `ball-zig-zag`, `ball-zig-zag-deflect`

### Line Animations

- `line-scale`, `line-scale-party`
- `line-scale-pulse-out`, `line-scale-pulse-out-rapid`
- `line-spin-clockwise-fade`, `line-spin-clockwise-fade-rotating`
- `line-spin-fade`, `line-spin-fade-rotating`

### Other Animations

- `cog`, `cube-transition`, `fire`, `pacman`
- `square-jelly-box`, `square-loader`, `square-spin`
- `timer`, `triangle-skew-spin`

## Providers

### `provideCatbeeLoader()`

Function to provide global configuration for standalone applications.

```typescript
function provideCatbeeLoader(config?: CatbeeLoaderGlobalConfig): Provider[]
```

**Parameters:**

- `config` (CatbeeLoaderGlobalConfig, optional): Global configuration options

**Returns:** Array of providers to include in your application config

**Example:**

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCatbeeLoader } from '@ng-catbee/loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCatbeeLoader({
      animation: 'ball-spin-clockwise',
      size: 'medium',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      loaderColor: '#ffffff',
      zIndex: 999999,
      blurBackground: true,
      blurPixels: 8,
      blockScroll: true
    })
  ]
};
```

### `CatbeeLoaderModule`

Module for configuring the loader in module-based applications.

#### `forRoot()`

```typescript
static forRoot(config?: CatbeeLoaderGlobalConfig): ModuleWithProviders<CatbeeLoaderModule>
```

**Parameters:**

- `config` (CatbeeLoaderGlobalConfig, optional): Global configuration options

**Returns:** Module with providers

**Example:**

```typescript
import { NgModule } from '@angular/core';
import { CatbeeLoaderModule } from '@ng-catbee/loader';

@NgModule({
  imports: [
    CatbeeLoaderModule.forRoot({
      animation: 'ball-spin-clockwise',
      size: 'medium',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      loaderColor: '#ffffff',
      zIndex: 999999
    })
  ]
})
export class AppModule { }
```
