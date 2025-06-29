// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  userName: string;
  email: string;
}

export interface RegistrationRequest {
  userName: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  userName: string;
  email: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiBase = 'https://app-squadsync.azurewebsites.net/api/auth';
  private userKey = 'user';

  private isLoggedInSubject = new BehaviorSubject<boolean>(
    this.hasStoredUser()
  );
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasStoredUser(): boolean {
    return !!localStorage.getItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return this.hasStoredUser();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return new Observable((observer) => {
      this.http
        .post<LoginResponse>(`${this.apiBase}/login`, request)
        .subscribe({
          next: (user) => {
            this.storeUser(user);
            this.isLoggedInSubject.next(true);
            observer.next(user);
            observer.complete();
          },
          error: (err) => {
            this.isLoggedInSubject.next(false);
            observer.error(err);
          },
        });
    });
  }

  register(request: RegistrationRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiBase}/register`, request);
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
    this.isLoggedInSubject.next(false);
  }

  storeUser(user: LoginResponse | UserResponse): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.isLoggedInSubject.next(true);
  }

  getStoredUser(): LoginResponse | UserResponse | null {
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : null;
  }
}
