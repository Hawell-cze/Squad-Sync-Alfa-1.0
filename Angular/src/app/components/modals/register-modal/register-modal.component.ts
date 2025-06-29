import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import {
  AuthService,
  LoginResponse,
  RegistrationRequest,
} from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiLoaderComponent } from '../../../shared/ui/ui-loader/ui-loader.component';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, UiLoaderComponent],
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css'],
})
export class RegisterModalComponent {
  @Input() isOpen: boolean = false;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() onLogin = new EventEmitter<LoginResponse>();

  username: string = '';
  email: string = '';
  password: string = '';

  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.isLoading = true;

    const userData: RegistrationRequest = {
      userName: this.username,
      email: this.email,
      password: this.password,
    };

    this.authService.register(userData).subscribe({
      next: (user) => {
        this.message = `Vítej, ${user.userName}! Registrace proběhla úspěšně.`;
        this.messageType = 'success';
        this.authService.storeUser(user);
        this.onLogin.emit(user);
        this.clearForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Chyba při registraci:', error);
        this.message =
          'Registrace selhala. Zkontroluj údaje nebo spojení se serverem.';
        this.messageType = 'error';
        this.isLoading = false;
      },
    });
  }

  clearForm(): void {
    this.username = '';
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
