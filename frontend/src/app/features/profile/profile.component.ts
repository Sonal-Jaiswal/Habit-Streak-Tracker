import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <div class="card card-glass">
            <div class="card-body text-center py-5">
              <div class="profile-photo-container mb-4">
                <div class="profile-photo-wrapper">
                  <img 
                    *ngIf="currentUser?.profilePhoto; else defaultAvatar"
                    [src]="currentUser?.profilePhoto" 
                    [alt]="currentUser?.username + ' profile photo'"
                    class="profile-photo"
                    (error)="onImageError($event)"
                  />
                  <ng-template #defaultAvatar>
                    <div class="default-avatar">
                      <i class="bi bi-person-circle"></i>
                    </div>
                  </ng-template>
                </div>
                <button class="btn btn-sm btn-outline-primary mt-2" (click)="editProfilePhoto()">
                  <i class="bi bi-camera me-1"></i>
                  Change Photo
                </button>
              </div>
              <h2 class="fw-bold mb-3">User Profile</h2>
              <p class="text-muted">Your habit tracking journey and achievements</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card card-glass h-100">
            <div class="card-header bg-transparent border-0">
              <h5 class="fw-bold mb-0">
                <i class="bi bi-person-circle me-2"></i>
                Personal Information
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label fw-semibold">Username</label>
                <p class="mb-0">{{ currentUser?.username }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Email</label>
                <p class="mb-0">{{ currentUser?.email }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Member Since</label>
                <p class="mb-0">{{ getMemberSince() }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card card-glass h-100">
            <div class="card-header bg-transparent border-0">
              <h5 class="fw-bold mb-0">
                <i class="bi bi-trophy me-2"></i>
                Achievements & Stats
              </h5>
            </div>
            <div class="card-body">
              <div class="text-center mb-4">
                <div class="display-4 text-primary fw-bold mb-2">{{ currentUser?.level || 1 }}</div>
                <p class="text-muted mb-0">{{ getLevelTitle(currentUser?.level || 1) }}</p>
              </div>
              
              <div class="mb-3">
                <label class="form-label fw-semibold">Experience Points</label>
                <div class="progress mb-2">
                  <div 
                    class="progress-bar xp-bar" 
                    role="progressbar" 
                    [style.width.%]="getExperienceProgress().percentage"
                  ></div>
                </div>
                <small class="text-muted">
                  {{ getExperienceProgress().current }} / {{ getExperienceProgress().next }} XP to next level
                </small>
              </div>
              
              <div class="mb-3">
                <label class="form-label fw-semibold">Total Streaks</label>
                <p class="mb-0">{{ currentUser?.totalStreaks || 0 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card card-glass">
            <div class="card-header bg-transparent border-0">
              <h5 class="fw-bold mb-0">
                <i class="bi bi-gear me-2"></i>
                Account Settings
              </h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2 d-md-flex">
                <button class="btn btn-outline-primary">
                  <i class="bi bi-pencil me-2"></i>
                  Edit Profile
                </button>
                <button class="btn btn-outline-secondary">
                  <i class="bi bi-shield-lock me-2"></i>
                  Change Password
                </button>
                <button class="btn btn-outline-danger" (click)="logout()">
                  <i class="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
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
      height: 8px;
      border-radius: 4px;
    }
    
    .profile-photo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .profile-photo-wrapper {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid var(--bs-primary);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .profile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .default-avatar {
      font-size: 4rem;
      color: var(--bs-primary);
    }
    
    .profile-photo:hover {
      transform: scale(1.05);
      transition: transform 0.3s ease;
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getMemberSince(): string {
    // This would come from the user object in a real app
    return 'January 2024';
  }

  getLevelTitle(level: number): string {
    return this.dashboardService.getLevelTitle(level);
  }

  getExperienceProgress() {
    return this.dashboardService.calculateExperienceProgress(this.currentUser?.experience || 0);
  }

  logout(): void {
    this.authService.logout();
  }

  editProfilePhoto(): void {
    const photoUrl = prompt('Enter the URL of your profile photo:');
    if (photoUrl && photoUrl.trim() && this.currentUser) {
      const updatedUser: User = { 
        ...this.currentUser, 
        profilePhoto: photoUrl.trim() 
      };
      this.authService.updateUser(updatedUser);
    }
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
