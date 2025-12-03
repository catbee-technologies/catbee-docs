---
id: role-based-access
title: Role-Based Access Control
sidebar_position: 5
---

## Auth Service with Roles

### Complete Auth Service

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CatbeeJwtService } from '@ng-catbee/jwt';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private jwtService = inject(CatbeeJwtService);
  private http = inject(HttpClient);
  private router = inject(Router);

  private tokenKey = 'auth_token';
  currentUser = signal<any>(null);

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.loadCurrentUser();
      })
    );
  }

  logout() {
    this.clearToken();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  loadCurrentUser() {
    const token = this.getToken();
    if (token && !this.jwtService.isExpired(token)) {
      const payload = this.jwtService.decodePayload(token);
      this.currentUser.set(payload);
    }
  }

  // Role checking
  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;

    const userRole = this.jwtService.getClaim<string>(token, 'role');
    return userRole === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const token = this.getToken();
    if (!token) return false;

    const userRole = this.jwtService.getClaim<string>(token, 'role');
    return roles.includes(userRole || '');
  }

  // Permission checking
  hasPermission(permission: string): boolean {
    const token = this.getToken();
    if (!token) return false;

    const permissions = this.jwtService.getClaim<string[]>(token, 'permissions') || [];
    return permissions.includes(permission);
  }

  hasAllPermissions(requiredPermissions: string[]): boolean {
    const token = this.getToken();
    if (!token) return false;

    const permissions = this.jwtService.getClaim<string[]>(token, 'permissions') || [];
    return requiredPermissions.every(p => permissions.includes(p));
  }

  hasAnyPermission(requiredPermissions: string[]): boolean {
    const token = this.getToken();
    if (!token) return false;

    const permissions = this.jwtService.getClaim<string[]>(token, 'permissions') || [];
    return requiredPermissions.some(p => permissions.includes(p));
  }

  refreshToken(): Observable<string> {
    return this.http.post<LoginResponse>('/api/auth/refresh', {}).pipe(
      tap(response => {
        this.setToken(response.token);
        this.loadCurrentUser();
      }),
      tap(response => response.token)
    );
  }
}
```

## Role-Based UI

### Conditional Rendering by Role

```typescript
import { Component, inject, computed } from '@angular/core';
import { CatbeeJwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      @if (isAdmin()) {
        <div class="admin-panel">
          <h2>Admin Controls</h2>
          <button>Manage Users</button>
          <button>View Reports</button>
        </div>
      }

      @if (isModerator()) {
        <div class="moderator-panel">
          <h2>Moderator Tools</h2>
          <button>Review Content</button>
        </div>
      }

      @if (isUser()) {
        <div class="user-panel">
          <h2>My Profile</h2>
          <button>Edit Profile</button>
        </div>
      }
    </div>
  `
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private jwtService = inject(CatbeeJwtService);

  private role = computed(() => {
    const token = this.authService.getToken();
    return token ? this.jwtService.getClaim<string>(token, 'role') : null;
  });

  isAdmin = computed(() => this.role() === 'admin');
  isModerator = computed(() => this.role() === 'moderator');
  isUser = computed(() => this.role() === 'user');
}
```

## Permission Directive

### Structural Directive for Permissions

```typescript
import { Directive, inject, Input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { CatbeeJwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private jwtService = inject(CatbeeJwtService);
  private authService = inject(AuthService);

  @Input() set hasPermission(permission: string | string[]) {
    this.checkPermission(permission);
  }

  private checkPermission(permission: string | string[]) {
    const token = this.authService.getToken();

    if (!token) {
      this.viewContainer.clear();
      return;
    }

    const permissions = this.jwtService.getClaim<string[]>(token, 'permissions') || [];
    const requiredPermissions = Array.isArray(permission) ? permission : [permission];
    const hasPermission = requiredPermissions.every(p => permissions.includes(p));

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

### Usage

```typescript
import { Component } from '@angular/core';
import { HasPermissionDirective } from './directives/has-permission.directive';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [HasPermissionDirective],
  template: `
    <div *hasPermission="'users:create'">
      <button>Create User</button>
    </div>

    <div *hasPermission="['users:edit', 'users:manage']">
      <button>Edit User</button>
    </div>
  `
})
export class ContentComponent {}
```

## Role Directive

### Structural Directive for Roles

```typescript
import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { CatbeeJwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

@Directive({
  selector: '[hasRole]',
  standalone: true
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private jwtService = inject(CatbeeJwtService);
  private authService = inject(AuthService);

  @Input() set hasRole(role: string | string[]) {
    this.checkRole(role);
  }

  private checkRole(role: string | string[]) {
    const token = this.authService.getToken();

    if (!token) {
      this.viewContainer.clear();
      return;
    }

    const userRole = this.jwtService.getClaim<string>(token, 'role');
    const requiredRoles = Array.isArray(role) ? role : [role];
    const hasRole = requiredRoles.includes(userRole || '');

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

### Usage

```typescript
import { Component } from '@angular/core';
import { HasRoleDirective } from './directives/has-role.directive';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [HasRoleDirective],
  template: `
    <div *hasRole="'admin'">
      <h2>Admin Dashboard</h2>
    </div>

    <div *hasRole="['admin', 'moderator']">
      <h2>Management Tools</h2>
    </div>
  `
})
export class AdminPanelComponent {}
```

## Access Control Service

### Centralized Access Control

```typescript
import { Injectable, inject } from '@angular/core';
import { CatbeeJwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

interface AccessRule {
  roles?: string[];
  permissions?: string[];
  customCheck?: () => boolean;
}

@Injectable({ providedIn: 'root' })
export class AccessControlService {
  private jwtService = inject(CatbeeJwtService);
  private authService = inject(AuthService);

  canAccess(rule: AccessRule): boolean {
    const token = this.authService.getToken();

    if (!token || this.jwtService.isExpired(token)) {
      return false;
    }

    // Check roles
    if (rule.roles?.length) {
      const userRole = this.jwtService.getClaim<string>(token, 'role');
      if (!userRole || !rule.roles.includes(userRole)) {
        return false;
      }
    }

    // Check permissions
    if (rule.permissions?.length) {
      const permissions = this.jwtService.getClaim<string[]>(token, 'permissions') || [];
      const hasPermissions = rule.permissions.every(p => permissions.includes(p));
      if (!hasPermissions) {
        return false;
      }
    }

    // Custom check
    if (rule.customCheck && !rule.customCheck()) {
      return false;
    }

    return true;
  }

  // Feature flags from token
  hasFeature(featureName: string): boolean {
    const token = this.authService.getToken();
    if (!token) return false;

    const features = this.jwtService.getClaim<string[]>(token, 'features') || [];
    return features.includes(featureName);
  }

  // Organization-based access
  isInOrganization(organizationId: string): boolean {
    const token = this.authService.getToken();
    if (!token) return false;

    const userOrgId = this.jwtService.getClaim<string>(token, 'organizationId');
    return userOrgId === organizationId;
  }
}
```

### Usage

```typescript
import { Component, inject, computed } from '@angular/core';
import { AccessControlService } from './services/access-control.service';

@Component({
  selector: 'app-features',
  template: `
    @if (canCreateUsers()) {
      <button>Create User</button>
    }

    @if (canEditSettings()) {
      <button>Edit Settings</button>
    }

    @if (hasNewFeature()) {
      <div class="new-feature">
        <h3>New Feature Available!</h3>
      </div>
    }
  `
})
export class FeaturesComponent {
  private accessControl = inject(AccessControlService);

  canCreateUsers = computed(() =>
    this.accessControl.canAccess({
      roles: ['admin'],
      permissions: ['users:create']
    })
  );

  canEditSettings = computed(() =>
    this.accessControl.canAccess({
      permissions: ['settings:edit', 'settings:manage']
    })
  );

  hasNewFeature = computed(() =>
    this.accessControl.hasFeature('beta-dashboard')
  );
}
```
