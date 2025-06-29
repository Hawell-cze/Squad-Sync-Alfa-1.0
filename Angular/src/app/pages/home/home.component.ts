import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginModalComponent } from '../../components/modals/login-modal/login-modal.component';
import { RegisterModalComponent } from '../../components/modals/register-modal/register-modal.component';
import { AuthService, LoginResponse } from '../../services/auth.service';
import {
  SessionResponse,
  SessionService,
} from '../../services/session.service';
import { Observable } from 'rxjs';
import { CreateSessionModalComponent } from '../../components/modals/create-session-modal/create-session-modal.component';
import { SessionListModalComponent } from '../../components/modals/session-list-modal/session-list-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LoginModalComponent,
    RegisterModalComponent,
    CreateSessionModalComponent,
    SessionListModalComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  token: string = '';
  showButton: boolean = false;
  showError: boolean = false;
  isLoginOpen: boolean = false;
  isRegisterOpen: boolean = false;
  isCreateSessionOpen: boolean = false;

  isLoggedIn$!: Observable<boolean>;
  user: LoginResponse | null = null;

  isSessionListOpen: boolean = false;
  sessionListMode: 'all' | 'user' | 'commander' = 'all';

  showFormatError: boolean = false;
  showTokenNotFound: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.user = this.authService.getStoredUser();
  }

  validateToken(value: string): boolean {
    const tokenRegex = /^[A-Z0-9]{7}$/;
    return tokenRegex.test(value.trim().toUpperCase());
  }

  handleChange(event: any): void {
    const value = event.target.value.toUpperCase();
    this.token = value;
    this.showTokenNotFound = false; // resetuje chybu po nové změně

    if (this.validateToken(value)) {
      this.showFormatError = false;
      this.showButton = true;
    } else {
      this.showFormatError = value.length > 0;
      this.showButton = false;
    }
  }

  handleSubmit(): void {
    if (!this.validateToken(this.token)) {
      this.showFormatError = true;
      this.showTokenNotFound = false;
      this.showButton = false;
      return;
    }

    this.showFormatError = false;
    this.showTokenNotFound = false;
    this.showButton = false;

    const user = this.authService.getStoredUser();
    if (!user) {
      // otevře login modal a zastaví submit
      this.openLoginModal(new Event('manual'));
      return;
    }

    this.sessionService.getSessionMembers(this.token).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.router.navigate(['/commander', this.token]);
        } else {
          this.showTokenNotFound = true;
        }
      },
      error: () => {
        this.showTokenNotFound = true;
      },
    });
  }

  handleLogOut(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.user = null;
  }

  openLoginModal(event: Event): void {
    event.preventDefault();
    this.isLoginOpen = true;
  }

  openRegisterModal(event: Event): void {
    event.preventDefault();
    this.isRegisterOpen = true;
  }

  openSessionModal(event: Event): void {
    event.preventDefault();
    this.isCreateSessionOpen = true;
  }

  openSessionList(mode: 'all' | 'user' | 'commander', event: Event): void {
    event.preventDefault();
    this.sessionListMode = mode;
    this.isSessionListOpen = true;
  }

  closeLoginModal(): void {
    this.isLoginOpen = false;
  }

  closeRegisterModal(): void {
    this.isRegisterOpen = false;
  }

  onLogin(user: LoginResponse): void {
    this.user = user;
  }

  createSession(event: Event): void {
    event.preventDefault();
    if (!this.user) return;

    const payload = {
      sessionName: 'Nová session', // později dynamic input
      commanderId: this.user.id,
    };

    this.sessionService.createSession(payload).subscribe({
      next: (session: SessionResponse) => {
        this.token = session.token;
        this.showButton = true;
        this.showError = false;
      },
      error: (err) => {
        console.error('Chyba při vytváření session:', err);
      },
    });
  }

  // Pomocná metoda – náhodný token pro demo
  private generateSessionToken(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 7; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }
}
