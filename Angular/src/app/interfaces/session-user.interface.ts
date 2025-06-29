// src/app/interfaces/session-user.interface.ts
export interface UserSessionStatus {
  id: number;
  nickname: string;
  status: 'active' | 'enroute' | 'destroyed' | 'JOINED' | 'PENDING' | 'KICKED';
  shipType: string;
  joinedAt: string;
}

export interface SessionUser {
  id: number;
  userId: number;
  userName: string;
  sessionToken: string;
  status: 'PENDING' | 'JOINED' | 'KICKED';
  changedAt: string; // nebo Date, pokud parsuješ
}
