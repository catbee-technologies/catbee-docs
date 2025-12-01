---
id: usage
title: Usage
sidebar_position: 3
---

# Usage Overview

Learn how to use the @ng-catbee/loader package effectively in your Angular applications.

## Getting Started

The @ng-catbee/loader package provides a modern, customizable Angular library for displaying beautiful loading indicators and spinners. With 50+ animation styles and advanced features like fullscreen mode, custom templates, and multiple concurrent loaders, it's perfect for any loading scenario.

## Usage Guides

Explore the following guides to learn about different aspects of the loader:

### [Basic Usage](./basic-usage.md)

Learn the fundamentals:

- How to show and hide loaders
- Basic loader configurations
- Working with loader sizes and colors
- Adding loading messages
- Using programmatic control with delays

### [Animations](./animations.md)

Explore animation options:

- Overview of 50+ available animation styles
- How to use different animations
- Customizing animation colors
- Best practices for choosing animations

### [Multiple Loaders](./multiple-loaders.md)

Manage multiple loaders:

- Creating named loaders
- Running multiple loaders simultaneously
- Different loaders for different sections
- Managing loader lifecycle

### [Advanced Features](./advanced-features.md)

Advanced capabilities:

- Creating custom templates
- Fullscreen vs inline mode
- Using show and hide delays
- Watching loader state changes
- Runtime configuration overrides

## Quick Example

Here's a complete example showing common usage patterns:

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeLoader, CatbeeLoaderService } from '@ng-catbee/loader';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CatbeeLoader],
  template: `
    <!-- Default fullscreen loader -->
    <ng-catbee-loader />

    <!-- Customized loader -->
    <ng-catbee-loader
      name="custom"
      animation="ball-grid-pulse"
      size="large"
      [backgroundColor]="'rgba(0, 123, 255, 0.8)'"
      [loaderColor]="'#ffffff'"
      [message]="'Loading data...'"
    />

    <button (click)="loadData()">Load Data</button>
  `,
})
export class ExampleComponent {
  private loaderService = inject(CatbeeLoaderService);

  async loadData() {
    // Show loader
    await this.loaderService.show('custom');

    try {
      // Perform async operation
      await this.fetchData();
    } finally {
      // Always hide loader
      await this.loaderService.hide('custom');
    }
  }

  private async fetchData() {
    // Simulate API call
    return new Promise(resolve => setTimeout(resolve, 2000));
  }
}
```

## Common Patterns

### HTTP Interceptor

Automatically show loaders during HTTP requests:

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CatbeeLoaderService } from '@ng-catbee/loader';
import { finalize } from 'rxjs/operators';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(CatbeeLoaderService);

  loaderService.show('http-loader');

  return next(req).pipe(
    finalize(() => loaderService.hide('http-loader'))
  );
};
```

### Form Submission

Show loaders during form submissions:

```typescript
async onSubmit() {
  await this.loaderService.show('form-submit', {
    message: 'Saving your changes...'
  });

  try {
    await this.saveForm();
  } catch (error) {
    console.error('Save failed:', error);
  } finally {
    await this.loaderService.hide('form-submit');
  }
}
```

### Route Guards

Display loaders while fetching data in route guards:

```typescript
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CatbeeLoaderService } from '@ng-catbee/loader';

export const dataGuard: CanActivateFn = async (route, state) => {
  const loaderService = inject(CatbeeLoaderService);

  await loaderService.show('route-guard');

  try {
    const hasAccess = await checkAccess();
    return hasAccess;
  } finally {
    await loaderService.hide('route-guard');
  }
};
```

## API Reference

For complete API documentation, including all component inputs, service methods, and configuration options, see the [API Reference](../api-reference.md).

## Animation Preview

Preview all 50+ animations at: [https://labs.danielcardoso.net/load-awesome/animations.html](https://labs.danielcardoso.net/load-awesome/animations.html)

## Best Practices

1. **Named Loaders**: Always use descriptive names for your loaders to make debugging easier
2. **Error Handling**: Always use try/finally blocks to ensure loaders are hidden even when errors occur
3. **CSS Imports**: Only import CSS files for animations you actually use to keep bundle size small
4. **Global Config**: Set sensible defaults in global configuration, override per-loader as needed
5. **Accessibility**: Consider adding appropriate ARIA labels when using custom templates
