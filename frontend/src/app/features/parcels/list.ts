import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf, NgClass, AsyncPipe, DatePipe } from '@angular/common';
import { ParcelService, Parcel } from '../../core/services/parcel.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterLink, NgForOf, NgIf, NgClass, DatePipe, AsyncPipe],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class List implements OnInit {
  sentParcels$!: Observable<Parcel[]>;
  toMeParcels$!: Observable<Parcel[]>;
  filteredSentParcels$!: Observable<Parcel[]>;
  filteredToMeParcels$!: Observable<Parcel[]>;

  activeTab: 'sent' | 'toMe' = 'sent';
  statusFilter: string = 'All';
  currentPage: number = 1;
  pageSize: number = 7;

  constructor(private parcelService: ParcelService) {}

  ngOnInit() {
    this.loadParcels();
  }

  loadParcels() {
    this.sentParcels$ = this.parcelService.getSentParcels();
    this.toMeParcels$ = this.parcelService.getReceivedParcels();

    this.filteredSentParcels$ = this.sentParcels$.pipe(
      map(parcels => this.filterParcels(parcels))
    );

    this.filteredToMeParcels$ = this.toMeParcels$.pipe(
      map(parcels => this.filterParcels(parcels))
    );
  }

  filterParcels(parcels: Parcel[]): Parcel[] {
    if (this.statusFilter === 'All') return parcels;
    return parcels.filter(p => p.status === this.statusFilter);
  }

  switchTab(tab: 'sent' | 'toMe') {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  setStatusFilter(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value || 'All';
    this.statusFilter = value;
    this.loadParcels(); // Reload with new filter
    this.currentPage = 1;
  }

  goToPage(page: number) {
    // Note: Pagination logic would need to be implemented on the backend
    // For now, this is a placeholder
    this.currentPage = page;
  }
}
