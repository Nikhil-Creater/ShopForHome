import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WishlistService, WishlistItem } from '../../services/wishlist.service'; // ✅ Import WishlistItem
import { AuthService } from '../../services/auth.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule,SearchComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  wishlistItems: number[] = [];
  categories: string[] = ['Furniture', 'Home Decor', 'Lighting'];
  selectedCategory: string = '';
  minPrice: number = 0;
  maxPrice: number = 10000;
  minRating: number = 0;
  loading: boolean = false; // Loading state

  constructor(
    private productService: ProductService, 
    private cartService: CartService, 
    private wishlistService: WishlistService, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadWishlist();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...this.products];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((p) => 
      (!this.selectedCategory || p.categoryId.toString() === this.selectedCategory) &&
      (p.price >= this.minPrice && p.price <= this.maxPrice) &&
      (p.rating >= this.minRating)
    );
  }

  addToCart(productId: number, quantity: number = 1) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('⚠️ Please log in to add items to your cart.');
      return;
    }
  
    // Disable button temporarily to prevent multiple clicks
    const button = document.querySelector(`button[data-product-id="${productId}"]`);
    if (button) {
      button.setAttribute('disabled', 'true');
    }
  
    this.cartService.addToCart(productId, quantity).subscribe({
      next: () => {
        this.showToast('✅ Product added to cart!');
        this.cartService.updateCartCount(); // Update the cart count after adding
      },
      error: (err) => {
        if (err.status === 401) {
          this.showToast('❌ Unauthorized! Please log in again.');
        } else {
          this.showToast('❌ Failed to add product.');
        }
      },
      complete: () => {
        // Re-enable button after the request completes
        if (button) {
          button.removeAttribute('disabled');
        }
      }
    });
  }  

  showToast(message: string) {
    // Temporary toast message (alternative to mat-snackbar)
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#333; color:#fff; padding:10px 20px; border-radius:5px; font-size:14px; z-index:1000;';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  }

  loadWishlist(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }
  
    this.wishlistService.getWishlist(Number(userId)).subscribe({
      next: (items: WishlistItem[]) => {
        this.wishlistItems = items.map(item => item.product.productId);
      },
      error: () => {
        this.wishlistItems = [];
      }
    });
  }
  

  toggleWishlist(productId: number): void {
    const userId = localStorage.getItem('userId');

    
    if (!userId) {
      alert('⚠️ Please log in to use the wishlist.');
      return;
    }
  
    if (this.isInWishlist(productId)) {
      this.wishlistService.removeFromWishlist(productId, Number(userId)).subscribe({
        next: () => {
          this.wishlistItems = this.wishlistItems.filter(id => id !== productId);
          this.wishlistService.refreshWishlistCount(Number(userId)); // ✅ Update count
          this.showToast('❌ Removed from Wishlist.');
        },
        error: () => {
          this.showToast('❌ Failed to remove from Wishlist.');
        }
      });
    } else {
      this.wishlistService.addToWishlist(productId, Number(userId)).subscribe({
        next: () => {
          this.wishlistItems.push(productId);
          this.wishlistService.refreshWishlistCount(Number(userId)); // ✅ Update count
          this.showToast('❤️ Added to Wishlist!');
        },
        error: () => {
          this.showToast('❌ Failed to add to Wishlist.');
        }
      });
    }
  } 
   

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.includes(productId);
  }
}