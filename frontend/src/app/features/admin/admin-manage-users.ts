import { Component } from '@angular/core';
import { NgForOf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'User' | 'Courier' | 'Admin';
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-admin-manage-users',
  standalone: true,
  imports: [NgForOf, NgClass, FormsModule],
  templateUrl: './admin-manage-users.html',
  styleUrls: ['./admin-manage-users.css']
})
export class AdminManageUsers {
  roles = ['All', 'User', 'Courier', 'Admin'];
  selectedRole = 'All';
  users: User[] = [
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', phone: '555-1234', role: 'User', status: 'Active' },
    { id: '2', name: 'Bob Johnson', email: 'bob@example.com', phone: '555-5678', role: 'Courier', status: 'Active' },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-8765', role: 'Admin', status: 'Active' },
    { id: '4', name: 'Diana Prince', email: 'diana@example.com', phone: '555-4321', role: 'User', status: 'Inactive' },
    { id: '5', name: 'Ethan Hunt', email: 'ethan@example.com', phone: '555-2468', role: 'Courier', status: 'Active' },
    { id: '6', name: 'Fiona Gallagher', email: 'fiona@example.com', phone: '555-1357', role: 'User', status: 'Active' },
  ];

  get filteredUsers() {
    if (this.selectedRole === 'All') return this.users;
    return this.users.filter(u => u.role === this.selectedRole);
  }

  changeRole(user: User, newRole: string) {
    user.role = newRole as User['role'];
  }
} 