import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // Computed field for display
  email: string;
  phone: string;
  role: string;
  profilePhoto?: string;
  photo?: string; // Alias for profilePhoto for backward compatibility
  profileComplete?: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/users/profile'; // Adjust as needed
  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  user$ = this.userSubject.asObservable();
  userRole$ = this.user$.pipe(map(user => user?.role || null));

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Only fetch profile if user is logged in
    if (this.isLoggedIn()) {
      this.fetchProfile().subscribe();
    }

    // Listen for login success events
    this.authService.loginSuccess$.subscribe(() => {
      this.fetchProfile().subscribe();
    });
  }

  private isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  fetchProfile(): Observable<UserProfile> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(backendProfile => this.mapBackendToFrontend(backendProfile)),
      tap(profile => this.userSubject.next(profile))
    );
  }

  private mapBackendToFrontend(backendProfile: any): UserProfile {
    return {
      id: backendProfile.id,
      firstName: backendProfile.firstName,
      lastName: backendProfile.lastName,
      name: `${backendProfile.firstName} ${backendProfile.lastName}`.trim(),
      email: backendProfile.email,
      phone: backendProfile.phone,
      role: backendProfile.role,
      profilePhoto: backendProfile.profilePhoto,
      photo: backendProfile.profilePhoto, // Alias for backward compatibility
      profileComplete: 85 // Mock value
    };
  }

  getProfile(): Observable<UserProfile | null> {
    // Always return the cached value
    return this.user$;
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<any>(this.apiUrl, data).pipe(
      map(backendProfile => this.mapBackendToFrontend(backendProfile)),
      tap(profile => this.userSubject.next(profile))
    );
  }

  // Method to initialize profile after login
  initializeProfile(): void {
    if (this.isLoggedIn()) {
      this.fetchProfile().subscribe();
    }
  }

  // Method to clear profile on logout
  clearProfile(): void {
    this.userSubject.next(null);
  }

  // Add more methods as needed (change password, upload photo, etc)
}
