import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  loading: boolean = false;

  constructor(private cartService: CartService, private snackBar: MatSnackBar, private router:Router) {}

  ngOnInit(): void {
    console.log("Cart Component Loaded!");
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCartItems().subscribe({
        next: (data) => {
            console.log("Cart Items from API:", data); // Debugging log

            if (Array.isArray(data) && data.length > 0) {
                this.cartItems = data.map(item => ({
                    CartId: item.cartId || item.CartId,  // Case handling
                    ProductId: item.productId || item.ProductId,
                    ProductName: item.productName || item.ProductName || "Unknown Product",
                    ProductQuantity: item.productQuantity || item.ProductQuantity || 1,
                    Price: item.price || item.Price || 0,
                    TotalAmount: item.totalAmount || item.TotalAmount || (item.price * item.productQuantity)
                }));
            } else {
                console.warn("Cart is empty or API response format is incorrect:", data);
                this.cartItems = []; // Ensure empty array if no data
            }

            this.loading = false;
        },
        error: (err) => {
            console.error("Error loading cart:", err);
            this.cartItems = [];
            this.loading = false;
        }
    });
}



  increaseQuantity(cartId: number): void {
    this.cartService.increaseQuantity(cartId).subscribe(() => {
      this.loadCart();
      this.showMessage('Quantity increased.');
    });
  }

  decreaseQuantity(cartId: number): void {
    this.cartService.decreaseQuantity(cartId).subscribe(() => {
      this.loadCart();
      this.showMessage('Quantity decreased.');
    });
  }

  removeFromCart(cartId: number): void {
    this.cartService.removeFromCart(cartId).subscribe(() => {
      this.loadCart();
      this.showMessage('Item removed from cart.');
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.loadCart();
      this.showMessage('Cart cleared.');
    });
  }

  showMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}