import { Component, OnInit } from '@angular/core';
import { UserService, UserProfile } from './user.service';
import { UploadService } from '../../../core/services/upload.service';
import { Observable } from 'rxjs';
import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';

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
  imports: [NgIf, NgFor, NgClass, AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  user$!: Observable<UserProfile | null>;
  editMode = false;
  private _editForm: Partial<UserProfile> = {};
  private _photoPreview: string | null = null;

  // Payment, shipments, and notifications will be loaded from backend in future
  _paymentEditMode = false;
  _newPaymentForm = { type: 'Visa', number: '', expires: '', cvv: '' };
  _paymentMethods: any[] = [];
  _shipments: any[] = [];
  _notifications = { sms: false, email: false };
  showAllShipmentsFlag = false;

  constructor(
    private userService: UserService,
    private uploadService: UploadService
  ) {
    this.user$ = this.userService.getProfile();
  }

  // Template expects methods for these properties
  editForm() { return this._editForm; }
  photoPreview() { return this._photoPreview; }
  paymentEditMode() { return this._paymentEditMode; }
  newPaymentForm() { return this._newPaymentForm; }
  paymentMethods() { return this._paymentMethods; }
  shipments() { return this._shipments; }
  notifications() { return this._notifications; }

  openEditProfile(user?: UserProfile) {
    if (user) {
      this._editForm = { name: user.name, email: user.email, phone: user.phone };
      this._photoPreview = user.photo || null;
    }
    this.editMode = true;
  }
  closeEditProfile() {
    this.editMode = false;
    this._photoPreview = null;
  }
  saveProfile() {
    // Extract only the fields that the backend supports
    const { name, email, phone } = this._editForm;

    // Split name into firstName and lastName if provided
    let updateData: any = { email, phone };
    if (name) {
      const nameParts = name.trim().split(' ');
      updateData.firstName = nameParts[0] || '';
      updateData.lastName = nameParts.slice(1).join(' ') || '';
    }

    this.userService.updateProfile(updateData).subscribe(() => {
      this.editMode = false;
      this._photoPreview = null;
      // No need to manually reload user; Observable will update if service emits new value
    });
  }
  onEditInputChange(field: 'name' | 'email' | 'phone', value: string) {
    this._editForm = { ...this._editForm, [field]: value };
  }
  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = () => {
        this._photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      this.uploadService.uploadProfilePhoto(file).subscribe({
        next: (response) => {
          // Update the user's profile with the new photo URL
          this.userService.updateProfile({ profilePhoto: response.url }).subscribe({
            next: () => {
              console.log('Profile photo updated successfully');
            },
            error: (error) => {
              console.error('Error updating profile photo:', error);
            }
          });
        },
        error: (error) => {
          console.error('Error uploading photo:', error);
          // Reset preview on error
          this._photoPreview = null;
        }
      });
    }
  }

  // Shipments view toggle
  toggleShipmentsView() {
    this.showAllShipmentsFlag = !this.showAllShipmentsFlag;
  }
  showAllShipments() {
    return this.showAllShipmentsFlag;
  }
  getDisplayedShipments() {
    return this.showAllShipmentsFlag ? this._shipments : this._shipments.slice(0, 3);
  }

  // Payment methods
  openAddPayment() {
    this._paymentEditMode = true;
  }
  closeAddPayment() {
    this._paymentEditMode = false;
    this._newPaymentForm = { type: 'Visa', number: '', expires: '', cvv: '' };
  }
  addPaymentMethod() {
    // Dummy add, replace with backend integration
    const newMethod = {
      id: Math.random().toString(36).substring(2),
      type: this._newPaymentForm.type,
      last4: this._newPaymentForm.number.slice(-4),
      expires: this._newPaymentForm.expires
    };
    this._paymentMethods.push(newMethod);
    this.closeAddPayment();
  }
  removePaymentMethod(id: string) {
    this._paymentMethods = this._paymentMethods.filter(m => m.id !== id);
  }
  onPaymentInputChange(field: 'type' | 'number' | 'expires' | 'cvv', value: string) {
    this._newPaymentForm = { ...this._newPaymentForm, [field]: value };
  }

  // Notifications
  toggleNotification(type: 'sms' | 'email') {
    this._notifications[type] = !this._notifications[type];
  }
}