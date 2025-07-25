import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

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
  // Form state
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
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
    this.auth.signup({
      name: name || '',
      email,
      password: password || '',
      phone: phone || ''
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.verificationEmail = email;
        this.mode = 'verify';
        // Optionally, auto-send code
        this.auth.sendVerificationCode(email).subscribe();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Signup failed');
      }
    });
  }

  onSignin(email: string, password: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.auth.login({ email, password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        // Redirect based on user role
        const role = res.user?.role;
        if (role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'COURIER_AGENT') {
          this.router.navigate(['/courier/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Login failed');
      }
    });
  }

  onVerify(): void {
    this.loading.set(true);
    this.error.set(null);
    this.auth.verifyEmail(this.verificationEmail, this.verificationCode).subscribe({
      next: () => {
        this.loading.set(false);
        this.setPanel(false); // Go to login
        this.mode = 'signin';
        alert('Email verified! You can now log in.');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Verification failed');
      }
    });
  }
}
