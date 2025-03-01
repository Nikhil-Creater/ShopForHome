import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDeleteComponent } from './category-delete.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CouponAssignComponent } from '../../coupons-crud/coupon-assign/coupon-assign.component';

describe('CategoryDeleteComponent', () => {
  let component: CategoryDeleteComponent;
  let fixture: ComponentFixture<CategoryDeleteComponent>;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CategoryDeleteComponent , HttpClientTestingModule],
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

    fixture = TestBed.createComponent(CategoryDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
