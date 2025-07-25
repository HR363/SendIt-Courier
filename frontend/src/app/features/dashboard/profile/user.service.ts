import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  photo?: string;
  profileComplete?: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/users/profile'; // Adjust as needed
  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  user$ = this.userSubject.asObservable();
  userRole$ = this.user$.pipe(map(user => user?.role || null));

  constructor(private http: HttpClient) {
    this.fetchProfile().subscribe();
  }

  fetchProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl).pipe(
      tap(profile => this.userSubject.next(profile))
    );
  }

  getProfile(): Observable<UserProfile | null> {
    // Always return the cached value
    return this.user$;
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl, data).pipe(
      tap(profile => this.userSubject.next(profile))
    );
  }

  // Add more methods as needed (change password, upload photo, etc)
}
