// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { NotificationsComponent } from './notifications.component';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';

// describe('NotificationsComponent', () => {
//   let component: NotificationsComponent;
//   let fixture: ComponentFixture<NotificationsComponent>;

//   beforeEach(async () => {
//       await TestBed.configureTestingModule({
//         imports: [NotificationsComponent , HttpClientTestingModule],
//         providers: [
//           {
//             provide: ActivatedRoute,
//             useValue: {
//               paramMap: of({}), // Mock paramMap observable
//               snapshot: { paramMap: { get: () => 'mockValue' } } // Mock snapshot
//             }
//           }
//         ]
//       })
//     .compileComponents();

//     fixture = TestBed.createComponent(NotificationsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
