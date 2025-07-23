import { Component, signal } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';

interface PaymentMethod {
  id: string;
  type: 'Visa' | 'Mastercard' | 'Bank';
  last4: string;
  expires: string;
}

interface Shipment {
  id: string;
  title: string;
  trackingId: string;
  status: 'Delivered' | 'In Transit' | 'Pending';
  date: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgFor, NgClass],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user = signal({
    name: 'Jessica Williams',
    email: 'jessica.williams@example.com',
    phone: '+1 (555) 123-4567',
    photo: '',
    profileComplete: 75
  });

  // Edit profile state
  editMode = signal(false);
  editForm = signal({
    name: '',
    email: '',
    phone: ''
  });
  photoPreview = signal<string | null>(null);

  // Payment methods state
  paymentEditMode = signal(false);
  newPaymentForm = signal({
    type: 'Visa' as 'Visa' | 'Mastercard' | 'Bank',
    number: '',
    expires: '',
    cvv: ''
  });

  // Shipments state
  showAllShipments = signal(false);

  paymentMethods = signal<PaymentMethod[]>([
    { id: '1', type: 'Visa', last4: '4242', expires: '12/26' },
    { id: '2', type: 'Mastercard', last4: '5100', expires: '09/25' },
    { id: '3', type: 'Bank', last4: '8901', expires: 'N/A' }
  ]);

  shipments = signal<Shipment[]>([
    { id: '1', title: 'Delivery: Package to New York City', trackingId: 'TRK96754', status: 'Delivered', date: '2024-07-28' },
    { id: '2', title: 'Shipment: Parcel from Los Angeles', trackingId: 'TRK23456', status: 'In Transit', date: '2024-07-29' },
    { id: '3', title: 'Delivery: Documents to Chicago', trackingId: 'TRK56790', status: 'Pending', date: '2024-07-30' },
    { id: '4', title: 'Shipment: Fragile goods to Dallas', trackingId: 'TRK34567', status: 'In Transit', date: '2024-07-28' },
    { id: '5', title: 'Delivery: Electronics to Seattle', trackingId: 'TRK29543', status: 'Delivered', date: '2024-07-27' },
    { id: '6', title: 'Shipment: Clothing to Miami', trackingId: 'TRK78901', status: 'Delivered', date: '2024-07-26' },
    { id: '7', title: 'Delivery: Books to Portland', trackingId: 'TRK12345', status: 'In Transit', date: '2024-07-31' },
    { id: '8', title: 'Shipment: Furniture to Denver', trackingId: 'TRK67890', status: 'Pending', date: '2024-08-01' }
  ]);

  notifications = signal({ sms: true, email: true });

  // Edit profile methods
  openEditProfile() {
    const u = this.user();
    this.editForm.set({ name: u.name, email: u.email, phone: u.phone });
    this.photoPreview.set(u.photo || null);
    this.editMode.set(true);
  }
  closeEditProfile() {
    this.editMode.set(false);
    this.photoPreview.set(null);
  }
  saveProfile() {
    this.user.update(u => ({ ...u, ...this.editForm(), photo: this.photoPreview() || u.photo }));
    this.editMode.set(false);
    this.photoPreview.set(null);
  }
  onEditInputChange(field: 'name' | 'email' | 'phone', value: string) {
    this.editForm.update(f => ({ ...f, [field]: value }));
  }
  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        this.photoPreview.set(reader.result as string);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Payment methods methods
  openAddPayment() {
    this.paymentEditMode.set(true);
    this.newPaymentForm.set({ type: 'Visa', number: '', expires: '', cvv: '' });
  }
  closeAddPayment() {
    this.paymentEditMode.set(false);
  }
  onPaymentInputChange(field: 'type' | 'number' | 'expires' | 'cvv', value: string) {
    this.newPaymentForm.update(f => ({ ...f, [field]: value }));
  }
  addPaymentMethod() {
    const form = this.newPaymentForm();
    if (form.number && form.expires) {
      const newPayment: PaymentMethod = {
        id: Date.now().toString(),
        type: form.type,
        last4: form.number.slice(-4),
        expires: form.expires
      };
      this.paymentMethods.update(methods => [...methods, newPayment]);
      this.closeAddPayment();
    }
  }
  removePaymentMethod(id: string) {
    this.paymentMethods.update(methods => methods.filter(m => m.id !== id));
  }

  // Shipments methods
  toggleShipmentsView() {
    this.showAllShipments.update(show => !show);
  }
  getDisplayedShipments() {
    return this.showAllShipments() ? this.shipments() : this.shipments().slice(0, 3);
  }

  // Simulate actions
  toggleNotification(type: 'sms' | 'email') {
    this.notifications.update(n => ({ ...n, [type]: !n[type] }));
  }
} 