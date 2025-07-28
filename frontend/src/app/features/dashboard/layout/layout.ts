import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { UserService, UserProfile } from '../profile/user.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, AsyncPipe, NgIf],
  templateUrl: './layout.html'
})
export class DashboardLayout {
  user$: Observable<UserProfile | null>;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.user$ = this.userService.getProfile();
  }

  signOut() {
    // Optionally clear auth state here
    this.router.navigateByUrl('/');
  }
} 