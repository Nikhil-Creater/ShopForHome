import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CouponService } from '../../../services/coupon/coupon.service';

@Component({
  selector: 'app-coupon-deactivate',
  imports: [RouterLink],
  templateUrl: './coupon-deactivate.component.html',
  styleUrl: './coupon-deactivate.component.css'
})
export class CouponDeactivateComponent {
  couponId!: number;
  isActive!: boolean;

  constructor(
    private route: ActivatedRoute,
    private couponService: CouponService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Get the coupon ID from URL
    this.couponId = Number(this.route.snapshot.paramMap.get('id'));

    // ✅ Fetch coupon details to get the current isActive status
    this.couponService.getCouponByCouponId(this.couponId).subscribe({
      next: (data) => {
        this.isActive = data.isActive; // ✅ Get current status
      },
      error: (error) => {
        console.error("Error fetching coupon:", error);
        alert("Error fetching coupon details.");
      }
    });
  }

  deactivateCoupon(): void {
    if (this.isActive) {
      this.isActive = false; // ✅ Set to false for deactivation

      this.couponService.deactivateCoupon(this.couponId, this.isActive).subscribe({
        next: () => {
          alert("Coupon deactivated successfully.");
          this.router.navigate(['/Admin/coupons']);
        },
        error: (error) => {
          console.error("Error deactivating coupon:", error);
          alert("Error deactivating coupon.");
        }
      });
    } else {
      alert("Coupon is already deactivated.");
    }
  }
}
