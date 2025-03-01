import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-create',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export class ProductCreateComponent {

  myReactiveForm!: FormGroup;
  submitted: boolean = false;

  categories: any[] = []; // Stores fetched categories

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    // ✅ Fetch categories from API for dropdown
    this.productService.getCategories().subscribe((result) => {
      this.categories = result;
      console.log("Fetched Categories:", this.categories);
    });

    // ✅ Initialize the reactive form
    this.myReactiveForm = new FormGroup({
      productName: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl(0, Validators.required),
      stockQuantity: new FormControl(0, Validators.required),
      rating: new FormControl(0, Validators.required),
      imageUrl: new FormControl('', Validators.required),
      categoryId: new FormControl(null, Validators.required),  // Stores selected Category ID
      categoryName: new FormControl('', Validators.required)   // Stores selected Category Name
    });
  }

  // ✅ Handle category selection from dropdown
  onCategorySelect(event: any) {
    const selectedCategory = this.categories.find(cat => cat.categoryId == event.target.value);
    if (selectedCategory) {
      this.myReactiveForm.patchValue({
        categoryId: selectedCategory.categoryId,
        categoryName: selectedCategory.categoryName
      });
    }
  }

  // ✅ Handle form submission
  onSubmit(event: Event) {
    if ((event.target as HTMLElement).tagName !== 'FORM') {
      return; // Ensure the event is from the form
    }

    if (this.myReactiveForm.valid) {
      console.log("Adding Product:", this.myReactiveForm.value);

      this.productService.createProduct(this.myReactiveForm.value).subscribe({
        next: () => {
          alert("Product Added Successfully");
          this.router.navigate(['/Admin']);
        },
        error: (error) => {
          console.error("Error adding product:", error);
          alert("Error adding product.");
        }
      });

      this.submitted = true;
    }
  }
}
