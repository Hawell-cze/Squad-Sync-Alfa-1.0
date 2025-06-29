import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SessionService,
  UserToSession,
} from '../../../services/session.service';
import { SessionListItem } from '../../../interfaces/session-list-item.interface';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UiLoaderComponent } from '../../../shared/ui/ui-loader/ui-loader.component';

@Component({
  selector: 'app-session-list-modal',
  standalone: true,
  imports: [CommonModule, UiLoaderComponent],
  templateUrl: './session-list-modal.component.html',
  styleUrls: ['./session-list-modal.component.css'],
})
export class SessionListModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() mode!: 'all' | 'user' | 'commander';
  @Input() userId!: number;
  @Output() onClose = new EventEmitter<void>();

  sessions: SessionListItem[] = [];
  isLoading: boolean = false;

  isJoining: boolean = false;
  joinStatusMessage: string = '';
  joinCheckInterval?: any;
  pendingToken: string | null = null;

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen && this.mode) {
      this.loadSessions();
    }
  }

  loadSessions(): void {
    if (!this.userId && this.mode !== 'all') {
      this.sessions = [];
      return;
    }

    this.sessions = [];
    this.isLoading = true;

    const loader = {
      all: this.sessionService.getAllSessions(),
      user: this.sessionService.getSessionsByUser(this.userId),
      commander: this.sessionService.getSessionsByCommander(this.userId),
    };

    loader[this.mode]
      .pipe(
        finalize(() => {
          this.isLoading = false; // ← vždy vypne loader
        })
      )
      .subscribe({
        next: (data) => {
          this.sessions = data || [];
        },
        error: (err) => {
          console.error('Chyba při načítání session:', err);
          this.sessions = [];
        },
      });
  }

  goToCommander(token: string): void {
    this.pendingToken = token; // ← tady si ho uložíš
    this.isJoining = true;
    this.joinStatusMessage = '⏳ Čeká na schválení velitelem...';

    const user: UserToSession = {
      token: token,
      userId: this.userId,
      status: 'PENDING',
    };

    this.sessionService.getSessionUsers(token).subscribe((users) => {
      const existing = users.find((u) => u.userId === this.userId);

      if (!existing) {
        // Neexistuje = zavoláme POST
        const user: UserToSession = {
          token,
          userId: this.userId,
          status: 'PENDING',
        };

        this.sessionService.setUserToSession(user).subscribe({
          next: () => {
            this.pendingToken = token;
            this.startJoinPolling(token);
          },
        });
      } else {
        // Už je ve session = PUT změna statusu zpět na PENDING
        this.sessionService
          .updateSessionUserStatus(this.userId, token, 'PENDING')
          .subscribe({
            next: () => {
              this.pendingToken = token;
              this.startJoinPolling(token);
            },
          });
      }

      this.isJoining = true;
      this.joinStatusMessage = '⏳ Čeká na schválení velitelem...';
    });
  }

  startJoinPolling(token: string): void {
    this.pendingToken = token;

    this.joinCheckInterval = setInterval(() => {
      this.sessionService.getSessionUsers(token).subscribe({
        next: (users) => {
          const current = users.find((u) => u.userId === this.userId);
          if (!current) {
            this.stopJoinPolling('❌ Nepovolený přístup.');
          } else if (current.status === 'KICKED') {
            this.stopJoinPolling('🚫 Přístup byl odepřen velitelem.');
          } else if (current.status === 'JOINED') {
            this.stopJoinPolling(); // úspěch → navigace
            this.closeModal();
            this.router.navigate(['/commander', token]);
          }
        },
        error: (err) => {
          this.stopJoinPolling('⚠️ Chyba při ověřování přístupu.');
          console.error('Chyba při kontrolování statusu:', err);
        },
      });
    }, 3000); // každé 3s
  }

  cancelJoin(): void {
    this.sessionService
      .updateSessionUserStatus(this.userId, this.pendingToken!, 'CANCELED')
      .subscribe({
        next: () => {
          this.stopJoinPolling('Žádost byla zrušena');
        },
        error: () => {
          this.stopJoinPolling('Nepodařilo se zrušit žádost');
        },
      });
  }

  stopJoinPolling(message: string = ''): void {
    this.isJoining = false;
    this.joinStatusMessage = message;
    clearInterval(this.joinCheckInterval);
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  closeModal(): void {
    this.onClose.emit();
  }
}
