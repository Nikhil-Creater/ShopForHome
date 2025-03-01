import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdateComponent } from './user-update.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('UserUpdateComponent', () => {
  let component: UserUpdateComponent;
  let fixture: ComponentFixture<UserUpdateComponent>;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [UserUpdateComponent , HttpClientTestingModule],
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

    fixture = TestBed.createComponent(UserUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
