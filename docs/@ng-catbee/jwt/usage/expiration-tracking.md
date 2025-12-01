---
id: expiration-tracking
title: Expiration Tracking
sidebar_position: 4
---

## Real-Time Countdown

### Watch Token Expiration

```typescript
import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-token-countdown',
  standalone: true,
  template: `
    <div class="token-status">
      @if (remainingSeconds() !== null) {
        <div class="countdown" [class.warning]="isWarning()">
          <span class="icon">⏱️</span>
          <span class="time">{{ formatTime(remainingSeconds()!) }}</span>
          <span class="label">until session expires</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .countdown {
      padding: 1rem;
      border-radius: 8px;
      background: #f0f0f0;
    }
    .countdown.warning {
      background: #fff3cd;
      color: #856404;
    }
  `]
})
export class TokenCountdownComponent implements OnInit, OnDestroy {
  private jwtService = inject(JwtService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  remainingSeconds = signal<number | null>(null);
  isWarning = signal(false);

  ngOnInit() {
    const token = this.authService.getToken();

    if (token) {
      // Watch token expiration every second
      this.jwtService.watchExpiry(token, 1000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(remaining => {
          this.remainingSeconds.set(remaining);
          this.isWarning.set(remaining < 300); // Warning if less than 5 minutes

          if (remaining <= 0) {
            // Token expired
            this.authService.logout();
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}
```

## Progress Bar

### Visual Expiration Indicator

```typescript
import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-token-progress',
  standalone: true,
  template: `
    <div class="token-progress">
      <div class="progress-bar">
        <div
          class="progress-fill"
          [style.width.%]="progressPercentage()"
          [class.warning]="progressPercentage() < 20"
        ></div>
      </div>
      <div class="progress-text">
        Session: {{ formatTime(remainingSeconds()!) }}
      </div>
    </div>
  `,
  styles: [`
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: #4caf50;
      transition: width 1s linear, background-color 0.3s;
    }
    .progress-fill.warning {
      background: #ff9800;
    }
  `]
})
export class TokenProgressComponent implements OnInit, OnDestroy {
  private jwtService = inject(JwtService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  remainingSeconds = signal<number | null>(null);
  totalSeconds = signal<number>(0);
  progressPercentage = signal(100);

  ngOnInit() {
    const token = this.authService.getToken();

    if (token) {
      const issuedDate = this.jwtService.getIssuedDate(token);
      const expirationDate = this.jwtService.getExpirationDate(token);

      if (issuedDate && expirationDate) {
        const total = Math.floor((expirationDate.getTime() - issuedDate.getTime()) / 1000);
        this.totalSeconds.set(total);
      }

      this.jwtService.watchExpiry(token, 1000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(remaining => {
          this.remainingSeconds.set(remaining);
          const percentage = (remaining / this.totalSeconds()) * 100;
          this.progressPercentage.set(Math.max(0, percentage));
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  }
}
```

## Auto-Refresh Service

### Background Token Refresh

```typescript
import { Injectable, inject, OnDestroy } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';
import { Subject, takeUntil, switchMap, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TokenRefreshService implements OnDestroy {
  private jwtService = inject(JwtService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  private readonly REFRESH_THRESHOLD = 300; // Refresh 5 minutes before expiration

  startWatching() {
    const token = this.authService.getToken();

    if (!token) return;

    this.jwtService.watchExpiry(token, 60000) // Check every minute
      .pipe(
        takeUntil(this.destroy$),
        switchMap(remaining => {
          if (remaining <= this.REFRESH_THRESHOLD && remaining > 0) {
            // Token will expire soon, refresh it
            return this.authService.refreshToken();
          }
          return timer(60000); // Wait for next check
        })
      )
      .subscribe({
        next: (newToken) => {
          if (typeof newToken === 'string') {
            console.log('Token refreshed successfully');
            // Restart watching with new token
            this.startWatching();
          }
        },
        error: (error) => {
          console.error('Token refresh failed', error);
          this.authService.logout();
        }
      });
  }

  stopWatching() {
    this.destroy$.next();
  }

  ngOnDestroy() {
    this.stopWatching();
  }
}
```

## Expiration Notifications

### Toast/Alert on Expiration

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-expiration-notifier',
  standalone: true,
  template: ``
})
export class ExpirationNotifierComponent implements OnInit, OnDestroy {
  private jwtService = inject(JwtService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  private notificationShown = {
    fiveMinutes: false,
    oneMinute: false,
    expired: false
  };

  ngOnInit() {
    const token = this.authService.getToken();

    if (token) {
      this.jwtService.watchExpiry(token, 1000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(remaining => {
          // 5 minute warning
          if (remaining <= 300 && remaining > 299 && !this.notificationShown.fiveMinutes) {
            this.notificationService.warn('Your session will expire in 5 minutes');
            this.notificationShown.fiveMinutes = true;
          }

          // 1 minute warning
          if (remaining <= 60 && remaining > 59 && !this.notificationShown.oneMinute) {
            this.notificationService.error('Your session will expire in 1 minute');
            this.notificationShown.oneMinute = true;
          }

          // Expired
          if (remaining <= 0 && !this.notificationShown.expired) {
            this.notificationService.error('Your session has expired. Please login again.');
            this.notificationShown.expired = true;
            this.authService.logout();
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Session Extension

### Extend Session on Activity

```typescript
import { Injectable, inject } from '@angular/core';
import { JwtService } from '@ng-catbee/jwt';
import { AuthService } from './auth.service';
import { fromEvent, merge, debounceTime, filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionExtensionService {
  private jwtService = inject(JwtService);
  private authService = inject(AuthService);
  private readonly EXTENSION_THRESHOLD = 600; // Extend if less than 10 minutes remaining

  watchUserActivity() {
    // Watch for user activity
    const activity$ = merge(
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'touchstart')
    ).pipe(
      debounceTime(5000) // Debounce to avoid too many checks
    );

    activity$.subscribe(() => {
      this.checkAndExtend();
    });
  }

  private checkAndExtend() {
    const token = this.authService.getToken();

    if (!token) return;

    const remaining = this.jwtService.getRemainingTime(token);

    if (remaining !== null && remaining < this.EXTENSION_THRESHOLD && remaining > 0) {
      // Token will expire soon, extend the session
      this.authService.refreshToken().subscribe({
        next: () => console.log('Session extended due to user activity'),
        error: (error) => console.error('Failed to extend session', error)
      });
    }
  }
}
```
