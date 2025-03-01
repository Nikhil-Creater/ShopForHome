import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SaleReportService } from '../../../services/sale-report/sale-report.service';

@Component({
  selector: 'app-sale-report-generate',
  imports: [ReactiveFormsModule],
  templateUrl: './sale-report-generate.component.html',
  styleUrl: './sale-report-generate.component.css'
})
export class SaleReportGenerateComponent {
  salesReportForm: FormGroup;

  // Emit fetched sales data to parent component
  @Output() salesData = new EventEmitter<any[]>();

  constructor(private salesReportService: SaleReportService) {
    this.salesReportForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required)
    });
  }

  // Submit form and call API
  onGenerateReport() {
    if (this.salesReportForm.valid) {
      const { startDate, endDate } = this.salesReportForm.value;

      // Call the service to generate sales report
      this.salesReportService.generateSalesReport(startDate, endDate).subscribe({
        next: (salesReport) => {
          this.salesData.emit(salesReport); // Emit fetched sales report to parent
        },
        error: (error) => {
          console.error('Error fetching sales report:', error);
          alert('Failed to generate sales report.');
        }
      });
    } else {
      alert('Please select both start and end dates.');
    }
  }
}
