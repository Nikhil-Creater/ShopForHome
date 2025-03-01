import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

export interface WishlistItem {
  wishlistId:number;
  product:{
    productId: number;
    productName: string;
    imageUrl: string;
    price: number;
    categoryName:string;
  }
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistCountSubject = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCountSubject.asObservable();

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Auth Token:', token);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,  // Fixed string interpolation
    });
  }

  addToWishlist(productId: number, userId: number): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/Wishlist/AddToWishlist`,  // Fixed string interpolation
        { productId, userId },
        { headers: this.getHeaders() }
      )
      .pipe(
        tap(() => this.refreshWishlistCount(userId))
      );
  }

  getWishlist(userId: number): Observable<WishlistItem[]> {
    return this.http
      .get<WishlistItem[]>(`${this.apiUrl}/Wishlist/GetWishlist?userId=${userId}`, { // Fixed missing userId parameter
        headers: this.getHeaders(),
      })
      .pipe(
        tap((wishlist) => this.updateWishlistCount(wishlist.length))
      );
  }

  removeFromWishlist(productId: number, userId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/Wishlist/RemoveFromWishlist/${productId}`, { // Fixed endpoint
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => this.refreshWishlistCount(userId))
      );
  }

  clearWishlist(userId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/Wishlist/ClearWishlist?userId=${userId}`, { // Ensured userId is passed
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => {
          this.updateWishlistCount(0);
        })
      );
  }

  updateWishlistCount(count: number) {
    this.wishlistCountSubject.next(count);
  }

  refreshWishlistCount(userId: number) {
    if (!userId || userId === 0) {
      console.error(
        '🔴 Skipping wishlist count update due to invalid userId:',
        userId
      );
      return;
    }

    this.getWishlist(userId).subscribe({
      next: (wishlist: WishlistItem[]) => {
        this.updateWishlistCount(wishlist.length);
        console.log('✅ Wishlist count updated:', wishlist.length);
      },
      error: (err) => console.error('🔴 Error fetching wishlist count:', err),
    });
  }
}