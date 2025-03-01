import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponDetailsComponent } from './coupon-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CouponDetailsComponent', () => {
  let component: CouponDetailsComponent;
  let fixture: ComponentFixture<CouponDetailsComponent>;

   beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [CouponDetailsComponent , HttpClientTestingModule],
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

    fixture = TestBed.createComponent(CouponDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
