import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courier-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courier-dashboard.html',
  styleUrls: ['./courier-dashboard.css']
})
export class CourierDashboard {
  tab: 'pickups' | 'deliveries' = 'pickups';
  pendingPickups = [
    { id: 'PCK-001', address: '123 Main St', recipient: 'Alice', date: '2025-07-22', completed: false },
    { id: 'PCK-002', address: '456 Oak Ave', recipient: 'Bob', date: '2025-07-22', completed: false }
  ];
  pendingDeliveries = [
    { id: 'DLV-001', address: '789 Pine Rd', recipient: 'Jane', date: '2025-07-22', completed: false },
    { id: 'DLV-002', address: '321 Maple St', recipient: 'Sam', date: '2025-07-22', completed: false }
  ];

  markPickupCompleted(index: number) {
    this.pendingPickups[index].completed = true;
  }

  markDeliveryCompleted(index: number) {
    this.pendingDeliveries[index].completed = true;
  }
}
