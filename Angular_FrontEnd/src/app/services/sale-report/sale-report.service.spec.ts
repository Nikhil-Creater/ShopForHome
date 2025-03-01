import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SaleReportService } from './sale-report.service';

describe('SaleReportService', () => {
  let service: SaleReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SaleReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
