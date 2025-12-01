---
id: http-interceptors
title: HTTP Interceptors
sidebar_position: 3
---

## Basic JWT Interceptor

### Attach Token to Requests

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const authService = inject(AuthService);

  const token = authService.getToken();

  // Only attach token if it's valid and not expired
  if (token && jwtService.isValidFormat(token) && !jwtService.isExpired(token)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

### Register Interceptor

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    )
  ]
};
```

## Conditional Token Attachment

### Skip Certain URLs

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

const PUBLIC_URLS = ['/api/auth/login', '/api/auth/register', '/api/public'];

export const selectiveJwtInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const authService = inject(AuthService);

  // Skip token for public URLs
  const isPublicUrl = PUBLIC_URLS.some(url => req.url.includes(url));
  if (isPublicUrl) {
    return next(req);
  }

  const token = authService.getToken();

  if (token && jwtService.isValidFormat(token) && !jwtService.isExpired(token)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

## Auto-Refresh Token

### Refresh on Expiration

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const authService = inject(AuthService);

  const token = authService.getToken();

  // Attach token if available and valid
  if (token && jwtService.isValidFormat(token) && !jwtService.isExpired(token)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // If 401 error, try to refresh token
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(newToken => {
            // Retry request with new token
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(clonedReq);
          }),
          catchError(refreshError => {
            // Refresh failed, logout user
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
```

## Token Expiration Warning

### Warn Before Expiration

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

const WARNING_THRESHOLD_SECONDS = 300; // 5 minutes

export const expirationWarningInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    tap(() => {
      const token = authService.getToken();

      if (token && jwtService.isValidFormat(token)) {
        const remaining = jwtService.getRemainingTime(token);

        if (remaining !== null && remaining > 0 && remaining < WARNING_THRESHOLD_SECONDS) {
          notificationService.warn(
            `Your session will expire in ${Math.floor(remaining / 60)} minutes`
          );
        }
      }
    })
  );
};
```

## Add Custom Headers Based on Claims

### Dynamic Headers from Token

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

export const customHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const authService = inject(AuthService);

  const token = authService.getToken();

  if (token && jwtService.isValidFormat(token) && !jwtService.isExpired(token)) {
    // Extract claims from token
    const userId = jwtService.getClaim<string>(token, 'userId');
    const organizationId = jwtService.getClaim<string>(token, 'organizationId');
    const role = jwtService.getClaim<string>(token, 'role');

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`
    };

    // Add custom headers based on claims
    if (userId) headers['X-User-Id'] = userId;
    if (organizationId) headers['X-Organization-Id'] = organizationId;
    if (role) headers['X-User-Role'] = role;

    req = req.clone({ setHeaders: headers });
  }

  return next(req);
};
```

## Logging Interceptor

### Log Token Usage

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';

export const tokenLoggingInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const authService = inject(AuthService);

  const token = authService.getToken();

  if (token) {
    const isValid = jwtService.isValidFormat(token);
    const isExpired = jwtService.isExpired(token);
    const remaining = jwtService.getRemainingTime(token);

    console.log('JWT Interceptor:', {
      url: req.url,
      hasToken: true,
      isValid,
      isExpired,
      remainingSeconds: remaining,
      willAttach: isValid && !isExpired
    });
  } else {
    console.log('JWT Interceptor:', {
      url: req.url,
      hasToken: false
    });
  }

  return next(req);
};
```

## Complete Interceptor Setup

### Multiple Interceptors

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { refreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { expirationWarningInterceptor } from './interceptors/expiration-warning.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        jwtInterceptor,
        refreshTokenInterceptor,
        expirationWarningInterceptor
      ])
    )
  ]
};
```
