---
id: basic-crud
title: Basic CRUD Operations
sidebar_position: 1
---

## Create Operations

### Adding a Single Item

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

@Component({
  selector: 'app-user-create',
  standalone: true,
  template: `
    <div class="form-container">
      <h2>Add User</h2>
      <form (submit)="addUser()">
        <input [(ngModel)]="name" placeholder="Name" required />
        <input [(ngModel)]="email" type="email" placeholder="Email" required />
        <select [(ngModel)]="role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
        <button type="submit">Add User</button>
      </form>
      @if (successMessage) {
        <p class="success">{{ successMessage }}</p>
      }
    </div>
  `
})
export class UserCreateComponent {
  private db = inject(CatbeeIndexedDBService);

  name = '';
  email = '';
  role = 'user';
  successMessage = '';

  addUser() {
    const newUser: User = {
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: new Date().toISOString()
    };

    this.db.add('users', newUser).subscribe({
      next: (user) => {
        this.successMessage = `User added with ID: ${user.id}`;
        this.resetForm();
      },
      error: (err) => console.error('Error adding user:', err)
    });
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.role = 'user';
  }
}
```

### Adding with Custom Key

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

interface Setting {
  key: string;
  value: any;
  updatedAt: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <button (click)="saveSetting()">Save Theme Setting</button>
  `
})
export class SettingsComponent {
  private db = inject(CatbeeIndexedDBService);

  saveSetting() {
    const setting: Setting = {
      key: 'theme',
      value: { mode: 'dark', accentColor: 'blue' },
      updatedAt: new Date().toISOString()
    };

    // Assuming 'settings' store uses 'key' as keyPath
    this.db.add('settings', setting).subscribe(saved => {
      console.log('Setting saved:', saved);
    });
  }
}
```

### Adding with Validation

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-product-create',
  standalone: true,
  template: `...`
})
export class ProductCreateComponent {
  private db = inject(CatbeeIndexedDBService);

  async addProduct(product: Product) {
    // Check if SKU already exists
    const existing = await this.db
      .getByIndex<Product>('products', 'sku', product.sku)
      .toPromise();

    if (existing) {
      console.error('Product with this SKU already exists');
      return;
    }

    // Add new product
    this.db.add('products', product).subscribe({
      next: (saved) => console.log('Product added:', saved),
      error: (err) => console.error('Error:', err)
    });
  }
}
```

## Read Operations

### Get Single Item by ID

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-detail">
      @if (user) {
        <h2>{{ user.name }}</h2>
        <p>Email: {{ user.email }}</p>
        <p>Role: {{ user.role }}</p>
        <p>Created: {{ user.createdAt | date }}</p>
      } @else {
        <p>Loading...</p>
      }
    </div>
  `
})
export class UserDetailComponent implements OnInit {
  private db = inject(CatbeeIndexedDBService);
  private route = inject(ActivatedRoute);

  user: User | null = null;

  ngOnInit() {
    const userId = Number(this.route.snapshot.params['id']);

    this.db.getByID<User>('users', userId).subscribe({
      next: (user) => this.user = user,
      error: (err) => console.error('User not found:', err)
    });
  }
}
```

### Get All Items

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-list">
      <h2>Users ({{ users().length }})</h2>
      <ul>
        @for (user of users(); track user.id) {
          <li>
            <strong>{{ user.name }}</strong> - {{ user.email }}
            <span class="role">{{ user.role }}</span>
          </li>
        }
      </ul>
    </div>
  `
})
export class UserListComponent implements OnInit {
  private db = inject(CatbeeIndexedDBService);

  users = signal<User[]>([]);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.db.getAll<User>('users').subscribe({
      next: (users) => this.users.set(users),
      error: (err) => console.error('Error loading users:', err)
    });
  }
}
```

### Get by Index

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="search">
      <input
        [(ngModel)]="email"
        (keyup.enter)="searchByEmail()"
        placeholder="Search by email"
      />
      <button (click)="searchByEmail()">Search</button>

      @if (foundUser) {
        <div class="result">
          <h3>{{ foundUser.name }}</h3>
          <p>{{ foundUser.email }}</p>
        </div>
      } @else if (searched) {
        <p>No user found with this email</p>
      }
    </div>
  `
})
export class UserSearchComponent {
  private db = inject(CatbeeIndexedDBService);

  email = '';
  foundUser: User | null = null;
  searched = false;

  searchByEmail() {
    this.db.getByIndex<User>('users', 'email', this.email).subscribe({
      next: (user) => {
        this.foundUser = user;
        this.searched = true;
      },
      error: (err) => {
        this.foundUser = null;
        this.searched = true;
      }
    });
  }
}
```

### Get All by Index

```typescript
import { Component, inject, signal } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-by-role',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="role-filter">
      <h2>Filter by Role</h2>
      <select [(ngModel)]="selectedRole" (change)="loadUsersByRole()">
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="moderator">Moderator</option>
      </select>

      <div class="results">
        <h3>{{ selectedRole }} Users ({{ users().length }})</h3>
        <ul>
          @for (user of users(); track user.id) {
            <li>{{ user.name }} - {{ user.email }}</li>
          }
        </ul>
      </div>
    </div>
  `
})
export class UsersByRoleComponent {
  private db = inject(CatbeeIndexedDBService);

  selectedRole = 'admin';
  users = signal<User[]>([]);

  ngOnInit() {
    this.loadUsersByRole();
  }

  loadUsersByRole() {
    this.db.getAllByIndex<User>('users', 'role', this.selectedRole)
      .subscribe(users => {
        this.users.set(users);
      });
  }
}
```

## Update Operations

### Update Single Item

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="edit-form">
      <h2>Edit User</h2>
      <form (submit)="updateUser()">
        <input [(ngModel)]="user.name" name="name" placeholder="Name" />
        <input [(ngModel)]="user.email" name="email" placeholder="Email" />
        <select [(ngModel)]="user.role" name="role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
        <button type="submit">Update</button>
      </form>
    </div>
  `
})
export class UserEditComponent {
  private db = inject(CatbeeIndexedDBService);

  user: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    createdAt: new Date().toISOString()
  };

  updateUser() {
    this.db.update('users', this.user).subscribe({
      next: (updated) => {
        console.log('User updated:', updated);
      },
      error: (err) => console.error('Update failed:', err)
    });
  }
}
```

### Partial Update

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-user-partial-update',
  standalone: true,
  template: `<button (click)="upgradeToAdmin()">Upgrade to Admin</button>`
})
export class UserPartialUpdateComponent {
  private db = inject(CatbeeIndexedDBService);

  async upgradeToAdmin(userId: number) {
    // Fetch current user data
    const user = await this.db.getByID<User>('users', userId).toPromise();

    if (!user) {
      console.error('User not found');
      return;
    }

    // Update only the role
    const updated = { ...user, role: 'admin' };

    this.db.update('users', updated).subscribe(result => {
      console.log('User upgraded to admin:', result);
    });
  }
}
```

### Update with Timestamp

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

interface UserProfile {
  id?: number;
  name: string;
  email: string;
  updatedAt: string;
}

@Component({
  selector: 'app-profile-update',
  standalone: true,
  template: `...`
})
export class ProfileUpdateComponent {
  private db = inject(CatbeeIndexedDBService);

  updateProfile(profile: UserProfile) {
    const updated = {
      ...profile,
      updatedAt: new Date().toISOString()
    };

    this.db.update('profiles', updated).subscribe(result => {
      console.log('Profile updated:', result);
    });
  }
}
```

## Delete Operations

### Delete by ID

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-user-delete',
  standalone: true,
  template: `
    <button (click)="deleteUser(123)" class="danger">
      Delete User
    </button>
  `
})
export class UserDeleteComponent {
  private db = inject(CatbeeIndexedDBService);

  deleteUser(userId: number) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.db.deleteByKey('users', userId).subscribe({
      next: () => {
        console.log('User deleted successfully');
      },
      error: (err) => console.error('Delete failed:', err)
    });
  }
}
```

### Delete with Confirmation

```typescript
import { Component, inject, signal } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list-with-delete',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-list">
      <ul>
        @for (user of users(); track user.id) {
          <li>
            <span>{{ user.name }} - {{ user.email }}</span>
            <button (click)="confirmDelete(user)" class="delete-btn">
              Delete
            </button>
          </li>
        }
      </ul>

      @if (userToDelete) {
        <div class="modal">
          <p>Delete user "{{ userToDelete.name }}"?</p>
          <button (click)="deleteUser()">Confirm</button>
          <button (click)="cancelDelete()">Cancel</button>
        </div>
      }
    </div>
  `
})
export class UserListWithDeleteComponent {
  private db = inject(CatbeeIndexedDBService);

  users = signal<User[]>([]);
  userToDelete: User | null = null;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.db.getAll<User>('users').subscribe(users => {
      this.users.set(users);
    });
  }

  confirmDelete(user: User) {
    this.userToDelete = user;
  }

  deleteUser() {
    if (!this.userToDelete?.id) return;

    this.db.deleteByKey('users', this.userToDelete.id).subscribe(() => {
      console.log('User deleted');
      this.userToDelete = null;
      this.loadUsers(); // Reload list
    });
  }

  cancelDelete() {
    this.userToDelete = null;
  }
}
```

### Delete with Query

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-cleanup',
  standalone: true,
  template: `
    <button (click)="deleteInactiveUsers()">
      Delete Inactive Users
    </button>
  `
})
export class CleanupComponent {
  private db = inject(CatbeeIndexedDBService);

  deleteInactiveUsers() {
    // Delete users with 'inactive' status
    this.db.delete<User>('users', user => user.status === 'inactive')
      .subscribe(remaining => {
        console.log('Inactive users deleted');
        console.log('Remaining users:', remaining.length);
      });
  }
}
```

### Clear All Items

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-clear-data',
  standalone: true,
  template: `
    <button (click)="clearAllUsers()" class="danger">
      Clear All Users
    </button>
  `
})
export class ClearDataComponent {
  private db = inject(CatbeeIndexedDBService);

  clearAllUsers() {
    if (!confirm('Delete ALL users? This cannot be undone!')) {
      return;
    }

    this.db.clear('users').subscribe(() => {
      console.log('All users cleared');
    });
  }
}
```

## Counting Items

### Count All Items

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-stats',
  standalone: true,
  template: `
    <div class="stats">
      <h3>Database Statistics</h3>
      <p>Total Users: {{ userCount() }}</p>
      <p>Total Products: {{ productCount() }}</p>
    </div>
  `
})
export class StatsComponent implements OnInit {
  private db = inject(CatbeeIndexedDBService);

  userCount = signal(0);
  productCount = signal(0);

  ngOnInit() {
    this.db.count('users').subscribe(count => {
      this.userCount.set(count);
    });

    this.db.count('products').subscribe(count => {
      this.productCount.set(count);
    });
  }
}
```

### Count with Query

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';

@Component({
  selector: 'app-role-stats',
  standalone: true,
  template: `
    <p>Admin Users: {{ adminCount }}</p>
  `
})
export class RoleStatsComponent {
  private db = inject(CatbeeIndexedDBService);

  adminCount = 0;

  ngOnInit() {
    this.db.count<User>('users', user => user.role === 'admin')
      .subscribe(count => {
        this.adminCount = count;
      });
  }
}
```

## Error Handling

### Handling Errors Gracefully

```typescript
import { Component, inject } from '@angular/core';
import { CatbeeIndexedDBService } from '@ng-catbee/indexed-db';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-safe-operations',
  standalone: true,
  template: `...`
})
export class SafeOperationsComponent {
  private db = inject(CatbeeIndexedDBService);

  safeGetUser(userId: number) {
    this.db.getByID<User>('users', userId)
      .pipe(
        catchError(err => {
          console.error('Error fetching user:', err);
          // Return default user or null
          return of(null);
        })
      )
      .subscribe(user => {
        if (user) {
          console.log('User found:', user);
        } else {
          console.log('User not found or error occurred');
        }
      });
  }

  safeAdd(user: User) {
    this.db.add('users', user)
      .pipe(
        catchError(err => {
          if (err.name === 'ConstraintError') {
            console.error('Duplicate entry detected');
          } else {
            console.error('Failed to add user:', err);
          }
          return of(null);
        })
      )
      .subscribe(result => {
        if (result) {
          console.log('User added successfully');
        }
      });
  }
}
```
