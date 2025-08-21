import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitService, Habit } from '../../services/habit.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <div class="card card-glass">
            <div class="card-header bg-transparent border-0">
              <h3 class="fw-bold mb-0">
                <i class="bi bi-calendar3 me-2"></i>
                Habit Calendar Heatmap
              </h3>
              <p class="text-muted mb-0 mt-2">
                Track your daily progress with this GitHub-style contribution graph
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card card-glass">
            <div class="card-body">
              <!-- Calendar Legend -->
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="d-flex align-items-center">
                  <span class="text-muted me-3">Less</span>
                  <div class="d-flex">
                    <div class="calendar-day bg-light" style="background-color: #ebedf0 !important;"></div>
                    <div class="calendar-day" style="background-color: #9be9a8;"></div>
                    <div class="calendar-day" style="background-color: #40c463;"></div>
                    <div class="calendar-day" style="background-color: #30a14e;"></div>
                    <div class="calendar-day" style="background-color: #216e39;"></div>
                  </div>
                  <span class="text-muted ms-3">More</span>
                </div>
                <div class="text-muted">
                  {{ getTotalCompletions() }} completions in the last year
                </div>
              </div>

              <!-- Calendar Grid -->
              <div class="calendar-container">
                <div class="calendar-grid">
                  <!-- Month labels -->
                  <div class="month-labels">
                    <div *ngFor="let month of monthLabels" class="month-label">
                      {{ month }}
                    </div>
                  </div>
                  
                  <!-- Days grid -->
                  <div class="days-grid">
                    <div *ngFor="let week of calendarWeeks" class="week-row">
                      <div 
                        *ngFor="let day of week" 
                        class="calendar-day"
                        [class]="getDayClass(day)"
                        [style.background-color]="getDayColor(day)"
                        [title]="getDayTooltip(day)"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Habit Legend -->
              <div class="mt-4">
                <h6 class="fw-bold mb-3">Habit Colors</h6>
                <div class="d-flex flex-wrap gap-3">
                  <div 
                    *ngFor="let habit of habits" 
                    class="d-flex align-items-center"
                  >
                    <div 
                      class="rounded-circle me-2" 
                      [style.background-color]="habit.color"
                      style="width: 16px; height: 16px;"
                    ></div>
                    <span class="text-muted">{{ habit.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      overflow-x: auto;
    }
    
    .calendar-grid {
      display: flex;
      align-items: flex-start;
    }
    
    .month-labels {
      display: flex;
      flex-direction: column;
      margin-right: 8px;
      margin-top: 20px;
    }
    
    .month-label {
      height: 20px;
      font-size: 12px;
      color: #666;
      display: flex;
      align-items: center;
      padding: 0 4px;
    }
    
    .days-grid {
      display: flex;
      flex-direction: column;
    }
    
    .week-row {
      display: flex;
      margin-bottom: 2px;
    }
    
    .calendar-day {
      width: 20px;
      height: 20px;
      margin: 1px;
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }
    
    .calendar-day:hover {
      transform: scale(1.2);
      z-index: 10;
      border-color: #333;
    }
    
    .calendar-day.completed {
      border-color: #333;
    }
    
    .calendar-day.today {
      border: 2px solid #f59e0b;
    }
    
    @media (max-width: 768px) {
      .calendar-day {
        width: 16px;
        height: 16px;
        margin: 1px;
      }
      
      .month-label {
        font-size: 10px;
        height: 16px;
      }
    }
  `]
})
export class CalendarComponent implements OnInit {
  habits: Habit[] = [];
  calendarWeeks: Date[][] = [];
  monthLabels: string[] = [];
  completionData: Map<string, number> = new Map();

  constructor(private habitService: HabitService) {}

  ngOnInit(): void {
    this.loadHabits();
    this.generateCalendar();
  }

  loadHabits(): void {
    this.habitService.getHabits().subscribe({
      next: (habits) => {
        this.habits = habits;
        this.processCompletionData();
      },
      error: (error) => {
        console.error('Error loading habits:', error);
      }
    });
  }

  processCompletionData(): void {
    this.completionData.clear();
    
    this.habits.forEach(habit => {
      habit.dates.forEach(dateEntry => {
        if (dateEntry.completed) {
          const date = dateEntry.date;
          const currentCount = this.completionData.get(date) || 0;
          this.completionData.set(date, currentCount + 1);
        }
      });
    });
  }

  generateCalendar(): void {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    // Generate month labels
    this.monthLabels = [];
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(oneYearAgo.getFullYear(), oneYearAgo.getMonth() + i, 1);
      this.monthLabels.push(monthDate.toLocaleDateString('en-US', { month: 'short' }));
    }
    
    // Generate calendar weeks
    this.calendarWeeks = [];
    const currentDate = new Date(oneYearAgo);
    
    // Adjust to start of week (Sunday)
    while (currentDate.getDay() !== 0) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 7); // Add a week to ensure we get complete weeks
    
    while (currentDate <= endDate) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      this.calendarWeeks.push(week);
    }
  }

  getDayClass(day: Date): string {
    const today = new Date();
    const isToday = day.toDateString() === today.toDateString();
    
    if (isToday) {
      return 'today';
    }
    
    const dateString = day.toISOString().slice(0, 10);
    if (this.completionData.has(dateString)) {
      return 'completed';
    }
    
    return '';
  }

  getDayColor(day: Date): string {
    const dateString = day.toISOString().slice(0, 10);
    const completions = this.completionData.get(dateString) || 0;
    
    if (completions === 0) return '#ebedf0';
    if (completions === 1) return '#9be9a8';
    if (completions === 2) return '#40c463';
    if (completions === 3) return '#30a14e';
    return '#216e39';
  }

  getDayTooltip(day: Date): string {
    const dateString = day.toISOString().slice(0, 10);
    const completions = this.completionData.get(dateString) || 0;
    const dateFormatted = day.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (completions === 0) {
      return `${dateFormatted}: No habits completed`;
    } else if (completions === 1) {
      return `${dateFormatted}: 1 habit completed`;
    } else {
      return `${dateFormatted}: ${completions} habits completed`;
    }
  }

  getTotalCompletions(): number {
    let total = 0;
    this.completionData.forEach(count => {
      total += count;
    });
    return total;
  }
}
