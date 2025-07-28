import { Component, OnInit } from '@angular/core';
import { NgForOf, NgClass, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserProfile } from '../../core/services/user.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-admin-manage-users',
  standalone: true,
  imports: [NgForOf, NgClass, FormsModule, AsyncPipe],
  templateUrl: './admin-manage-users.html',
  styleUrls: ['./admin-manage-users.css']
})
export class AdminManageUsers implements OnInit {
  allUsers$!: Observable<UserProfile[]>;
  filteredUsers$!: Observable<UserProfile[]>;

  roles = ['All', 'USER', 'COURIER_AGENT', 'ADMIN'];
  selectedRole = 'All';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.allUsers$ = this.userService.listUsers();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredUsers$ = this.allUsers$.pipe(
      map(users => {
        if (this.selectedRole === 'All') return users;
        return users.filter(u => u.role === this.selectedRole);
      })
    );
  }

  onRoleFilterChange() {
    this.applyFilters();
  }

  updateUserStatus(user: UserProfile, isActive: boolean) {
    this.userService.updateUserStatus(user.id, { isActive }).subscribe(() => {
      this.loadUsers(); // Refresh data
    });
  }
}