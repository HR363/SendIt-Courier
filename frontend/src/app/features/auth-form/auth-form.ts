import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [NgIf, NgClass, FormsModule],
  templateUrl: './auth-form.html',
  styleUrls: ['./auth-form.css']
})
export class AuthFormComponent implements OnInit {
  rightPanelActive = false;
  mode: 'signin' | 'signup' | 'verify' = 'signin';
  verificationEmail = '';
  verificationCode = '';
  // Dummy user store
  users: Array<{ email: string; password: string; firstName: string; lastName: string; phone: string; isEmailVerified: boolean; code: string; role: string }> = [
    {
      email: 'user@example.com',
      password: 'userpass',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      isEmailVerified: true,
      code: '',
      role: 'user',
    },
    {
      email: 'courier@example.com',
      password: 'courierpass',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '2345678901',
      isEmailVerified: true,
      code: '',
      role: 'courier',
    },
    {
      email: 'admin@example.com',
      password: 'adminpass',
      firstName: 'Alice',
      lastName: 'Admin',
      phone: '3456789012',
      isEmailVerified: true,
      code: '',
      role: 'admin',
    },
  ];
  // Form state
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private auth: AuthService // Removed AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const mode = params.get('mode');
      this.rightPanelActive = mode === 'signup';
      if (this.mode !== 'verify') {
        this.mode = mode === 'signup' ? 'signup' : 'signin';
      }
    });
  }

  setPanel(signUp: boolean): void {
    this.rightPanelActive = signUp;
    this.mode = signUp ? 'signup' : 'signin';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { mode: signUp ? 'signup' : 'signin' },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  onSignup(email: string, name?: string, password?: string, phone?: string): void {
    this.loading.set(true);
    this.error.set(null);
    // Split name into first and last
    const [firstName = '', lastName = ''] = (name || '').split(' ');
    // Simulate duplicate email check
    if (this.users.find(u => u.email === email)) {
      this.error.set('Email already in use');
      this.loading.set(false);
      return;
    }
    // Simulate registration and code generation
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.users.push({ email, password: password || '', firstName, lastName, phone: phone || '', isEmailVerified: false, code, role: 'user' });
    this.verificationEmail = email;
    this.mode = 'verify';
    this.loading.set(false);
    // Optionally, show the code for testing
    alert(`Simulated verification code: ${code}`);
  }

  onSignin(email: string, password: string): void {
    this.loading.set(true);
    this.error.set(null);
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      this.error.set('Invalid credentials');
      this.loading.set(false);
      return;
    }
    if (!user.isEmailVerified) {
      this.error.set('Email not verified. Please verify your email before logging in.');
      this.loading.set(false);
      return;
    }
    this.loading.set(false);
    if (user.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (user.role === 'courier') {
      this.router.navigate(['/courier/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  onVerify(): void {
    this.loading.set(true);
    this.error.set(null);
    const user = this.users.find(u => u.email === this.verificationEmail);
    if (!user) {
      this.error.set('User not found');
      this.loading.set(false);
      return;
    }
    if (user.code !== this.verificationCode) {
      this.error.set('Invalid verification code');
      this.loading.set(false);
      return;
    }
    user.isEmailVerified = true;
    user.code = '';
    this.loading.set(false);
    this.setPanel(false); // Go to login
    this.mode = 'signin';
    alert('Email verified! You can now log in.');
  }
}
