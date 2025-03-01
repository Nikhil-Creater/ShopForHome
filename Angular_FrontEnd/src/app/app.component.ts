import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { WishlistService } from './services/wishlist.service';
import { NotificationService } from './notification.service';
import { AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewChecked {
  cartCount: number = 0;
  wishlistCount: number = 0;
  notificationCount: number = 0;
  title = 'ShopForHome';

  isAdmin = false;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private notificationService: NotificationService
  ) { }
  
  ngAfterViewChecked(): void {
    // this.checkUserRole();
    // this.authService.isLoggedIn$.subscribe(status => {
    //   this.isLoggedIn = status;
    //   this.checkUserRole();

    //   if (status) {
    //     const userId = this.authService.getUserId();
        
    //     this.cartService.cartCount$.subscribe(count => {
    //       this.cartCount = count;
    //     });

    //     this.wishlistService.wishlistCount$.subscribe(count => {
    //       this.wishlistCount = count;
    //     });

    //     this.wishlistService.refreshWishlistCount(userId);

    //     // Fetch notification count
    //     this.fetchNotificationCount();
    //   }
    // });
  }

  ngOnInit(): void {
    this.checkUserRole();
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.checkUserRole();

      if (status) {
        const userId = this.authService.getUserId();
        
        this.cartService.cartCount$.subscribe(count => {
          this.cartCount = count;
        });

        this.wishlistService.wishlistCount$.subscribe(count => {
          this.wishlistCount = count;
        });

        this.wishlistService.refreshWishlistCount(userId);

        // Fetch notification count
        this.fetchNotificationCount();
      }
    });
  }

  fetchNotificationCount(): void {
    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        this.notificationCount = notifications.filter(n => !n.isRead).length;
      },
      error: (error) => {
        console.error("Error fetching notifications:", error);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.isAdmin = false;
    this.isLoggedIn = false;
    this.notificationCount = 0;
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  navigateToWishlist(): void {
    this.router.navigate(['/wishlist']);
  }

  navigateToNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  checkUserRole(): void {
    const roleId = localStorage.getItem('roleId');
    this.isAdmin = roleId === '1';
  }
}