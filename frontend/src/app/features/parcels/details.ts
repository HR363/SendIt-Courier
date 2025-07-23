import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-parcel-details',
  standalone: true,
  imports: [RouterLink, NgForOf, NgIf, NgClass],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class ParcelDetails {
  showLiveModal = false;

  // Mock data for demo
  parcel = {
    id: 'QSKP123456789',
    status: 'Out for Delivery',
    statusColor: 'orange',
    weight: '2.5 kg',
    pickupDate: '2024-03-10',
    deliveryDate: '2024-03-12 (est.)',
    serviceType: 'Express Delivery',
    dimensions: '30×20×15 cm',
  };
  sender = {
    name: 'Aisha Sharma',
    address: '123 Innovation Drive, Tech City, 9021D',
    phone: '+1 (555) 123-4567',
    email: 'aisha.sharma@example.com',
  };
  receiver = {
    name: 'Ben Carter',
    address: '456 Commerce St, Central Plaza, 100D1',
    phone: '+1 (555) 987-6543',
    email: 'ben.carterhq@example.com',
  };
  timeline = [
    {
      label: 'Order Placed',
      date: '2024-03-09 at 14:30',
      location: 'Online Portal',
      icon: 'fa-clipboard-list',
      status: 'done',
    },
    {
      label: 'Picked Up by Courier',
      date: '2024-03-10 at 10:15',
      location: 'Tech City Hub',
      icon: 'fa-truck',
      status: 'done',
    },
    {
      label: 'In Transit - Sorting Facility',
      date: '2024-03-11 at 08:00',
      location: 'Regional Sorting Center',
      icon: 'fa-warehouse',
      status: 'done',
    },
    {
      label: 'Out for Delivery',
      date: '2024-03-12 at 08:45',
      location: 'Central Plaza Depot',
      icon: 'fa-shipping-fast',
      status: 'current',
    },
  ];
  notes = 'Recipient prefers delivery after 2 PM. Please leave package at the front desk if not home.';

  openLiveModal() {
    this.showLiveModal = true;
  }
  closeLiveModal() {
    this.showLiveModal = false;
  }
} 