import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-product-delete',
  imports: [RouterLink],
  templateUrl: './product-delete.component.html',
  styleUrl: './product-delete.component.css'
})
export class ProductDeleteComponent {
  productId!: number;
  
    constructor(
      private route: ActivatedRoute,
      private productService: ProductService,
      private router: Router
    ) {
      this.productId = Number(this.route.snapshot.paramMap.get('id'));
    }
    

    deleteUser() {
      this.productService.deleteProduct(this.productId).subscribe((response) => {
        alert(response)
        this.router.navigate(['/Admin']);
      });
    }
}
