import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService, DashboardData } from '../../services/dashboard.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <!-- Welcome Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card card-glass">
            <div class="card-body text-center py-5">
              <div class="dashboard-profile-photo mb-4">
                <div class="dashboard-profile-wrapper">
                  <img 
                    *ngIf="currentUser?.profilePhoto; else dashboardAvatar"
                    [src]="currentUser?.profilePhoto" 
                    [alt]="currentUser?.username + ' profile photo'"
                    class="dashboard-profile-photo"
                    (error)="onImageError($event)"
                  />
                  <ng-template #dashboardAvatar>
                    <div class="dashboard-avatar">
                      <i class="bi bi-person-circle"></i>
                    </div>
                  </ng-template>
                </div>
              </div>
              <h1 class="display-4 fw-bold text-primary mb-3">
                Welcome back, {{ currentUser?.username }}! 🎉
              </h1>
              <p class="lead text-muted">
                Keep building those streaks and leveling up your productivity game!
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card stat-card h-100">
            <div class="card-body text-center">
              <div class="display-6 mb-2">🔥</div>
              <h3 class="fw-bold text-primary">{{ dashboardData?.totalStreaks || 0 }}</h3>
              <p class="text-muted mb-0">Total Streaks</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="card stat-card h-100">
            <div class="card-body text-center">
              <div class="display-6 mb-2">📊</div>
              <h3 class="fw-bold text-success">{{ dashboardData?.habits || 0 }}</h3>
              <p class="text-muted mb-0">Active Habits</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="card stat-card h-100">
            <div class="card-body text-center">
              <div class="display-6 mb-2">⚡</div>
              <h3 class="fw-bold text-warning">{{ dashboardData?.activeStreaks || 0 }}</h3>
              <p class="text-muted mb-0">Active Streaks</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="card stat-card h-100">
            <div class="card-body text-center">
              <div class="display-6 mb-2">✅</div>
              <h3 class="fw-bold text-info">{{ dashboardData?.todayCompletions || 0 }}</h3>
              <p class="text-muted mb-0">Today's Completions</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Experience and Level Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card card-glass">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h4 class="fw-bold mb-2">
                    Level {{ currentUser?.level || 1 }} - {{ getLevelTitle(currentUser?.level || 1) }}
                  </h4>
                  <div class="progress mb-2" style="height: 20px;">
                    <div 
                      class="progress-bar xp-bar" 
                      role="progressbar" 
                      [style.width.%]="getExperienceProgress().percentage"
                      [attr.aria-valuenow]="getExperienceProgress().current"
                      aria-valuemin="0"
                      [attr.aria-valuemax]="getExperienceProgress().next"
                    >
                      {{ getExperienceProgress().current }} / {{ getExperienceProgress().next }} XP
                    </div>
                  </div>
                  <p class="text-muted mb-0">
                    {{ currentUser?.experience || 0 }} total experience points
                  </p>
                </div>
                <div class="col-md-4 text-center">
                  <div class="display-1 text-primary fw-bold">{{ currentUser?.level || 1 }}</div>
                  <p class="text-muted">Current Level</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Habits and Quick Actions -->
      <div class="row">
        <div class="col-md-8 mb-4">
          <div class="card card-glass h-100">
            <div class="card-header bg-transparent border-0">
              <h5 class="fw-bold mb-0">
                <i class="bi bi-clock-history me-2"></i>
                Recent Habits
              </h5>
            </div>
            <div class="card-body">
              <div *ngIf="dashboardData?.recentHabits?.length; else noHabits" class="list-group list-group-flush">
                <div 
                  *ngFor="let habit of dashboardData?.recentHabits || []" 
                  class="list-group-item d-flex justify-content-between align-items-center border-0 px-0"
                >
                  <div class="d-flex align-items-center">
                    <div 
                      class="rounded-circle me-3" 
                      [style.background-color]="habit.color"
                      style="width: 12px; height: 12px;"
                    ></div>
                    <span class="fw-semibold">{{ habit.name }}</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <span class="badge bg-warning me-2">
                      {{ getStreakEmoji(habit.currentStreak) }} {{ habit.currentStreak }}
                    </span>
                    <a [routerLink]="['/habits']" class="btn btn-sm btn-outline-primary">
                      View
                    </a>
                  </div>
                </div>
              </div>
              <ng-template #noHabits>
                <div class="text-center py-4">
                  <div class="display-6 text-muted mb-3">📝</div>
                  <p class="text-muted">No habits yet. Start by creating your first habit!</p>
                  <a routerLink="/habits" class="btn btn-primary">
                    <i class="bi bi-plus-circle me-2"></i>
                    Create Habit
                  </a>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="card card-glass h-100">
            <div class="card-header bg-transparent border-0">
              <h5 class="fw-bold mb-0">
                <i class="bi bi-lightning me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-3">
                <a routerLink="/habits" class="btn btn-primary">
                  <i class="bi bi-plus-circle me-2"></i>
                  Create New Habit
                </a>
                <a routerLink="/calendar" class="btn btn-outline-primary">
                  <i class="bi bi-calendar3 me-2"></i>
                  View Calendar
                </a>
                <a routerLink="/profile" class="btn btn-outline-secondary">
                  <i class="bi bi-person me-2"></i>
                  Edit Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }
    
    .progress {
      border-radius: 10px;
      overflow: hidden;
    }
    
    .list-group-item {
      background: transparent;
      border: none;
      padding: 0.75rem 0;
    }
    
    .list-group-item:not(:last-child) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .dashboard-profile-photo {
      display: flex;
      justify-content: center;
    }
    
    .dashboard-profile-wrapper {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid var(--bs-primary);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .dashboard-profile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .dashboard-avatar {
      font-size: 3rem;
      color: var(--bs-primary);
    }
  `]
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  currentUser: User | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  getExperienceProgress() {
    return this.dashboardService.calculateExperienceProgress(this.currentUser?.experience || 0);
  }

  getLevelTitle(level: number): string {
    return this.dashboardService.getLevelTitle(level);
  }

  getStreakEmoji(streak: number): string {
    return this.dashboardService.getStreakEmoji(streak);
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
