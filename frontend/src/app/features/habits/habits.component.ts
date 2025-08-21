import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HabitService, Habit, CreateHabitData } from '../../services/habit.service';

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card card-glass">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <h3 class="fw-bold mb-0">
                  <i class="bi bi-list-check me-2"></i>
                  My Habits
                </h3>
                <p class="text-muted mb-0 mt-2">
                  Track your daily habits and build amazing streaks
                </p>
              </div>
              <button class="btn btn-primary" (click)="showCreateForm = true">
                <i class="bi bi-plus-circle me-2"></i>
                New Habit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Habit Form -->
      <div class="row mb-4" *ngIf="showCreateForm">
        <div class="col-12">
          <div class="card card-glass">
            <div class="card-header bg-transparent border-0">
              <h5 class="fw-bold mb-0">Create New Habit</h5>
            </div>
            <div class="card-body">
              <form [formGroup]="habitForm" (ngSubmit)="createHabit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="name" class="form-label">Habit Name *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      formControlName="name"
                      placeholder="e.g., Exercise, Reading, Meditation"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="category" class="form-label">Category</label>
                    <select class="form-select" id="category" formControlName="category">
                      <option value="">Select Category</option>
                      <option value="health">Health & Fitness</option>
                      <option value="learning">Learning & Growth</option>
                      <option value="productivity">Productivity</option>
                      <option value="mindfulness">Mindfulness</option>
                      <option value="social">Social</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea
                    class="form-control"
                    id="description"
                    rows="3"
                    formControlName="description"
                    placeholder="Describe your habit (optional)"
                  ></textarea>
                </div>
                
                <div class="mb-3">
                  <label for="color" class="form-label">Color</label>
                  <div class="d-flex gap-2">
                    <div
                      *ngFor="let color of habitColors"
                      class="color-option"
                      [class.selected]="habitForm.get('color')?.value === color"
                      [style.background-color]="color"
                      (click)="selectColor(color)"
                    ></div>
                  </div>
                </div>
                
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="habitForm.invalid || isCreating">
                    <span class="spinner-border spinner-border-sm me-2" *ngIf="isCreating"></span>
                    {{ isCreating ? 'Creating...' : 'Create Habit' }}
                  </button>
                  <button type="button" class="btn btn-outline-secondary" (click)="cancelCreate()">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Habits Grid -->
      <div class="row" *ngIf="habits.length > 0; else noHabits">
        <div class="col-md-6 col-lg-4 mb-4" *ngFor="let habit of habits">
          <div class="card habit-card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="d-flex align-items-center">
                  <div
                    class="rounded-circle me-3"
                    [style.background-color]="habit.color"
                    style="width: 16px; height: 16px;"
                  ></div>
                  <h6 class="fw-bold mb-0">{{ habit.name }}</h6>
                </div>
                <div class="dropdown">
                  <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" (click)="editHabit(habit)">
                      <i class="bi bi-pencil me-2"></i>Edit
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" (click)="deleteHabit(habit._id)">
                      <i class="bi bi-trash me-2"></i>Delete
                    </a></li>
                  </ul>
                </div>
              </div>
              
              <p class="text-muted small mb-3" *ngIf="habit.description">
                {{ habit.description }}
              </p>
              
              <div class="mb-3">
                <span class="badge bg-secondary me-2" *ngIf="habit.category">
                  {{ habit.category }}
                </span>
                <span class="badge bg-info">
                  {{ habit.totalCompletions }} completions
                </span>
              </div>
              
              <div class="text-center mb-3">
                <div class="habit-streak">
                  {{ getStreakEmoji(habit.currentStreak) }} {{ habit.currentStreak }}
                </div>
                <small class="text-muted">Current Streak</small>
              </div>
              
              <div class="d-grid">
                <button
                  class="btn btn-success"
                  (click)="toggleHabitCompletion(habit)"
                  [disabled]="isCompleting === habit._id"
                >
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="isCompleting === habit._id"></span>
                  <i class="bi" [class.bi-check-circle]="isHabitCompletedToday(habit)" [class.bi-circle]="!isHabitCompletedToday(habit)"></i>
                  {{ isHabitCompletedToday(habit) ? 'Completed Today' : 'Mark Complete' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Habits Message -->
      <ng-template #noHabits>
        <div class="row">
          <div class="col-12">
            <div class="card card-glass">
              <div class="card-body text-center py-5">
                <div class="display-6 text-muted mb-3">📝</div>
                <h4 class="fw-bold mb-3">No Habits Yet</h4>
                <p class="text-muted mb-4">
                  Start building your daily routine by creating your first habit
                </p>
                <button class="btn btn-primary btn-lg" (click)="showCreateForm = true">
                  <i class="bi bi-plus-circle me-2"></i>
                  Create Your First Habit
                </button>
              </div>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .color-option {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s ease;
    }
    
    .color-option:hover {
      transform: scale(1.1);
    }
    
    .color-option.selected {
      border-color: #333;
      transform: scale(1.1);
    }
    
    .habit-card {
      transition: all 0.3s ease;
    }
    
    .habit-card:hover {
      transform: translateY(-4px);
    }
    
    .habit-streak {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent-color);
    }
  `]
})
export class HabitsComponent implements OnInit {
  habits: Habit[] = [];
  showCreateForm = false;
  habitForm: FormGroup;
  isCreating = false;
  isCompleting: string | null = null;
  
  habitColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  constructor(
    private habitService: HabitService,
    private fb: FormBuilder
  ) {
    this.habitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      category: [''],
      color: ['#3B82F6', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadHabits();
  }

  loadHabits(): void {
    this.habitService.getHabits().subscribe({
      next: (habits) => {
        this.habits = habits;
      },
      error: (error) => {
        console.error('Error loading habits:', error);
      }
    });
  }

  selectColor(color: string): void {
    this.habitForm.patchValue({ color });
  }

  createHabit(): void {
    if (this.habitForm.valid) {
      this.isCreating = true;
      const habitData: CreateHabitData = this.habitForm.value;

      this.habitService.createHabit(habitData).subscribe({
        next: () => {
          this.loadHabits();
          this.habitForm.reset({ color: '#3B82F6' });
          this.showCreateForm = false;
          this.isCreating = false;
        },
        error: (error) => {
          console.error('Error creating habit:', error);
          this.isCreating = false;
        }
      });
    }
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.habitForm.reset({ color: '#3B82F6' });
  }

  editHabit(habit: Habit): void {
    // TODO: Implement edit functionality
    console.log('Edit habit:', habit);
  }

  deleteHabit(habitId: string): void {
    if (confirm('Are you sure you want to delete this habit?')) {
      this.habitService.deleteHabit(habitId).subscribe({
        next: () => {
          this.loadHabits();
        },
        error: (error) => {
          console.error('Error deleting habit:', error);
        }
      });
    }
  }

  toggleHabitCompletion(habit: Habit): void {
    this.isCompleting = habit._id;
    const today = new Date().toISOString().slice(0, 10);
    
    if (this.isHabitCompletedToday(habit)) {
      // Uncomplete
      this.habitService.uncompleteHabit(habit._id, today).subscribe({
        next: () => {
          this.loadHabits();
          this.isCompleting = null;
        },
        error: (error) => {
          console.error('Error uncompleting habit:', error);
          this.isCompleting = null;
        }
      });
    } else {
      // Complete
      this.habitService.completeHabit(habit._id).subscribe({
        next: () => {
          this.loadHabits();
          this.isCompleting = null;
        },
        error: (error) => {
          console.error('Error completing habit:', error);
          this.isCompleting = null;
        }
      });
    }
  }

  isHabitCompletedToday(habit: Habit): boolean {
    const today = new Date().toISOString().slice(0, 10);
    return this.habitService.isHabitCompletedForDate(habit, today);
  }

  getStreakEmoji(streak: number): string {
    if (streak === 0) return '❄️';
    if (streak < 3) return '🔥';
    if (streak < 7) return '🔥🔥';
    if (streak < 14) return '🔥🔥🔥';
    if (streak < 30) return '🔥🔥🔥🔥';
    return '🔥🔥🔥🔥🔥';
  }
}
