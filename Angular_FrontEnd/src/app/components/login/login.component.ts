import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  userModel: any = {
    fullName: '',
    email: '',
    password: '',
    address: '',
    userId: '',
    roleId: '',
    accessToken: '',
  };

  ngOnInit(): void {
    // Check if the token is expired and clear session if necessary
    if (this.authService.isTokenExpired('token')) {
      localStorage.clear();
      alert('Session expired. Please log in again.');
      this.router.navigate(['/login']);
    }
  }

  constructor(private authService: AuthService, private router: Router) {}
  onLogin(user: any): void {
    console.log("Sending request:", user);
    this.authService.jwtLogin(user).subscribe((response) => {
      this.userModel = response;
      console.log(response);
      if (this.userModel != undefined) {
        localStorage.setItem('token', this.userModel.accessToken);
        localStorage.setItem('roleId', this.userModel.roleId);
        localStorage.setItem('userId', this.userModel.userId);
        alert('Login Successfull');
        if (this.userModel.roleId == 1) {
          this.router.navigate(['/Admin']);
        } else {
          this.router.navigate(['/products']);
        }
      } else {
        alert('Oops! You are not registered.');
        this.router.navigate(['/register']);
      }
    });
  }
}
