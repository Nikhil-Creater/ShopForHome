import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7246/api';

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  jwtLogin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login/login`, data).pipe(
      tap((response: any) => {
        if (response.accessToken) {
          this.setSession(response.accessToken, response.roleId);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Users/Register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    localStorage.removeItem('userId');
    this.loggedIn.next(false);
    this.router.navigate(['/login']); // Redirect to login after logout
  }

  private setSession(token: string, roleId: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('roleId', roleId);
    this.loggedIn.next(true);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getUserId(): number {
    const token = this.getToken();
    if (!token) {
      console.error('🔴 No token found. User might not be logged in.');
      return 0;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      console.log('✅ Decoded Token:', decodedToken);
      return decodedToken?.nameid ? parseInt(decodedToken.nameid, 10) : 0;
    } catch (error) {
      console.error('🔴 Error decoding token:', error);
      return 0;
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded?.exp;
      if (!exp) return true;

      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch (error) {
      return true;
    }
  }
}
