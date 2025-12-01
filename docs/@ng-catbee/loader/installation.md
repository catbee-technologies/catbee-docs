---
id: installation
title: Installation
sidebar_position: 2
---

# Installation

Learn how to install and configure the @ng-catbee/loader package in your Angular application.

## Installation

Install the package using npm:

```bash
npm install @ng-catbee/loader
```

Or using yarn:

```bash
yarn add @ng-catbee/loader
```

Or using pnpm:

```bash
pnpm add @ng-catbee/loader
```

## Import Animation Styles

**Important:** You must import the CSS file for each animation style you want to use. Each animation has its own CSS file.

### Option 1: Import in `styles.css` (Recommended)

Add the animation styles you need to your global `styles.css` or `styles.scss` file:

```css
/* Import the animation style you need */
@import 'node_modules/@ng-catbee/loader/css/ball-spin-clockwise.css';

/* Or import multiple animations */
@import 'node_modules/@ng-catbee/loader/css/ball-grid-pulse.css';
@import 'node_modules/@ng-catbee/loader/css/line-scale.css';
@import 'node_modules/@ng-catbee/loader/css/pacman.css';
```

### Option 2: Add to `angular.json` styles array

Alternatively, you can add the CSS files to your `angular.json` styles array:

```json
{
  "styles": [
    "src/styles.css",
    "node_modules/@ng-catbee/loader/css/ball-spin-clockwise.css",
    "node_modules/@ng-catbee/loader/css/line-scale.css"
  ]
}
```

:::tip
You only need to import the CSS files for the animations you actually use in your application. This keeps your bundle size small.
:::

## Global Configuration (Optional)

You can configure default settings for all loaders in your application.

### Standalone Applications

In your `app.config.ts`:

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
      fullscreen: true
    })
  ]
};
```

### Module-Based Applications

In your `app.module.ts`:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CatbeeLoaderModule } from '@ng-catbee/loader';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CatbeeLoaderModule.forRoot({
      animation: 'ball-spin-clockwise',
      size: 'medium',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      loaderColor: '#ffffff',
      zIndex: 999999,
      fullscreen: true
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Configuration Options

| Option            | Type                             | Default                 | Description                             |
| ----------------- | -------------------------------- | ----------------------- | --------------------------------------- |
| `animation`       | `CatbeeLoaderAnimation`          | `'ball-spin-clockwise'` | Default animation style for all loaders |
| `size`            | `'small' \| 'medium' \| 'large'` | `'medium'`              | Default size for all loaders            |
| `backgroundColor` | `string`                         | `'rgba(0,0,0,0.7)'`     | Default overlay background color        |
| `loaderColor`     | `string`                         | `'#ffffff'`             | Default loader/spinner color            |
| `zIndex`          | `number`                         | `999999`                | Default CSS z-index value               |
| `fullscreen`      | `boolean`                        | `true`                  | Default fullscreen overlay mode         |
| `message`         | `string \| null`                 | `null`                  | Default loading message text            |
| `customTemplate`  | `string \| null`                 | `null`                  | Default custom HTML template            |

:::info
Global configuration sets defaults for all loaders. You can override these settings per-loader by passing options to the component inputs or the `show()` method.
:::

## Basic Setup

After installation and configuration, you're ready to use the loader in your components:

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader />

    <button (click)="showLoader()">Show Loader</button>
    <button (click)="hideLoader()">Hide Loader</button>
  `,
})
export class AppComponent {
  private loaderService = inject(CatbeeLoaderService);

  async showLoader() {
    await this.loaderService.show('default');
  }

  async hideLoader() {
    await this.loaderService.hide('default');
  }
}
```

## Angular Compatibility

| Angular Version | Supported          |
| --------------- | ------------------ |
| `v17` and above | ✅ Fully supported |

This library is built and tested with Angular **20.x**, and supports all modern standalone-based Angular projects (v17+).

## Next Steps

- [Basic Usage](./usage/basic-usage.md) - Learn how to show and hide loaders
- [Animations](./usage/animations.md) - Explore the 50+ available animation styles
- [API Reference](./api-reference.md) - Complete API documentation
