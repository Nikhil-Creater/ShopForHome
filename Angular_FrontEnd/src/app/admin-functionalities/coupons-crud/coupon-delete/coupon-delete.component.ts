import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CouponService } from '../../../services/coupon/coupon.service';

@Component({
  selector: 'app-coupon-delete',
  imports: [RouterLink],
  templateUrl: './coupon-delete.component.html',
  styleUrl: './coupon-delete.component.css'
})
export class CouponDeleteComponent {
  productId!: number;

      constructor(
        private route: ActivatedRoute,
        private productService: CouponService,
        private router: Router
      ) {
        this.productId = Number(this.route.snapshot.paramMap.get('id'));
      }


      deleteUser() {
        this.productService.deleteCoupon(this.productId).subscribe((response) => {
          alert(response)
          this.router.navigate(['/Admin/coupons']);
        });
      }
}
