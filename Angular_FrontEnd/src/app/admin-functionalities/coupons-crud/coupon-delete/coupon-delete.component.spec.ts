import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponDeleteComponent } from './coupon-delete.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CouponDeleteComponent', () => {
  let component: CouponDeleteComponent;
  let fixture: ComponentFixture<CouponDeleteComponent>;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CouponDeleteComponent , HttpClientTestingModule],
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

    fixture = TestBed.createComponent(CouponDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
