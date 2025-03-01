import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CouponService } from '../../../services/coupon/coupon.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coupon-assign',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './coupon-assign.component.html',
  styleUrl: './coupon-assign.component.css'
})
export class CouponAssignComponent {
  submitted: boolean = false;
  assignCouponForm!: FormGroup;
  couponId!: number;
  couponData: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private couponService: CouponService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.submitted = false;

    // ✅ Get couponId from URL parameters
    this.couponId = Number(this.route.snapshot.paramMap.get('id'));

    // ✅ Initialize the form
    this.assignCouponForm = this.formBuilder.group({
      couponId: [this.couponId], // Pre-filled Coupon ID
      userId: ['', Validators.required], // User ID input field
    });

    // ✅ Fetch coupon details and patch form values
    this.couponService.getCouponByCouponId(this.couponId).subscribe(data => {
      this.couponData = data;

      this.assignCouponForm.patchValue({
        couponId: this.couponData.couponId, // Ensure Coupon ID is set
      });
    });
  }

  onSubmit(): void {
    console.log("Assign Request:", this.assignCouponForm.value);

    const userId = this.assignCouponForm.value.userId; // Correctly retrieve userId

    this.couponService.assignCouponByUserId(this.couponId, userId).subscribe({
      next: () => {
        alert("Coupon assigned successfully");
        this.router.navigate(["/Admin/coupons"]); // ✅ Redirect after assignment
      },
      error: (error) => {
        console.error("Assignment error:", error);
        alert("Error assigning coupon.");
      }
    });
  }
}
