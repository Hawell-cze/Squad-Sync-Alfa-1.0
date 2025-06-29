import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import {
  SessionUser,
  UserSessionStatus,
} from '../interfaces/session-user.interface';
import { SessionListItem } from '../interfaces/session-list-item.interface';

export interface SessionRequest {
  sessionName: string;
  commanderId: number;
}

export interface SessionResponse {
  token: string;
  sessionName: string;
  commanderUserName: string;
  createdAt: string;
}

export interface UserToSession {
  token: string;
  userId: number;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private baseUrl = 'https://app-squadsync.azurewebsites.net/api';

  constructor(private http: HttpClient) {}

  createSession(request: SessionRequest): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(`${this.baseUrl}/sessions`, request);
  }

  /** Všichni hráči s herním stavem (JOINED, ACTIVE, ENROUTE…) */
  getSessionMembers(sessionToken: string): Observable<UserSessionStatus[]> {
    return this.http.get<UserSessionStatus[]>(
      `${this.baseUrl}/session-users/session/${sessionToken}`
    );
  }

  /** Všichni uživatelé včetně PENDING (pro schvalování) */
  getSessionUsers(sessionToken: string): Observable<SessionUser[]> {
    return this.http.get<SessionUser[]>(
      `${this.baseUrl}/session-users/session/${sessionToken}`
    );
  }

  /** Připojení uživatele k relaci */
  setUserToSession(user: UserToSession): Observable<any> {
    const params = new HttpParams()
      .set('userId', user.userId.toString())
      .set('sessionToken', user.token)
      .set('status', user.status);

    return this.http.post(`${this.baseUrl}/session-users`, null, { params });
  }

  /** Změna statusu uživatele v session (JOINED/KICKED) */
  updateSessionUserStatus(
    userId: number,
    sessionToken: string,
    status: 'JOINED' | 'KICKED' | 'PENDING' | 'CANCELED'
  ): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('sessionToken', sessionToken)
      .set('status', status);

    return this.http.put(`${this.baseUrl}/session-users/update-status`, null, {
      params,
    });
  }

  /** Seznam všech sessions + počet lidí */
  getAllSessions(): Observable<SessionListItem[]> {
    return this.http
      .get<Omit<SessionListItem, 'userCount'>[]>(`${this.baseUrl}/sessions`)
      .pipe(
        switchMap((sessions) =>
          forkJoin(
            sessions.map((s) =>
              this.getUserCountForSession(s.token).pipe(
                map((count) => ({ ...s, userCount: count }))
              )
            )
          )
        )
      );
  }

  getSessionsByUser(userId: number): Observable<SessionListItem[]> {
    return this.http
      .get<Omit<SessionListItem, 'userCount'>[]>(
        `${this.baseUrl}/sessions/user/${userId}`
      )
      .pipe(
        switchMap((sessions) =>
          forkJoin(
            sessions.map((s) =>
              this.getUserCountForSession(s.token).pipe(
                map((count) => ({ ...s, userCount: count }))
              )
            )
          )
        )
      );
  }

  getSessionsByCommander(commanderId: number): Observable<SessionListItem[]> {
    return this.http
      .get<Omit<SessionListItem, 'userCount'>[]>(
        `${this.baseUrl}/sessions/commander/${commanderId}`
      )
      .pipe(
        switchMap((sessions) =>
          forkJoin(
            sessions.map((s) =>
              this.getUserCountForSession(s.token).pipe(
                map((count) => ({ ...s, userCount: count }))
              )
            )
          )
        )
      );
  }

  private getUserCountForSession(token: string): Observable<number> {
    return this.http
      .get<any[]>(`${this.baseUrl}/session-users/session/${token}`)
      .pipe(map((users) => users.length));
  }
}
