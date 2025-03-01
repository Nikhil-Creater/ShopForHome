import { Component } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports : [RouterLink, CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  products: any[] = [];
  selectedFile: File | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  // Fetch all products
  loadProducts(): void {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data;
    });
  }

  // Handle file selection
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  // Upload CSV file
  uploadCSV(): void {
    if (!this.selectedFile) {
      alert("Please select a CSV file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.productService.uploadProductsCSV(formData).subscribe(
      (response) => {
        alert("CSV uploaded successfully!");
        this.loadProducts(); // Refresh product list after upload
      },
      (error: HttpErrorResponse) => {
        alert("Error uploading CSV file: " + error.message);
      }
    );
  }

  // Navigate to update product page
  updateProduct(productId: number) {
    this.router.navigate([`/update-product`, productId]);
  }

  // Navigate to delete product page
  deleteProduct(productId: number) {
    this.router.navigate([`/delete-product`, productId]);
  }

  addProduct(): void {
    this.router.navigate([`/add-product`]);
  }
}