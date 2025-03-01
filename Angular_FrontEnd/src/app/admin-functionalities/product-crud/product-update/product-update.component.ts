import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-product-update',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-update.component.html',
  styleUrl: './product-update.component.css'
})
export class ProductUpdateComponent {
   submitted: boolean = false;
    myReactiveForm!: FormGroup;
    productId!: number;
    productData: any = {};

    constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private productService: ProductService,
      private router: Router
    ) {}

    ngOnInit(): void {
      this.submitted = false;

      // ✅ Get userId from URL parameters
      this.productId = Number(this.route.snapshot.paramMap.get('id'));

      // ✅ Initialize the form
      this.myReactiveForm = this.formBuilder.group({
        productId:[this.productId],
        productName: ['', Validators.required],
        description: ['', [Validators.required]],
        price: [0, Validators.required],
        stockQuantity: [0, Validators.required],
        imageUrl: ['', Validators.required],
      });

      // ✅ Fetch user details and patch form values
      this.productService.getProductById(this.productId).subscribe(data => {
        this.productData = data;

        this.myReactiveForm.patchValue({
          productId:this.productData.productId,
          productName: this.productData.productName,
          description: this.productData.description,
          price: this.productData.price,
          stockQuantity: this.productData.stockQuantity,
          imageUrl: this.productData.imageUrl
        });
      });
    }

    onSubmit(event:Event):void{
      if ((event.target as HTMLElement).tagName !== 'FORM') {
        return; // Only proceed if the event comes from the form
      }
      console.log("Request Body:", this.myReactiveForm.value);
      this.productService.updateProduct(this.productId, this.myReactiveForm.value).subscribe({
        next: () => {
          alert("Edited successfully");
          this.router.navigate(["/Admin"]); // ✅ Fixed navigation path
        },
        error: (error) => {
          console.error("Update error:", error);
          alert("Error updating user.");
        }
      });
    }
}
