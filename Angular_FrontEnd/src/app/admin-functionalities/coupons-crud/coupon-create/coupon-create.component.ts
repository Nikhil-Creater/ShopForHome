import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CouponService } from '../../../services/coupon/coupon.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coupon-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],  // Required for form handling
  templateUrl: './coupon-create.component.html',
  styleUrl: './coupon-create.component.css'
})
export class CouponCreateComponent {
  myReactiveForm!: FormGroup;
  submitted: boolean = false;

  constructor(private couponService: CouponService, private router: Router) {}

  ngOnInit(): void {
    // ✅ Initialize the reactive form
    this.myReactiveForm = new FormGroup({
      discountPercentage: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(100)]),
      expiryDate: new FormControl(this.getTodayDate(), Validators.required), // Set default to today's date
      isActive: new FormControl(true)  // Default to true for active coupons
    });
  }

  // ✅ Get today's date in YYYY-MM-DD format for input[type="date"]
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // ✅ Handle form submission
  onSubmit(event: Event) {
    if ((event.target as HTMLElement).tagName !== 'FORM') {
      return; // Ensure the event is from the form
    }

    if (this.myReactiveForm.valid) {
      console.log("Creating Coupon:", this.myReactiveForm.value);

      this.couponService.createCoupons(this.myReactiveForm.value).subscribe({
        next: () => {
          alert("Coupon Created Successfully");
          this.router.navigate(['/Admin/coupons']);
        },
        error: (error) => {
          console.error("Error creating coupon:", error);
          alert("Error creating coupon.");
        }
      });

      this.submitted = true;
    }
  }
}
