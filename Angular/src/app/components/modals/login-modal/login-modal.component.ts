import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  AuthService,
  LoginRequest,
  LoginResponse,
} from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiLoaderComponent } from '../../../shared/ui/ui-loader/ui-loader.component';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, UiLoaderComponent],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css'],
})
export class LoginModalComponent {
  @Input() isOpen: boolean = false;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() onLogin: EventEmitter<LoginResponse> =
    new EventEmitter<LoginResponse>();

  email: string = '';
  password: string = '';

  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.isLoading = true;

    const credentials: LoginRequest = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: (user: LoginResponse) => {
        this.message = `Přihlášení úspěšné. Vítej zpět, ${user.userName}!`;
        this.messageType = 'success';
        this.authService.storeUser(user);
        this.onLogin.emit(user);
        this.clearForm();
        setTimeout(() => this.closeModal(), 2000);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Chyba při přihlášení:', error);
        this.message = 'Přihlášení selhalo. Zkontroluj e-mail nebo heslo.';
        this.messageType = 'error';
        this.isLoading = false;
        this.clearForm();
      },
    });
  }

  clearForm(): void {
    this.email = '';
    this.password = '';
  }

  closeModal(): void {
    this.message = null;
    this.messageType = null;
    this.onClose.emit();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
