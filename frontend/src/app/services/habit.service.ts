import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Habit {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  category?: string;
  color: string;
  createdAt: string;
  isActive: boolean;
  dates: Array<{
    date: string;
    completed: boolean;
    streak: number;
  }>;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  totalDays: number;
  completionRate: number;
}

export interface CreateHabitData {
  name: string;
  description?: string;
  category?: string;
  color?: string;
}

export interface UpdateHabitData {
  name?: string;
  description?: string;
  category?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(`${this.API_URL}/habits`, {
      headers: this.getHeaders()
    });
  }

  getHabit(id: string): Observable<Habit> {
    return this.http.get<Habit>(`${this.API_URL}/habits/${id}`, {
      headers: this.getHeaders()
    });
  }

  createHabit(habitData: CreateHabitData): Observable<Habit> {
    return this.http.post<Habit>(`${this.API_URL}/habits`, habitData, {
      headers: this.getHeaders()
    });
  }

  updateHabit(id: string, habitData: UpdateHabitData): Observable<Habit> {
    return this.http.put<Habit>(`${this.API_URL}/habits/${id}`, habitData, {
      headers: this.getHeaders()
    });
  }

  deleteHabit(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/habits/${id}`, {
      headers: this.getHeaders()
    });
  }

  completeHabit(id: string, date?: string, notes?: string): Observable<Habit> {
    const payload: any = {};
    if (date) payload.date = date;
    if (notes) payload.notes = notes;

    return this.http.post<Habit>(`${this.API_URL}/habits/${id}/complete`, payload, {
      headers: this.getHeaders()
    });
  }

  uncompleteHabit(id: string, date: string): Observable<Habit> {
    return this.http.delete<Habit>(`${this.API_URL}/habits/${id}/complete/${date}`, {
      headers: this.getHeaders()
    });
  }

  getHabitStats(id: string): Observable<HabitStats> {
    return this.http.get<HabitStats>(`${this.API_URL}/habits/${id}/stats`, {
      headers: this.getHeaders()
    });
  }

  isHabitCompletedForDate(habit: Habit, date: string): boolean {
    return habit.dates.some(d => d.date === date && d.completed);
  }

  getHabitCompletionDates(habit: Habit): string[] {
    return habit.dates
      .filter(d => d.completed)
      .map(d => d.date)
      .sort();
  }

  getHabitStreak(habit: Habit): number {
    return habit.currentStreak;
  }

  getHabitLongestStreak(habit: Habit): number {
    return habit.longestStreak;
  }
}
