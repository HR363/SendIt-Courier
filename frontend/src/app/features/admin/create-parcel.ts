import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

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
    private toastService: ToastService
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
    console.log('Simulating parcel creation with:', this.parcelForm.value);

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.toastService.show('Parcel created successfully!', 'success');
      this.router.navigate(['/admin/parcels']);
    }, 1500);
  }

  cancel() {
    this.router.navigate(['/admin/dashboard']);
  }
} 