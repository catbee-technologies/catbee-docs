---
id: basic-usage
title: Basic Usage
sidebar_position: 1
---

## Decoding JWT Tokens

### Basic Token Decoding

```typescript
import { Component, inject } from '@angular/core';
import { JwtService, type JwtPayload } from '@ng-catbee/jwt';

@Component({
  selector: 'app-user-profile',
  template: `
    @if (user) {
      <div class="profile">
        <h2>{{ user.name }}</h2>
        <p>Email: {{ user.email }}</p>
        <p>Role: {{ user.role }}</p>
      </div>
    }
  `
})
export class UserProfileComponent {
  private jwtService = inject(JwtService);
  user: UserPayload | null = null;

  loadUserFromToken(token: string) {
    // Decode the payload
    const payload = this.jwtService.decodePayload<UserPayload>(token);

    if (payload) {
      this.user = payload;
    }
  }
}

interface UserPayload extends JwtPayload {
  name: string;
  email: string;
  role: string;
}
```

### Decoding Complete JWT

```typescript
import { Component, inject } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';

@Component({
  selector: 'app-token-inspector',
  template: `
    <div class="token-details">
      @if (decodedToken) {
        <h3>Header</h3>
        <pre>{{ decodedToken.header | json }}</pre>

        <h3>Payload</h3>
        <pre>{{ decodedToken.payload | json }}</pre>

        <h3>Signature</h3>
        <code>{{ decodedToken.signature }}</code>
      }
    </div>
  `
})
export class TokenInspectorComponent {
  private jwtService = inject(JwtService);
  decodedToken: any = null;

  inspectToken(token: string) {
    // Decode header, payload, and signature
    this.decodedToken = this.jwtService.decode(token);
  }
}
```

## Validating Tokens

### Format Validation

```typescript
import { Component, inject } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';

@Component({
  selector: 'app-token-validator'
})
export class TokenValidatorComponent {
  private jwtService = inject(JwtService);

  validateToken(token: string): boolean {
    // Check if token has valid JWT format (3 parts separated by dots)
    if (!this.jwtService.isValidFormat(token)) {
      console.error('Invalid JWT format');
      return false;
    }

    // Token format is valid
    return true;
  }
}
```

### Expiration Check

```typescript
import { Component, inject } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';

@Component({
  selector: 'app-token-checker'
})
export class TokenCheckerComponent {
  private jwtService = inject(JwtService);

  isTokenValid(token: string): boolean {
    // Check format
    if (!this.jwtService.isValidFormat(token)) {
      return false;
    }

    // Check expiration
    if (this.jwtService.isExpired(token)) {
      console.log('Token has expired');
      return false;
    }

    return true;
  }

  // Check if token will expire soon (within 5 minutes)
  willExpireSoon(token: string): boolean {
    return this.jwtService.isExpired(token, 300); // 300 seconds = 5 minutes
  }
}
```

## Extracting Claims

### Getting Specific Claims

```typescript
import { Component, inject } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';

@Component({
  selector: 'app-claims-extractor'
})
export class ClaimsExtractorComponent {
  private jwtService = inject(JwtService);

  extractUserInfo(token: string) {
    // Extract individual claims
    const userId = this.jwtService.getClaim<string>(token, 'userId');
    const email = this.jwtService.getClaim<string>(token, 'email');
    const role = this.jwtService.getClaim<string>(token, 'role');
    const permissions = this.jwtService.getClaim<string[]>(token, 'permissions');

    console.log('User ID:', userId);
    console.log('Email:', email);
    console.log('Role:', role);
    console.log('Permissions:', permissions);

    return { userId, email, role, permissions };
  }
}
```

## Token Dates

### Getting Expiration and Issued Dates

```typescript
import { Component, inject } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';

@Component({
  selector: 'app-token-dates',
  template: `
    <div class="token-info">
      <p>Issued: {{ issuedDate | date:'medium' }}</p>
      <p>Expires: {{ expirationDate | date:'medium' }}</p>
      <p>Remaining: {{ remainingSeconds }}s</p>
    </div>
  `
})
export class TokenDatesComponent {
  private jwtService = inject(JwtService);

  issuedDate: Date | null = null;
  expirationDate: Date | null = null;
  remainingSeconds: number | null = null;

  loadTokenInfo(token: string) {
    // Get issued date
    this.issuedDate = this.jwtService.getIssuedDate(token);

    // Get expiration date
    this.expirationDate = this.jwtService.getExpirationDate(token);

    // Get remaining time in seconds
    this.remainingSeconds = this.jwtService.getRemainingTime(token);
  }
}
```

## Type-Safe Payloads

### Custom Payload Interface

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { JwtService, type JwtPayload } from '@ng-catbee/jwt';

// Define your custom payload structure
interface CustomPayload extends JwtPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  permissions: string[];
  organizationId: string;
  metadata: {
    lastLogin: number;
    loginCount: number;
  };
}

@Component({
  selector: 'app-user-dashboard',
  template: `
    @if (userInfo(); as user) {
      <div class="dashboard">
        <h1>Welcome, {{ user.email }}</h1>
        <p>Role: {{ user.role }}</p>
        <p>Organization: {{ user.organizationId }}</p>
        <p>Login Count: {{ user.metadata.loginCount }}</p>
      </div>
    }
  `
})
export class UserDashboardComponent implements OnInit {
  private jwtService = inject(JwtService);
  private authService = inject(AuthService);

  userInfo = signal<CustomPayload | null>(null);

  ngOnInit() {
    const token = this.authService.getToken();

    if (token && !this.jwtService.isExpired(token)) {
      // Type-safe decoding with custom interface
      const payload = this.jwtService.decodePayload<CustomPayload>(token);
      this.userInfo.set(payload);
    }
  }
}
```
