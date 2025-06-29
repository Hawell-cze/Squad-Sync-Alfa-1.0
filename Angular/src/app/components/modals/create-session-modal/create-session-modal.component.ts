import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../../services/session.service';
import { SessionResponse } from '../../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-session-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-session-modal.component.html',
  styleUrls: ['./create-session-modal.component.css'],
})
export class CreateSessionModalComponent {
  @Input() isOpen: boolean = false;
  @Input() commanderId!: number;
  @Output() onClose = new EventEmitter<void>();

  sessionName: string = '';
  sessionResult: SessionResponse | null = null;
  error: string | null = null;

  constructor(private sessionService: SessionService, private router: Router) {}

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (!this.sessionName.trim()) return;

    this.sessionService
      .createSession({
        sessionName: this.sessionName.trim(),
        commanderId: this.commanderId,
      })
      .subscribe({
        next: (session) => {
          this.sessionResult = session;
          this.error = null;
        },
        error: (err) => {
          console.log(this.sessionName.trim());
          console.log(this.commanderId);
          console.error(err);
          this.error = 'Chyba při vytváření session.';
        },
      });
  }

  copyToken(): void {
    if (this.sessionResult?.token) {
      navigator.clipboard.writeText(this.sessionResult.token);
    }
  }

  enterCommander(): void {
    this.onClose.emit(); // Zavřeme modal
    if (this.sessionResult?.token) {
      this.router.navigate(['/commander', this.sessionResult.token]);
    }
  }

  close(): void {
    this.onClose.emit();
    this.sessionResult = null;
    this.sessionName = '';
    this.error = null;
  }
}
