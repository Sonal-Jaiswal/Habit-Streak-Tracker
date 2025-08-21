import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HabitService {
  private apiUrl = 'http://localhost:3000/habits';

  constructor(private http: HttpClient) {}

  getHabits(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addHabit(name: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { name });
  }

  markComplete(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/complete`, {});
  }
}
