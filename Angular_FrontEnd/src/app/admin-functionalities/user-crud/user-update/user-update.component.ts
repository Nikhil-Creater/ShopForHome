import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-update',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent {
  submitted: boolean = false;
  myReactiveForm!: FormGroup;
  userId!: number;
  userData: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.submitted = false;

    // ✅ Get userId from URL parameters
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    // ✅ Initialize the form
    this.myReactiveForm = this.formBuilder.group({
      userId:[this.userId],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      normalPassword: ['', Validators.required],
      roleId: [0, Validators.required]
    });

    // ✅ Fetch user details and patch form values
    this.userService.getUsersById(this.userId).subscribe(data => {
      this.userData = data;

      this.myReactiveForm.patchValue({
        userId:this.userData.userId,
        fullName: this.userData.fullName,
        email: this.userData.email,
        address: this.userData.address,
        normalPassword: this.userData.normalPassword,
        roleId: this.userData.roleId
      });
    });
  }

  onSubmit(event:Event):void{
    if ((event.target as HTMLElement).tagName !== 'FORM') {
      return; // Only proceed if the event comes from the form
    }
    console.log("Request Body:", this.myReactiveForm.value);
    this.userService.updateUser(this.userId, this.myReactiveForm.value).subscribe({
      next: () => {
        alert("Edited successfully");
        this.router.navigate(["/Admin"]); // ✅ Fixed navigation path
      },
      error: (error) => {
        console.error("Update error:", error);
        alert("Error updating user.");
      }
    });
  }
}
