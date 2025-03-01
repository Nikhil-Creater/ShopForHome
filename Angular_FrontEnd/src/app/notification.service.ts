import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Notification {
  notificationId: number;
  message: string;
  createdAt: string;
  isRead: boolean;
  productId: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'https://localhost:7246/api/Products/admin/notifications';

  constructor(private http: HttpClient) {}

  // Method to get authentication headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Ensure token is stored after login
    if (!token) {
      console.error("User is not authenticated!");
      throw new Error("User is not authenticated!");
    }
    
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Fetch unread notifications
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching notifications:', error);
        return throwError(() => new Error('Failed to fetch notifications'));
      })
    );
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/mark-read/${notificationId}`, {}, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error(`Error marking notification ${notificationId} as read:`, error);
        return throwError(() => new Error('Failed to mark notification as read'));
      })
    );
  }
}
