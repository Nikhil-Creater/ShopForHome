import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReportDetailsComponent } from './sales-report-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SalesReportDetailsComponent', () => {
  let component: SalesReportDetailsComponent;
  let fixture: ComponentFixture<SalesReportDetailsComponent>;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SalesReportDetailsComponent , HttpClientTestingModule],
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

    fixture = TestBed.createComponent(SalesReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
