import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-search',
  imports:[ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  // Reactive Form for search filters
  searchForm: FormGroup;

  // Emit filtered products to parent (Product List)
  @Output() searchResults = new EventEmitter<any[]>();

  constructor(private searchService: SearchService) {
    this.searchForm = new FormGroup({
      minPrice: new FormControl(null),
      maxPrice: new FormControl(null),
      minRating: new FormControl(null),
      maxRating: new FormControl(null),
      categoryName: new FormControl(''),
      keyword: new FormControl('')
    });
  }

  // ✅ Handle search when the form is submitted
  onSearch() {
    const filters: any = {};

    // ✅ Add only non-null, non-empty values to the request
    Object.keys(this.searchForm.value).forEach((key) => {
      const value = this.searchForm.value[key];
      if (value !== null && value !== '') {
        filters[key] = value;
      }
    });

    // ✅ Make the API call if at least one filter is applied
    if (Object.keys(filters).length > 0) {
      this.searchService.getFilteredProducts(filters).subscribe({
        next: (products) => {
          this.searchResults.emit(products); // Emit the results to the parent
        },
        error: (err) => {
          console.error('Error fetching filtered products:', err);
        }
      });
    } else {
      alert('Please enter at least one filter to search.');
    }
  }
}
