import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NgForOf, NgIf, NgClass, DatePipe, AsyncPipe } from '@angular/common';
import { ParcelService, Parcel } from '../../core/services/parcel.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-parcel-details',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass, DatePipe, AsyncPipe],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class ParcelDetails implements OnInit {
  showLiveModal = false;
  parcel$!: Observable<Parcel>;
  parcelId!: string;

  constructor(
    private route: ActivatedRoute,
    private parcelService: ParcelService
  ) {}

  ngOnInit() {
    this.parcelId = this.route.snapshot.paramMap.get('id') || '';
    if (this.parcelId) {
      this.parcel$ = this.parcelService.getParcel(this.parcelId);
    }
  }
  openLiveModal() {
    this.showLiveModal = true;
  }

  closeLiveModal() {
    this.showLiveModal = false;
  }
} 