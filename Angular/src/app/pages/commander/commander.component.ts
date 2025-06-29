import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

import { AuthService, LoginResponse } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import {
  SessionUser,
  UserSessionStatus,
} from '../../interfaces/session-user.interface';

import { CommanderHeaderComponent } from '../../components/commander-header/commander-header.component';
import { UserShipCardComponent } from '../../components/user-ship-card/user-ship-card.component';
import { UiLoaderComponent } from '../../shared/ui/ui-loader/ui-loader.component';

@Component({
  selector: 'app-commander',
  standalone: true,
  imports: [
    CommonModule,
    CommanderHeaderComponent,
    UserShipCardComponent,
    UiLoaderComponent,
  ],
  templateUrl: './commander.component.html',
  styleUrls: ['./commander.component.css'],
})
export class CommanderComponent implements OnInit, OnDestroy {
  members: UserSessionStatus[] = [];
  pendingUsers: SessionUser[] = [];

  sessionToken: string = '';
  user: LoginResponse | null = null;
  isLoading: boolean = true;
  isCommander: boolean = false;

  pollingSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getStoredUser();

    if (!this.user) {
      this.router.navigate(['/home']);
      return;
    }

    this.route.paramMap.subscribe((params) => {
      const token = params.get('token');

      if (!token) {
        console.error('Token nebyl nalezen v URL');
        this.router.navigate(['/home']);
        return;
      }

      this.sessionToken = token;
      this.isLoading = true;

      this.refreshData(true); // první načtení včetně spinneru

      this.pollingSubscription = interval(5000).subscribe(() => {
        this.refreshData(false); // průběžné obnovování bez spinneru
      });
    });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  refreshData(showLoader: boolean = false): void {
    if (showLoader) this.isLoading = true;

    this.fetchMembers(showLoader);
    if (this.isCommander) {
      this.fetchPendingUsers(); // nemusíme mít spinner
    }
  }

  private fetchMembers(showLoader: boolean = false): void {
    if (showLoader) this.isLoading = true;

    this.sessionService.getSessionMembers(this.sessionToken).subscribe({
      next: (data) => {
        this.members = data;
        if (showLoader) this.isLoading = false;
      },
      error: (err) => {
        console.error('Chyba při načítání členů:', err);
        if (showLoader) this.isLoading = false;
      },
    });

    this.sessionService.getAllSessions().subscribe({
      next: (sessions) => {
        const current = sessions.find((s) => s.token === this.sessionToken);
        if (current) {
          this.isCommander = current.commanderUserName === this.user?.userName;
        }
      },
      error: (err) => console.error('Chyba při ověřování velitele:', err),
    });
  }

  private fetchPendingUsers(): void {
    this.sessionService.getSessionUsers(this.sessionToken).subscribe({
      next: (users) => {
        this.pendingUsers = users.filter((u) => u.status === 'PENDING');
      },
      error: (err) => console.error('Chyba při načítání žádostí:', err),
    });
  }

  approveUser(user: SessionUser): void {
    this.updateUserStatus(user.userId, 'JOINED');
  }

  rejectUser(user: SessionUser): void {
    this.updateUserStatus(user.userId, 'KICKED');
  }

  private updateUserStatus(userId: number, status: 'JOINED' | 'KICKED'): void {
    this.sessionService
      .updateSessionUserStatus(userId, this.sessionToken, status)
      .subscribe({
        next: () => this.refreshData(),
        error: (err) => console.error(`Chyba při změně statusu:`, err),
      });
  }

  onCardClick(member: UserSessionStatus): void {
    alert(`${member.nickname} byla kliknuta!`);
  }

  get activeCount(): number {
    return this.members.filter((m) => m.status === 'JOINED').length;
  }

  get enrouteCount(): number {
    return this.members.filter((m) => m.status === 'PENDING').length;
  }

  get destroyedCount(): number {
    return this.members.filter((m) => m.status === 'KICKED').length;
  }

  get visibleMembers(): UserSessionStatus[] {
    return this.members.filter((m) => m.status === 'JOINED');
  }
}
