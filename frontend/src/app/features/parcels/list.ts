import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForOf } from '@angular/common';

export interface Parcel {
  id: string;
  receiverName: string;
  status: 'Delivered' | 'In Transit' | 'Pending' | 'Cancelled' | 'New Order';
  deliveryDate: string;
  origin: string;
  destination: string;
  weight: string;
  cost: string;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterLink, NgForOf],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class List {
  sentParcels: Parcel[] = [
    {
      id: 'PRC-001-A2B',
      receiverName: 'Alice Johnson',
      status: 'Delivered',
      deliveryDate: '2023-11-20',
      origin: 'London, UK',
      destination: 'Paris, FR',
      weight: '2.5 kg',
      cost: '$25.00',
    },
    {
      id: 'PRC-002-C3D',
      receiverName: 'Bob Smith',
      status: 'In Transit',
      deliveryDate: '2023-11-28',
      origin: 'Berlin, DE',
      destination: 'Rome, IT',
      weight: '5.0 kg',
      cost: '$40.00',
    },
    {
      id: 'PRC-003-E4F',
      receiverName: 'Charlie Brown',
      status: 'Pending',
      deliveryDate: '2023-12-05',
      origin: 'Madrid, ES',
      destination: 'Lisbon, PT',
      weight: '1.2 kg',
      cost: '$15.50',
    },
    {
      id: 'PRC-004-G5H',
      receiverName: 'Diana Prince',
      status: 'Cancelled',
      deliveryDate: '2023-11-15',
      origin: 'New York, US',
      destination: 'Toronto, CA',
      weight: '10.0 kg',
      cost: '$75.00',
    },
    {
      id: 'PRC-005-I6J',
      receiverName: 'Ethan Hunt',
      status: 'New Order',
      deliveryDate: '2023-12-10',
      origin: 'Tokyo, JP',
      destination: 'Seoul, KR',
      weight: '0.8 kg',
      cost: '$18.75',
    },
    {
      id: 'PRC-006-K7L',
      receiverName: 'Fiona Gallagher',
      status: 'Delivered',
      deliveryDate: '2023-11-22',
      origin: 'Sydney, AU',
      destination: 'Auckland, NZ',
      weight: '3.1 kg',
      cost: '$30.00',
    },
    {
      id: 'PRC-007-M8N',
      receiverName: 'George Costanza',
      status: 'In Transit',
      deliveryDate: '2023-11-29',
      origin: 'Vancouver, CA',
      destination: 'Seattle, US',
      weight: '6.5 kg',
      cost: '$55.00',
    },
  ];

  toMeParcels: Parcel[] = [
    {
      id: 'PRC-101-X1Y',
      receiverName: 'You',
      status: 'Delivered',
      deliveryDate: '2023-10-10',
      origin: 'Paris, FR',
      destination: 'London, UK',
      weight: '2.0 kg',
      cost: '$22.00',
    },
    {
      id: 'PRC-102-Z2W',
      receiverName: 'You',
      status: 'In Transit',
      deliveryDate: '2023-12-01',
      origin: 'Rome, IT',
      destination: 'Berlin, DE',
      weight: '4.0 kg',
      cost: '$38.00',
    },
    {
      id: 'PRC-103-V3U',
      receiverName: 'You',
      status: 'Pending',
      deliveryDate: '2023-12-12',
      origin: 'Lisbon, PT',
      destination: 'Madrid, ES',
      weight: '1.5 kg',
      cost: '$16.00',
    },
  ];

  activeTab: 'sent' | 'toMe' = 'sent';
  statusFilter: string = 'All';
  currentPage: number = 1;
  pageSize: number = 7;

  get filteredParcels(): Parcel[] {
    const parcels = this.activeTab === 'sent' ? this.sentParcels : this.toMeParcels;
    if (this.statusFilter === 'All') return parcels;
    return parcels.filter(p => p.status === this.statusFilter);
  }

  get paginatedParcels(): Parcel[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredParcels.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredParcels.length / this.pageSize) || 1;
  }

  switchTab(tab: 'sent' | 'toMe') {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  setStatusFilter(status: string) {
    this.statusFilter = status;
    this.currentPage = 1;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }
}
