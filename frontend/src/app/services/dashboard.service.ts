import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface DashboardData {
  user: {
    level: number;
    experience: number;
    totalStreaks: number;
  };
  habits: number;
  activeStreaks: number;
  totalStreaks: number;
  todayCompletions: number;
  recentHabits: Array<{
    _id: string;
    name: string;
    currentStreak: number;
    color: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
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

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.API_URL}/dashboard`, {
      headers: this.getHeaders()
    });
  }

  calculateExperienceProgress(experience: number): { current: number; next: number; percentage: number } {
    const currentLevel = Math.floor(experience / 100) + 1;
    const currentLevelExp = (currentLevel - 1) * 100;
    const nextLevelExp = currentLevel * 100;
    const currentExp = experience - currentLevelExp;
    const expNeeded = nextLevelExp - currentLevelExp;
    const percentage = (currentExp / expNeeded) * 100;

    return {
      current: currentExp,
      next: expNeeded,
      percentage: Math.min(percentage, 100)
    };
  }

  getLevelTitle(level: number): string {
    if (level < 5) return 'Beginner';
    if (level < 10) return 'Apprentice';
    if (level < 20) return 'Practitioner';
    if (level < 30) return 'Expert';
    if (level < 50) return 'Master';
    return 'Legend';
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
