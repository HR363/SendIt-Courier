import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';
import { ParcelService } from '../../core/services/parcel.service';

@Component({
  selector: 'app-create-parcel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-parcel.html',
  styleUrls: ['./create-parcel.css']
})
export class CreateParcelComponent implements OnInit {
  parcelForm!: FormGroup;
  statuses = ['Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'On Hold'];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private parcelService: ParcelService
  ) {}

  ngOnInit(): void {
    this.parcelForm = this.fb.group({
      senderName: ['', Validators.required],
      senderPhone: ['', Validators.required],
      senderEmail: ['', [Validators.required, Validators.email]],
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
    const form = this.parcelForm.value;
    // Build payload for backend
    const payload = {
      senderName: form.senderName,
      senderPhone: form.senderPhone,
      senderEmail: form.senderEmail,
      receiverName: form.receiverName,
      receiverPhone: form.receiverPhone,
      receiverEmail: form.receiverEmail,
      pickupLocation: JSON.stringify({ address: form.pickupAddress }),
      destinationLocation: JSON.stringify({ address: form.destinationAddress }),
      weight: form.weight,
      description: form.description,
      status: form.status,
      estimatedDeliveryDate: form.pickupDate ? new Date(form.pickupDate).toISOString() : new Date().toISOString(),
      price: 25.5 // You may want to calculate this based on weight/category
    };
    this.parcelService.createParcel(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.show('Parcel created successfully!', 'success');
        this.router.navigate(['/admin/parcels']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toastService.show('Failed to create parcel', 'error');
        console.error('Parcel creation error:', err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/dashboard']);
  }
} 