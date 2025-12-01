---
id: animations
title: Animations
sidebar_position: 2 
---

# Animations

The @ng-catbee/loader package includes 50+ beautiful, pre-built loading animations. Each animation has its own unique style and can be customized with colors and sizes.

## Animation Preview

:::tip Live Preview
See all 50+ animations in action at: [https://labs.danielcardoso.net/load-awesome/animations.html](https://labs.danielcardoso.net/load-awesome/animations.html)
:::

## Using Animations

### Import Animation CSS

**Important:** You must import the CSS file for each animation you want to use.

In your `styles.css`:

```css
/* Import the animations you need */
@import 'node_modules/@ng-catbee/loader/css/ball-spin-clockwise.css';
@import 'node_modules/@ng-catbee/loader/css/ball-grid-pulse.css';
@import 'node_modules/@ng-catbee/loader/css/line-scale.css';
@import 'node_modules/@ng-catbee/loader/css/pacman.css';
```

Or in `angular.json`:

```json
{
  "styles": [
    "src/styles.css",
    "node_modules/@ng-catbee/loader/css/ball-spin-clockwise.css",
    "node_modules/@ng-catbee/loader/css/pacman.css"
  ]
}
```

### Set Animation

Use the `animation` input to specify which animation to use:

```typescript
<ng-catbee-loader animation="ball-spin-clockwise" />
```

### Change Animation Dynamically

```typescript
import { Component } from '@angular/core';
import { CatbeeLoader } from '@ng-catbee/loader';

@Component({
  selector: 'app-animation-demo',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader [animation]="currentAnimation" />

    <div class="controls">
      <button (click)="currentAnimation = 'ball-spin-clockwise'">
        Ball Spin
      </button>
      <button (click)="currentAnimation = 'ball-grid-pulse'">
        Grid Pulse
      </button>
      <button (click)="currentAnimation = 'pacman'">
        Pacman
      </button>
      <button (click)="currentAnimation = 'line-scale'">
        Line Scale
      </button>
    </div>
  `,
})
export class AnimationDemoComponent {
  currentAnimation = 'ball-spin-clockwise';
}
```

## Available Animations

### Ball Animations

Ball-based animations create smooth, circular loading effects.

#### Spin Variations

```typescript
// Classic spinning balls
<ng-catbee-loader animation="ball-spin" />
<ng-catbee-loader animation="ball-spin-clockwise" />
<ng-catbee-loader animation="ball-spin-fade" />
<ng-catbee-loader animation="ball-spin-fade-rotating" />
<ng-catbee-loader animation="ball-spin-rotate" />
```

**With Clockwise Fade:**

```typescript
<ng-catbee-loader animation="ball-spin-clockwise-fade" />
<ng-catbee-loader animation="ball-spin-clockwise-fade-rotating" />
```

#### Scale Variations

```typescript
// Scaling ball animations
<ng-catbee-loader animation="ball-scale" />
<ng-catbee-loader animation="ball-scale-multiple" />
<ng-catbee-loader animation="ball-scale-pulse" />
<ng-catbee-loader animation="ball-scale-ripple" />
<ng-catbee-loader animation="ball-scale-ripple-multiple" />
```

#### Pulse Variations

```typescript
// Pulsing animations
<ng-catbee-loader animation="ball-pulse" />
<ng-catbee-loader animation="ball-pulse-rise" />
<ng-catbee-loader animation="ball-pulse-sync" />
```

#### Grid Variations

```typescript
// Grid-based ball animations
<ng-catbee-loader animation="ball-grid-beat" />
<ng-catbee-loader animation="ball-grid-pulse" />
```

#### Clip/Rotate Variations

```typescript
// Clipping and rotating effects
<ng-catbee-loader animation="ball-clip-rotate" />
<ng-catbee-loader animation="ball-clip-rotate-multiple" />
<ng-catbee-loader animation="ball-clip-rotate-pulse" />
<ng-catbee-loader animation="ball-rotate" />
```

#### Movement Variations

```typescript
// Balls in motion
<ng-catbee-loader animation="ball-beat" />
<ng-catbee-loader animation="ball-climbing-dot" />
<ng-catbee-loader animation="ball-elastic-dots" />
<ng-catbee-loader animation="ball-fall" />
<ng-catbee-loader animation="ball-running-dots" />
<ng-catbee-loader animation="ball-zig-zag" />
<ng-catbee-loader animation="ball-zig-zag-deflect" />
```

#### Special Effects

```typescript
// Unique ball animations
<ng-catbee-loader animation="ball-8bits" />
<ng-catbee-loader animation="ball-atom" />
<ng-catbee-loader animation="ball-circus" />
<ng-catbee-loader animation="ball-fussion" />
<ng-catbee-loader animation="ball-newton-cradle" />
<ng-catbee-loader animation="ball-triangle-path" />
```

#### Square Variations

```typescript
// Square-ball hybrids
<ng-catbee-loader animation="ball-square-clockwise-spin" />
<ng-catbee-loader animation="ball-square-spin" />
```

### Line Animations

Line-based animations create elegant vertical bar effects.

```typescript
// Basic line animations
<ng-catbee-loader animation="line-scale" />
<ng-catbee-loader animation="line-scale-party" />

// Pulse out variations
<ng-catbee-loader animation="line-scale-pulse-out" />
<ng-catbee-loader animation="line-scale-pulse-out-rapid" />

// Spinning line variations
<ng-catbee-loader animation="line-spin-fade" />
<ng-catbee-loader animation="line-spin-fade-rotating" />
<ng-catbee-loader animation="line-spin-clockwise-fade" />
<ng-catbee-loader animation="line-spin-clockwise-fade-rotating" />
```

### Other Animations

Unique and creative loading animations.

```typescript
// Mechanical
<ng-catbee-loader animation="cog" />
<ng-catbee-loader animation="timer" />

// Geometric
<ng-catbee-loader animation="cube-transition" />
<ng-catbee-loader animation="triangle-skew-spin" />

// Squares
<ng-catbee-loader animation="square-jelly-box" />
<ng-catbee-loader animation="square-loader" />
<ng-catbee-loader animation="square-spin" />

// Fun
<ng-catbee-loader animation="pacman" />
<ng-catbee-loader animation="fire" />
```

## Customizing Animation Colors

### Single Color

Most animations use the `loaderColor` property:

```typescript
<ng-catbee-loader
  animation="ball-spin-clockwise"
  [loaderColor]="'#00bcd4'"
/>
```

**Color Examples:**

```typescript
// Brand colors
<ng-catbee-loader animation="ball-grid-pulse" [loaderColor]="'#ff6b6b'" />
<ng-catbee-loader animation="line-scale" [loaderColor]="'#4ecdc4'" />
<ng-catbee-loader animation="pacman" [loaderColor]="'#ffe66d'" />

// Material Design colors
<ng-catbee-loader animation="ball-spin" [loaderColor]="'#2196F3'" />
<ng-catbee-loader animation="ball-pulse" [loaderColor]="'#4CAF50'" />
<ng-catbee-loader animation="line-spin-fade" [loaderColor]="'#FF9800'" />

// Grayscale
<ng-catbee-loader animation="cog" [loaderColor]="'#ffffff'" />
<ng-catbee-loader animation="timer" [loaderColor]="'#cccccc'" />
```

### Runtime Color Changes

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-color-demo',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader name="color-loader" />
  `,
})
export class ColorDemoComponent {
  private loaderService = inject(CatbeeLoaderService);

  async showRedLoader() {
    await this.loaderService.show('color-loader', {
      animation: 'ball-spin-clockwise',
      loaderColor: '#ff0000'
    });
  }

  async showBlueLoader() {
    await this.loaderService.show('color-loader', {
      animation: 'ball-grid-pulse',
      loaderColor: '#0000ff'
    });
  }

  async showGreenLoader() {
    await this.loaderService.show('color-loader', {
      animation: 'line-scale',
      loaderColor: '#00ff00'
    });
  }
}
```

## Combining with Sizes

Animations work with all size options:

```typescript
// Small animations
<ng-catbee-loader animation="ball-spin-clockwise" size="small" />
<ng-catbee-loader animation="line-scale" size="small" />

// Medium animations (default)
<ng-catbee-loader animation="ball-grid-pulse" size="medium" />
<ng-catbee-loader animation="pacman" size="medium" />

// Large animations
<ng-catbee-loader animation="ball-spin-fade" size="large" />
<ng-catbee-loader animation="cog" size="large" />
```

## Best Practices

### Choosing Animations

1. **Brand Consistency**: Match your brand style
   - Tech/Modern: `ball-grid-pulse`, `cube-transition`, `line-scale`
   - Playful: `pacman`, `ball-circus`, `ball-zig-zag`
   - Professional: `ball-spin-clockwise`, `cog`, `timer`
   - Minimal: `line-scale`, `ball-pulse`, `ball-beat`

2. **Performance**: Simpler animations perform better
   - Light: `ball-pulse`, `line-scale`, `ball-beat`
   - Medium: `ball-spin-clockwise`, `ball-grid-pulse`
   - Heavy: `ball-clip-rotate-multiple`, `fire`

3. **Context**: Match the loading context
   - Quick actions: `ball-pulse`, `ball-beat`
   - Data loading: `ball-grid-pulse`, `line-scale`
   - File uploads: `ball-climbing-dot`, `line-scale-pulse-out`
   - Processing: `cog`, `timer`, `ball-spin-rotate`

### Import Only What You Need

Only import CSS for animations you actually use:

```css
/* ❌ Don't import everything */
@import 'node_modules/@ng-catbee/loader/css/*.css';

/* ✅ Import only what you need */
@import 'node_modules/@ng-catbee/loader/css/ball-spin-clockwise.css';
@import 'node_modules/@ng-catbee/loader/css/line-scale.css';
@import 'node_modules/@ng-catbee/loader/css/pacman.css';
```

This keeps your bundle size small.

### Global Default

Set a default animation in your global config:

```typescript
import { provideCatbeeLoader } from '@ng-catbee/loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCatbeeLoader({
      animation: 'ball-spin-clockwise', // Default for all loaders
      loaderColor: '#00bcd4'
    })
  ]
};
```

## Animation Showcase

Here's a complete example showcasing different animations:

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <ng-catbee-loader name="spinner" />
    <ng-catbee-loader name="grid" />
    <ng-catbee-loader name="lines" />
    <ng-catbee-loader name="fun" />

    <div class="demo-grid">
      <button (click)="showSpinner()">
        Spinner Animation
      </button>
      <button (click)="showGrid()">
        Grid Animation
      </button>
      <button (click)="showLines()">
        Lines Animation
      </button>
      <button (click)="showFun()">
        Fun Animation
      </button>
    </div>
  `,
  styles: [`
    .demo-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 1rem;
    }

    button {
      padding: 1rem;
      font-size: 1rem;
      cursor: pointer;
      border: 2px solid #00bcd4;
      background: white;
      border-radius: 4px;
      transition: all 0.3s;
    }

    button:hover {
      background: #00bcd4;
      color: white;
    }
  `]
})
export class ShowcaseComponent {
  private loaderService = inject(CatbeeLoaderService);

  async showSpinner() {
    await this.loaderService.show('spinner', {
      animation: 'ball-spin-clockwise',
      loaderColor: '#2196F3',
      message: 'Classic spinner...'
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.loaderService.hide('spinner');
  }

  async showGrid() {
    await this.loaderService.show('grid', {
      animation: 'ball-grid-pulse',
      loaderColor: '#4CAF50',
      message: 'Grid animation...'
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.loaderService.hide('grid');
  }

  async showLines() {
    await this.loaderService.show('lines', {
      animation: 'line-scale',
      loaderColor: '#FF9800',
      message: 'Line animation...'
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.loaderService.hide('lines');
  }

  async showFun() {
    await this.loaderService.show('fun', {
      animation: 'pacman',
      loaderColor: '#FFD700',
      message: 'Fun animation...'
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.loaderService.hide('fun');
  }
}
```

## Next Steps

- [Multiple Loaders](./multiple-loaders.md) - Use different animations simultaneously
- [Advanced Features](./advanced-features.md) - Custom templates and more
- [API Reference](../api-reference.md) - Complete animation type reference
