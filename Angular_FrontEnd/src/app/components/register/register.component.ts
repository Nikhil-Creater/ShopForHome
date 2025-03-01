import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userdata = {fullName : '',email: '',normalPassword: '', address: ''};

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    this.authService.register(this.userdata)
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.fullName == this.userdata.fullName) {
            alert("Registration Sucessfull");
            this.router.navigate(['/login']);
          } else {
            alert('Registration failed. Please try again.');
          }
        }
      });
  }
}