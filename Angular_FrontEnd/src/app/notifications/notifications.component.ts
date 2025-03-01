import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../notification.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product/product.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-notifications',
  imports:[CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'] // Corrected 'styleUrl' to 'styleUrls'
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  errorMessage: string | null = null;
  stockQuantity: { [productId: number]: number } = {};

  constructor(private notificationService: NotificationService, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
      },
      error: (error) => {
        console.error("Error fetching notifications:", error);
        this.errorMessage = "Failed to load notifications. Please log in again.";
      }
    });
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markNotificationAsRead(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.notificationId !== notificationId);
      },
      error: (error) => {
        console.error(`Error marking notification ${notificationId} as read:`, error);
        this.errorMessage = "Failed to mark notification as read.";
      }
    });
  }

  updateStock(productId: number): void {
    if (!this.stockQuantity) {
      alert("Please enter a stock quantity.");
      return;
    }
    this.productService.updateStock(productId, this.stockQuantity[productId]).subscribe({
      next: () => {
        alert(`Stock updated successfully for product ID ${productId}`);
      },
      error: (error) => {
        console.error(`Error updating stock for product ${productId}:`, error);
        alert("Failed to update stock quantity.");
      }
    });
  }
}
