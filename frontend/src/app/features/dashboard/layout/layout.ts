import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './layout.html'
})
export class DashboardLayout {
  constructor(private router: Router) {}

  signOut() {
    // Optionally clear auth state here
    this.router.navigateByUrl('/');
  }
} 