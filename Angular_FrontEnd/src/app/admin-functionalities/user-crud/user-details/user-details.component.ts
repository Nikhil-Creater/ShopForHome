import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details',
  imports: [CommonModule , RouterLink],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Fetch all users
  loadUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  // Navigate to update user page
  updateUser(userId: number) {
    this.router.navigate([`/update-user`, userId]);
  }

  // Navigate to delete user page
  deleteUser(userId: number) {
    this.router.navigate([`/delete-user`,userId]);
  }
}
