import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  cartIds: any[] = [];
  totalAmount: number = 0;

  constructor(private router: Router, private cartService: CartService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.loadCart();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
        next: (cartItems: any[]) => {  // Ensure cartItems is an array
            console.log("Checkout Cart Items API Response:", cartItems);

            this.cartItems = cartItems.map((item: any) => ({  // Fix: Explicit type for 'item'
                cartId: item.cartId,
                productId: item.productId,
                productName: item.productName,
                price: Number(item.price) || 0,  
                quantity: Number(item.productQuantity) || 1  // Correct mapping
            }));

            console.log("Checkout Cart Items After Mapping:", this.cartItems);
            this.calculateTotal();
        },
        error: (err) => {
            console.error("Error fetching cart items:", err);
        }
    });
}

  loadCart(): void {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        console.log("Checkout Cart Items:", items);
        this.cartItems = items;
      },
      error: (err) => {
        console.error("Error fetching cart items:", err);
      }
    });
  }

  calculateTotal(): void {
    console.log("Calculating Total...");
    this.totalAmount = this.cartItems.reduce((total, item) => {
        console.log(`Item: ${item.productName}, Price: ${item.price}, Quantity: ${item.quantity}`);
        return total + (item.price * item.quantity);
    }, 0);

    console.log("Total Amount Calculated:", this.totalAmount);
}





  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => 
        total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0
    );
}

getIds(){
  this.cartItems.forEach(element => {
    this.cartIds.push(element.cartId);
  });
}


placeOrder(): void {
  if (this.cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  this.getIds();
  this.cartService.placeOrder(this.cartIds).subscribe({
    next: (response) => {
      alert("Order Placed Successfully, Redirecting to Confirmation Page...");
      console.log("Order placed successfully:", response);
      
      // ✅ Clear cart and update UI
      this.cartService.clearCart().subscribe({
        next: () => {
          alert("Cart cleared successfully!");
          this.cartItems = []; // ✅ Clear cart items locally
          this.totalAmount = 0; // ✅ Reset total amount
          this.router.navigate(['/order']); // ✅ Redirect to confirmation page
        },
        error: (err) => {
          alert("Error clearing cart");
        }
      });
    },
    error: (err: any) => {
      alert("Error placing order");
    }
  });
}
}