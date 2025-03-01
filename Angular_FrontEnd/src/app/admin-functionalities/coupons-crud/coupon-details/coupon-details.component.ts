import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../../services/coupon/coupon.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-coupon-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './coupon-details.component.html',
  styleUrl: './coupon-details.component.css'
})
export class CouponDetailsComponent  implements OnInit{
coupons: any[] = [];

    constructor(private couponService: CouponService, private router: Router) {}

    ngOnInit() {
      this.loadcoupons();
    }

    // Fetch all users
    loadcoupons() :void {
      this.couponService.getCoupons().subscribe(data => {
        this.coupons = data;
      });
    }

    // Navigate to update user page
    assignCoupon(couponId: number) {
      this.router.navigate([`/coupons-assign`, couponId]);
    }

    // Navigate to deactivate user page
    deactivateCoupon(couponId: number) {
      this.router.navigate([`/coupons-deactivate`,couponId]);
    }

    // Navigate to delete user page
    deleteCoupon(couponId: number) {
      this.router.navigate([`/coupons-delete`,couponId]);
    }

    createCoupon():void{
      this.router.navigate([`/coupons-create`])
    }
}
