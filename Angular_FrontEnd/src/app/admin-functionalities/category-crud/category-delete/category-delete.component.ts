import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-category-delete',
  imports: [RouterLink],
  templateUrl: './category-delete.component.html',
  styleUrl: './category-delete.component.css'
})
export class CategoryDeleteComponent {
  productId!: number;

      constructor(
        private route: ActivatedRoute,
        private categoryService: CategoryService,
        private router: Router
      ) {
        this.productId = Number(this.route.snapshot.paramMap.get('id'));
      }


      deleteUser() {
        this.categoryService.deleteCategory(this.productId).subscribe((response) => {
          alert(response)
          this.router.navigate(['/Admin']);
        });
      }
}
