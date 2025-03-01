import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-user-delete',
  imports: [RouterLink],
  templateUrl: './user-delete.component.html',
  styleUrl: './user-delete.component.css'
})
export class UserDeleteComponent {
  userId!: number;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }

  deleteUser() {
    this.userService.deleteUser(this.userId).subscribe(() => {
      this.router.navigate(['/Admin']);
    });
  }
}
