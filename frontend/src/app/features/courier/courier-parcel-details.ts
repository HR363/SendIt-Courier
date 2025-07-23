import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-courier-parcel-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courier-parcel-details.html',
  styleUrls: ['./courier-parcel-details.css']
})
export class CourierParcelDetails {
  route = inject(ActivatedRoute);
  parcelId = this.route.snapshot.paramMap.get('id');
  // In a real app, fetch parcel details from a service using parcelId
  parcel = {
    id: this.parcelId,
    sender: 'Alice Smith',
    receiver: 'Bob Johnson',
    status: 'In Transit',
    lastUpdate: '2024-07-25 10:30 AM',
    zone: 'Zone 1',
    weight: 5.3,
    description: 'Fragile electronics',
    pickupAddress: '123 Main St, City, State',
    destinationAddress: '456 Oak Ave, City, State',
    serviceType: 'Express',
    cost: 25.5
  };

  getStatusClass(status: string): string {
    return status ? status.replace(/\s/g, '').toLowerCase() : '';
  }
}
