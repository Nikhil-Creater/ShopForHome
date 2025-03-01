import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReportGenerateComponent } from './sale-report-generate.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SaleReportGenerateComponent', () => {
  let component: SaleReportGenerateComponent;
  let fixture: ComponentFixture<SaleReportGenerateComponent>;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SaleReportGenerateComponent , HttpClientTestingModule],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              paramMap: of({}), // Mock paramMap observable
              snapshot: { paramMap: { get: () => 'mockValue' } } // Mock snapshot
            }
          }
        ]
      })
    .compileComponents();

    fixture = TestBed.createComponent(SaleReportGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
