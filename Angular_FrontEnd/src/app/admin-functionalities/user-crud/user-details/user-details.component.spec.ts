import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsComponent } from './user-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [UserDetailsComponent , HttpClientTestingModule],
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

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
