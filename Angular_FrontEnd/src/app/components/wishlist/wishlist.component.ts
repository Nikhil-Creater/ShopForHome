


import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService, WishlistItem } from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  wishlist: WishlistItem[] = [];
  wishlistCount: number = 0;
  loading = false;

  constructor(
    private wishlistService: WishlistService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
    this.subscribeToWishlistCount();
  }

  loadWishlist(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found. Cannot fetch wishlist.');
      return;
    }
  
    this.loading = true;
    this.wishlistService.getWishlist(Number(userId)).subscribe({
      next: (items) => {
        console.log('Fetched Wishlist Items:', items);
  
        if (Array.isArray(items) && items.length > 0) {
          this.wishlist = items.map((item) => ({
            wishlistId: item.wishlistId,
            product:{
              productId: item.product.productId,
              productName: item.product.productName || 'Unknown Product',
              price: item.product.price || 0,
              imageUrl: item.product.imageUrl || 'default-image.jpg',
              categoryName: item.product.categoryName || 'Uncategorized', // ✅ Added this line
            }
          }));
        } else {
          console.warn('Wishlist is empty or API response format is incorrect:', items);
          this.wishlist = [];
        }
  
        this.cdRef.detectChanges();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching wishlist:', error);
        this.wishlist = [];
        this.loading = false;
      },
    });
  }
  

  toggleWishlist(productId: number): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found. Cannot modify wishlist.');
      return;
    }

    const wishlistItem = this.wishlist.find((item) => item.product.productId === productId);

    if (wishlistItem) {
      this.removeFromWishlist(wishlistItem.wishlistId);
    } else {
      this.wishlistService.addToWishlist(productId, Number(userId)).subscribe({
        next: () => this.loadWishlist(),
        error: (error) => console.error('Error adding to wishlist:', error),
      });
    }
  }

  removeFromWishlist(wishlistId: number): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found. Cannot remove from wishlist.');
      return;
    }

    this.wishlistService.removeFromWishlist(wishlistId, Number(userId)).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter((item) => item.wishlistId !== wishlistId);
        this.wishlistService.refreshWishlistCount(Number(userId));
      },
      error: (error) => console.error('Error removing from wishlist:', error),
    });
  }

  clearWishlist(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found. Cannot clear wishlist.');
      return;
    }

    this.wishlistService.clearWishlist(Number(userId)).subscribe({
      next: () => {
        this.wishlist = [];
        this.wishlistService.updateWishlistCount(0);
      },
      error: (error) => console.error('Error clearing wishlist:', error),
    });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.some((item) => item.product.productId === productId);
  }

  subscribeToWishlistCount(): void {
    this.wishlistService.wishlistCount$.subscribe((count) => {
      console.log('Wishlist count updated:', count);
      this.wishlistCount = count;
    });
  }
}
