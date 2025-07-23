import { Component } from '@angular/core';
import { NgForOf, NgClass } from '@angular/common';
import { AdminParcelDetailsPopup } from './admin-parcel-details-popup';
import { FormsModule } from '@angular/forms';

interface Parcel {
  id: string;
  sender: string;
  receiver: string;
  status: 'In Transit' | 'Delivered' | 'Pending' | 'On Hold' | 'Cancelled';
  lastUpdate: string;
  zone: string;
}

@Component({
  selector: 'app-admin-manage-parcels',
  standalone: true,
  imports: [NgForOf, NgClass, FormsModule, AdminParcelDetailsPopup],
  templateUrl: './admin-manage-parcels.html',
  styleUrls: ['./admin-manage-parcels.css']
})
export class AdminManageParcels {
  statuses = ['All Statuses', 'In Transit', 'Delivered', 'Pending', 'On Hold', 'Cancelled'];
  zones = ['All Zones', 'Zone 1', 'Zone 2', 'Zone 3'];
  selectedStatus = 'All Statuses';
  selectedZone = 'All Zones';
  search = '';
  parcels: Parcel[] = [
    { id: 'CC-001-2024-0001', sender: 'Alice Smith', receiver: 'Bob Johnson', status: 'In Transit', lastUpdate: '2024-07-25 10:30 AM', zone: 'Zone 1' },
    { id: 'CC-001-2024-0002', sender: 'Charlie Brown', receiver: 'Diana Prince', status: 'Delivered', lastUpdate: '2024-07-24 03:15 PM', zone: 'Zone 2' },
    { id: 'CC-001-2024-0003', sender: 'Eve Adams', receiver: 'Frank White', status: 'Pending', lastUpdate: '2024-07-25 09:00 AM', zone: 'Zone 1' },
    { id: 'CC-001-2024-0004', sender: 'Grace Lee', receiver: 'Henry Kim', status: 'On Hold', lastUpdate: '2024-07-23 02:00 PM', zone: 'Zone 3' },
    { id: 'CC-001-2024-0005', sender: 'Ivy Chen', receiver: 'Jack Davis', status: 'In Transit', lastUpdate: '2024-07-25 11:45 AM', zone: 'Zone 2' },
    { id: 'CC-001-2024-0006', sender: 'Karen Green', receiver: 'Liam Hall', status: 'Delivered', lastUpdate: '2024-07-22 09:00 AM', zone: 'Zone 1' },
    { id: 'CC-001-2024-0007', sender: 'Mike Ross', receiver: 'Nancy Drew', status: 'Pending', lastUpdate: '2024-07-25 07:10 AM', zone: 'Zone 3' },
    { id: 'CC-001-2024-0008', sender: 'Olivia King', receiver: 'Peter Jones', status: 'Cancelled', lastUpdate: '2024-07-21 04:00 PM', zone: 'Zone 2' },
    { id: 'CC-001-2024-0009', sender: 'Quinn Taylor', receiver: 'Rachel White', status: 'In Transit', lastUpdate: '2024-07-25 08:20 AM', zone: 'Zone 1' },
    { id: 'CC-001-2024-0010', sender: 'Sam Miller', receiver: 'Tina Black', status: 'Pending', lastUpdate: '2024-07-25 09:00 AM', zone: 'Zone 3' },
  ];
  page = 1;
  pageSize = 10;

  showDetails = false;
  selectedParcel: Parcel | null = null;

  openDetails(parcel: Parcel) {
    this.selectedParcel = parcel;
    this.showDetails = true;
  }
  closeDetails() {
    this.showDetails = false;
    this.selectedParcel = null;
  }

  get filteredParcels() {
    let filtered = this.parcels;
    if (this.selectedStatus !== 'All Statuses') {
      filtered = filtered.filter(p => p.status === this.selectedStatus);
    }
    if (this.selectedZone !== 'All Zones') {
      filtered = filtered.filter(p => p.zone === this.selectedZone);
    }
    if (this.search.trim()) {
      const s = this.search.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.id.toLowerCase().includes(s) ||
        p.sender.toLowerCase().includes(s) ||
        p.receiver.toLowerCase().includes(s)
      );
    }
    return filtered;
  }

  get paginatedParcels() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredParcels.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredParcels.length / this.pageSize) || 1;
  }

  getStatusClass(status: string): string {
    return status.replace(/\s/g, '').toLowerCase();
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  max(a: number, b: number): number {
    return Math.max(a, b);
  }

  setStatus(parcel: Parcel, status: string) {
    parcel.status = status as Parcel['status'];
  }

  clearFilters() {
    this.selectedStatus = 'All Statuses';
    this.selectedZone = 'All Zones';
    this.search = '';
  }
} 