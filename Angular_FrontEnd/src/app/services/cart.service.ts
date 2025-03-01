import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://localhost:7246/api/cart';
  private orderApiUrl = 'https://localhost:7246/api/Order/placeOrder';
  
  private cartCount = new BehaviorSubject<number>(0); // Store cart item count
  cartCount$ = this.cartCount.asObservable(); // Observable to track changes
  private cartItems: any[] = []; // Local storage cart items cache
  private cartSubject = new BehaviorSubject<any[]>([]); // BehaviorSubject for cart updates

  constructor(private http: HttpClient) {
    this.loadCartFromStorage(); // Load cart from local storage on service initialization
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log("Auth Token:", token); // Debugging log
    return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });
  }

  // Load cart from Local Storage (used for offline persistence)
  private loadCartFromStorage(): void {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  // Fetch cart items from API and update count
  getCartItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetCartItems`, { headers: this.getHeaders() }).pipe(
        tap((cartItems: any) => {
            console.log("Cart API Full Response:", cartItems); // Debugging log
            if (!Array.isArray(cartItems)) {
                console.error("Unexpected cart response format:", cartItems);
                cartItems = [];
            }
            this.cartCount.next(cartItems.length);
        })
    );
}


  // Retrieve cart items as an observable
  getCartItemsObservable(): Observable<any[]> {
    return this.cartSubject.asObservable();
  }

  // Add an item to the cart (API call)
  addToCart(productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddToCart`, { productId, productQuantity: quantity }, { headers: this.getHeaders() })
      .pipe(tap(() => this.updateCartCount())); // Refresh cart count
  }

  // Increase quantity of a cart item
  increaseQuantity(cartId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/increaseQuantity/${cartId}`, {}, { headers: this.getHeaders() })
      .pipe(tap(() => this.updateCartCount()));
  }

  // Decrease quantity of a cart item
  decreaseQuantity(cartId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/decreaseQuantity/${cartId}`, {}, { headers: this.getHeaders() })
      .pipe(tap(() => this.updateCartCount()));
  }

  // Remove a single item from the cart
  removeFromCart(cartId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/RemoveFromCart/${cartId}`, { headers: this.getHeaders() })
      .pipe(tap(() => this.updateCartCount()));
  }

  // Clear the cart (both API and local storage)
  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ClearCart`, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          this.cartCount.next(0); // Reset count
          this.cartItems = []; // Clear local cart items
          localStorage.removeItem('cartItems'); // Remove cart data from local storage
          this.cartSubject.next([]); // Update BehaviorSubject
        })
      );
  }

  // Save updated cart to local storage
  private updateCartStorage(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  // Refresh cart count and fetch latest items from API
  updateCartCount(): void {
    this.getCartItems().subscribe({
      next: (cartItems) => {
        this.cartCount.next(cartItems.length);
        this.cartSubject.next(cartItems); // Update observable
      },
      error: () => {
        this.cartCount.next(0); // Reset if there's an error
        this.cartSubject.next([]); // Reset observable
      }
    });
  }

   // Place Order and Clear Cart after Success 
   placeOrder(cartItems: any[]): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.post(`${this.orderApiUrl}/${Number(userId)}` ,cartItems, { headers: this.getHeaders() })
  }
}