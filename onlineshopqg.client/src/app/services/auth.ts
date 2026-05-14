import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7281/api/auth';

  private currentUserSubject = new BehaviorSubject<any | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  private getUserFromStorage(): any {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    return id ? { id: Number(id), name: name } : null;
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('userName', response.name);
        localStorage.setItem('jwt_token', response.token);
        localStorage.setItem('userId', response.userId.toString());

        this.currentUserSubject.next({
          id: response.userId,
          name: response.name
        });
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  updateUserProfile(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${user.id}`, user);
  }
}
