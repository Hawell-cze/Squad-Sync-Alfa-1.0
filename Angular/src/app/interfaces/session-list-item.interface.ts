export interface SessionListItem {
  token: string;
  sessionName: string;
  commanderUserName: string;
  createdAt: string;
  userCount: number; // bude dopočten voláním /session-users/session/{token}
}
