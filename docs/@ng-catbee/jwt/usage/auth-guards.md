---
id: auth-guards
title: Auth Guards
sidebar_position: 2
---

## Functional Route Guards

### Basic Auth Guard

```typescript
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const jwtService = inject(JwtService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  // Check if token exists, is valid format, and not expired
  if (!token || !jwtService.isValidFormat(token) || jwtService.isExpired(token)) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
```

### Usage in Routes

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component'),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component')
  }
];
```

## Role-Based Guards

### Role Guard

```typescript
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const jwtService = inject(JwtService);
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();

    if (!token || !jwtService.isValidFormat(token) || jwtService.isExpired(token)) {
      return router.createUrlTree(['/login']);
    }

    const role = jwtService.getClaim<string>(token, 'role');

    if (!role || !allowedRoles.includes(role)) {
      return router.createUrlTree(['/forbidden']);
    }

    return true;
  };
};
```

### Usage with Roles

```typescript
import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component'),
    canActivate: [roleGuard(['admin'])]
  },
  {
    path: 'moderator',
    loadComponent: () => import('./moderator/moderator.component'),
    canActivate: [roleGuard(['admin', 'moderator'])]
  }
];
```

## Permission-Based Guards

### Permission Guard

```typescript
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

export const permissionGuard = (requiredPermissions: string[]): CanActivateFn => {
  return () => {
    const jwtService = inject(JwtService);
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();

    if (!token || !jwtService.isValidFormat(token) || jwtService.isExpired(token)) {
      return router.createUrlTree(['/login']);
    }

    const permissions = jwtService.getClaim<string[]>(token, 'permissions') || [];

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every(
      permission => permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return router.createUrlTree(['/forbidden']);
    }

    return true;
  };
};
```

### Usage with Permissions

```typescript
import { Routes } from '@angular/router';
import { permissionGuard } from './guards/permission.guard';

export const routes: Routes = [
  {
    path: 'users/create',
    loadComponent: () => import('./users/create-user.component'),
    canActivate: [permissionGuard(['users:create'])]
  },
  {
    path: 'users/delete',
    loadComponent: () => import('./users/delete-user.component'),
    canActivate: [permissionGuard(['users:delete', 'users:manage'])]
  }
];
```

## Token Freshness Guard

### Check Token Age

```typescript
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

export const tokenFreshnessGuard = (maxAgeMinutes: number): CanActivateFn => {
  return () => {
    const jwtService = inject(JwtService);
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();

    if (!token || !jwtService.isValidFormat(token) || jwtService.isExpired(token)) {
      return router.createUrlTree(['/login']);
    }

    const issuedDate = jwtService.getIssuedDate(token);

    if (!issuedDate) {
      return router.createUrlTree(['/login']);
    }

    const ageInMinutes = (Date.now() - issuedDate.getTime()) / (1000 * 60);

    if (ageInMinutes > maxAgeMinutes) {
      // Token is too old, require re-authentication
      authService.clearToken();
      return router.createUrlTree(['/login'], {
        queryParams: { reason: 'token-expired' }
      });
    }

    return true;
  };
};
```

## Combined Guards

### Comprehensive Guard

```typescript
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

export const comprehensiveGuard = (
  options: {
    roles?: string[];
    permissions?: string[];
    checkFreshness?: boolean;
    maxAgeMinutes?: number;
  }
): CanActivateFn => {
  return () => {
    const jwtService = inject(JwtService);
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();

    // Basic validation
    if (!token || !jwtService.isValidFormat(token) || jwtService.isExpired(token)) {
      return router.createUrlTree(['/login']);
    }

    // Role validation
    if (options.roles?.length) {
      const role = jwtService.getClaim<string>(token, 'role');
      if (!role || !options.roles.includes(role)) {
        return router.createUrlTree(['/forbidden']);
      }
    }

    // Permission validation
    if (options.permissions?.length) {
      const permissions = jwtService.getClaim<string[]>(token, 'permissions') || [];
      const hasPermissions = options.permissions.every(p => permissions.includes(p));
      if (!hasPermissions) {
        return router.createUrlTree(['/forbidden']);
      }
    }

    // Freshness check
    if (options.checkFreshness && options.maxAgeMinutes) {
      const issuedDate = jwtService.getIssuedDate(token);
      if (issuedDate) {
        const ageInMinutes = (Date.now() - issuedDate.getTime()) / (1000 * 60);
        if (ageInMinutes > options.maxAgeMinutes) {
          authService.clearToken();
          return router.createUrlTree(['/login']);
        }
      }
    }

    return true;
  };
};
```

### Usage

```typescript
import { Routes } from '@angular/router';
import { comprehensiveGuard } from './guards/comprehensive.guard';

export const routes: Routes = [
  {
    path: 'admin/sensitive',
    loadComponent: () => import('./admin/sensitive.component'),
    canActivate: [comprehensiveGuard({
      roles: ['admin'],
      permissions: ['admin:access', 'sensitive:read'],
      checkFreshness: true,
      maxAgeMinutes: 30
    })]
  }
];
```
