
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courier-create-parcel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './courier-create-parcel.html',
  styleUrls: ['./courier-create-parcel.css']
})
export class CourierCreateParcel implements OnInit {
  parcelForm!: FormGroup;
  statuses = ['Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'On Hold'];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.parcelForm = this.fb.group({
      senderName: ['', Validators.required],
      receiverName: ['', Validators.required],
      receiverPhone: ['', Validators.required],
      receiverEmail: ['', [Validators.required, Validators.email]],
      pickupAddress: [''],
      destinationAddress: ['', Validators.required],
      pickupDate: [''],
      weight: [null, Validators.required],
      status: ['Pending', Validators.required],
      description: [''],
      serviceType: ['Standard', Validators.required]
    });
  }

  createParcel() {
    if (this.parcelForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      alert('Parcel created successfully!');
      this.router.navigate(['/courier/parcels']);
    }, 1200);
  }

  cancel() {
    this.router.navigate(['/courier/parcels']);
  }
}
