import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponDeactivateComponent } from './coupon-deactivate.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CouponDeactivateComponent', () => {
  let component: CouponDeactivateComponent;
  let fixture: ComponentFixture<CouponDeactivateComponent>;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CouponDeactivateComponent , HttpClientTestingModule],
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

    fixture = TestBed.createComponent(CouponDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
