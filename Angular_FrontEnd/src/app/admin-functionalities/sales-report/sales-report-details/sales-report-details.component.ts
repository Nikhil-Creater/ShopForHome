import { Component, Input } from '@angular/core';
import { SaleReportService } from '../../../services/sale-report/sale-report.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { SaleReportGenerateComponent } from '../sale-report-generate/sale-report-generate.component';
import { AfterContentChecked } from '@angular/core';


@Component({
  selector: 'app-sales-report-details',
  imports: [DatePipe, CommonModule, SaleReportGenerateComponent , RouterLink],
  templateUrl: './sales-report-details.component.html',
  styleUrl: './sales-report-details.component.css'
})
export class SalesReportDetailsComponent implements AfterContentChecked {
  @Input() salesData: any[] = []; // Receiving filtered data from sales-report-by-date

  constructor(private salesReportService: SaleReportService, private router: Router) {}
  ngAfterContentChecked(): void {
    if (!this.salesData || this.salesData.length === 0) {
      this.fetchAllSalesReports();
    }
  }

  ngOnInit() {
    // Fetch all sales reports if no filtered data is provided
    if (!this.salesData || this.salesData.length === 0) {
      this.fetchAllSalesReports();
    }
  }



  // Fetch all sales reports when no date filter is applied
  fetchAllSalesReports(): void {
    this.salesReportService.getAllSalesReports().subscribe({
      next: (data) => {
        this.salesData = data;
      },
      error: (error) => {
        console.error('Error fetching sales reports:', error);
      }
    });
  }

  // ✅ Method to update sales data dynamically when new reports are received
  updateSalesData(newData: any[]) {
    this.salesData = newData;
  }
}
