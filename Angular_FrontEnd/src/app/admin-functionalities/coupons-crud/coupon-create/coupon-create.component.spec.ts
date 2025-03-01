import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponCreateComponent } from './coupon-create.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CouponCreateComponent', () => {
  let component: CouponCreateComponent;
  let fixture: ComponentFixture<CouponCreateComponent>;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CouponCreateComponent , HttpClientTestingModule],
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

    fixture = TestBed.createComponent(CouponCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
