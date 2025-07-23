import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    // Simple fallback: use alert. Replace with a real toast in production.
    alert(`${type.toUpperCase()}: ${message}`);
  }
}
