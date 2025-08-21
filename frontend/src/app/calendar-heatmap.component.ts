import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-calendar-heatmap',
  template: `
    <div class="heatmap">
      <div *ngFor="let day of days"
           class="heatmap-day"
           [style.background]="dates.includes(day) ? '#4caf50' : '#e0e0e0'">
      </div>
    </div>
  `
})
export class CalendarHeatmapComponent {
  @Input() dates: string[] = [];
  days: string[] = [];

  constructor() {
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      this.days.unshift(d.toISOString().slice(0, 10));
    }
  }
}
