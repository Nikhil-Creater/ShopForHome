import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponAssignComponent } from './coupon-assign.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CouponAssignComponent', () => {
  let component: CouponAssignComponent;
  let fixture: ComponentFixture<CouponAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponAssignComponent , HttpClientTestingModule],
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

    fixture = TestBed.createComponent(CouponAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
