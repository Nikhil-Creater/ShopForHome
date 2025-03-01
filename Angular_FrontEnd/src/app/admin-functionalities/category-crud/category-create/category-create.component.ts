import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category/category.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-create',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css'
})
export class CategoryCreateComponent {
  myReactiveForm!: FormGroup;
  submitted: boolean = false;

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    // ✅ Initialize Reactive Form
    this.myReactiveForm = new FormGroup({
      categoryName: new FormControl('', Validators.required)
    });
  }

  // ✅ Handle Form Submission
  onSubmit(event: Event) {
    if ((event.target as HTMLElement).tagName !== 'FORM') {
      return; // Ensure the event is from the form
    }

    if (this.myReactiveForm.valid) {
      console.log("Adding Category:", this.myReactiveForm.value);

      this.categoryService.createCategory(this.myReactiveForm.value).subscribe({
        next: () => {
          alert("Category Added Successfully");
          this.router.navigate(['/Admin']);
        },
        error: (error) => {
          console.error("Error adding category:", error);
          alert("Error adding category.");
        }
      });

      this.submitted = true;
    }
  }
}
