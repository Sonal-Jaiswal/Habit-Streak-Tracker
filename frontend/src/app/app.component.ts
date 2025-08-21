import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark glass-effect">
      <div class="container">
        <a class="navbar-brand" routerLink="/dashboard">
          <i class="bi bi-fire me-2"></i>
          Habit Streak Tracker
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto" *ngIf="currentUser">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="bi bi-house-door me-1"></i> Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/habits" routerLinkActive="active">
                <i class="bi bi-list-check me-1"></i> Habits
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/calendar" routerLinkActive="active">
                <i class="bi bi-calendar3 me-1"></i> Calendar
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/profile" routerLinkActive="active">
                <i class="bi bi-person me-1"></i> Profile
              </a>
            </li>
          </ul>
          
          <div class="navbar-nav" *ngIf="currentUser">
            <div class="nav-item dropdown">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                <div class="d-flex align-items-center me-2">
                  <div class="profile-photo-nav me-2">
                    <img 
                      *ngIf="currentUser.profilePhoto; else levelBadge"
                      [src]="currentUser.profilePhoto" 
                      [alt]="currentUser.username + ' profile'"
                      class="nav-profile-photo"
                      (error)="onImageError($event)"
                    />
                    <ng-template #levelBadge>
                      <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                           style="width: 32px; height: 32px; color: white; font-weight: 600;">
                        {{ currentUser.level }}
                      </div>
                    </ng-template>
                  </div>
                  <span>{{ currentUser.username }}</span>
                </div>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" routerLink="/profile">
                  <i class="bi bi-person me-2"></i>Profile
                </a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" (click)="logout()">
                  <i class="bi bi-box-arrow-right me-2"></i>Logout
                </a></li>
              </ul>
            </div>
          </div>
          
          <div class="navbar-nav" *ngIf="!currentUser">
            <a class="nav-link" routerLink="/auth/login">Login</a>
            <a class="nav-link" routerLink="/auth/register">Register</a>
          </div>
        </div>
      </div>
    </nav>

    <main class="container-fluid py-4">
      <router-outlet></router-outlet>
    </main>

    <!-- Toast Container for Notifications -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <!-- Toasts will be dynamically added here -->
    </div>
  `,
  styles: [`
    .navbar {
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .navbar-nav .nav-link {
      color: rgba(255, 255, 255, 0.8) !important;
      transition: color 0.3s ease;
    }
    
    .navbar-nav .nav-link:hover,
    .navbar-nav .nav-link.active {
      color: white !important;
    }
    
    .dropdown-menu {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    main {
      min-height: calc(100vh - 76px);
    }
    
    .profile-photo-nav {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    
    .nav-profile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `]
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  onImageError(event: any): void {
    // If the image fails to load, remove the profile photo
    if (this.currentUser) {
      const updatedUser: User = { 
        ...this.currentUser, 
        profilePhoto: undefined 
      };
      this.authService.updateUser(updatedUser);
    }
  }
}
