import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category/category.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-details',
  imports: [CommonModule , RouterLink],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css'
})
export class CategoryDetailsComponent implements OnInit {
  categories: any[] = [];

      constructor(private CategoryService: CategoryService, private router: Router) {}

      ngOnInit() {
        this.loadCategorys();
      }

      // Fetch all users
      loadCategorys() :void {
        this.CategoryService.getCategories().subscribe(data => {
          this.categories = data;
        });
      }

      // Navigate to delete user page
      deleteCategory(CategoryId: number) {
        this.router.navigate([`/delete-category`,CategoryId]);
      }

      addCategory():void{
        this.router.navigate([`/add-category`])
      }
}