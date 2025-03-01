import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDeleteComponent } from './product-delete.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ProductDeleteComponent', () => {
  let component: ProductDeleteComponent;
  let fixture: ComponentFixture<ProductDeleteComponent>;

 beforeEach(async () => {
     await TestBed.configureTestingModule({
       imports: [ProductDeleteComponent , HttpClientTestingModule],
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

    fixture = TestBed.createComponent(ProductDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
