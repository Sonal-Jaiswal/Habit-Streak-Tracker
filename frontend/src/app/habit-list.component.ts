import { Component, OnInit } from '@angular/core';
import { HabitService } from './habit.service';

@Component({
  selector: 'app-habit-list',
  templateUrl: './habit-list.component.html',
  styleUrls: ['./habit-list.component.css']
})
export class HabitListComponent implements OnInit {
  habits: any[] = [];
  newHabit = '';

  constructor(private habitService: HabitService) {}

  ngOnInit() {
    this.loadHabits();
  }

  loadHabits() {
    this.habitService.getHabits().subscribe(data => this.habits = data);
  }

  addHabit() {
    if (!this.newHabit.trim()) return;
    this.habitService.addHabit(this.newHabit).subscribe(() => {
      this.newHabit = '';
      this.loadHabits();
    });
  }

  markComplete(habit: any) {
    this.habitService.markComplete(habit._id).subscribe(() => this.loadHabits());
  }

  getStreak(dates: string[]): number {
    // Simple streak calculation
    let streak = 0;
    let today = new Date();
    for (let i = 0; i < dates.length; i++) {
      let date = new Date(dates[i]);
      if ((today.getTime() - date.getTime()) / (1000 * 3600 * 24) === streak) {
        streak++;
      }
    }
    return streak;
  }
}
