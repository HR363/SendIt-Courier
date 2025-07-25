import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Parcel {
  id: string;
  senderId: string;
  recipientId: string;
  status: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  receiverName?: string;
  deliveryDate?: string;
  origin?: string;
  destination?: string;
  weight?: number;
  cost?: number;
  // Add other fields as needed
}

@Injectable({ providedIn: 'root' })
export class ParcelService {
  private apiUrl = 'http://localhost:3000/api/parcels';

  constructor(private http: HttpClient) {}

  getParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(this.apiUrl);
  }

  getParcel(id: string): Observable<Parcel> {
    return this.http.get<Parcel>(`${this.apiUrl}/${id}`);
  }

  createParcel(data: Partial<Parcel>): Observable<Parcel> {
    return this.http.post<Parcel>(this.apiUrl, data);
  }

  updateParcel(id: string, data: Partial<Parcel>): Observable<Parcel> {
    return this.http.put<Parcel>(`${this.apiUrl}/${id}`, data);
  }

  deleteParcel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
