import { Injectable } from '@nestjs/common';
import { Configuration } from '../utils';

interface UserSession {
  userId: string;
  token: string;
  timestamp: Date;
}

@Injectable()
export class SessionService {
  private activeSessions: Map<string, UserSession> = new Map();
  public readonly SESSION_TIMEOUT = Configuration.sessionTimeout;

  setActiveSession(userId: string, token: string): boolean {
    const existingSession = this.activeSessions.get(userId);
    const currentTime = new Date().getTime();

    if (existingSession) {
      const sessionTime = new Date(existingSession.timestamp).getTime();
      if (
        existingSession.token !== token &&
        currentTime - sessionTime < this.SESSION_TIMEOUT
      ) {
        return false; // Another session for the same user is still within the session timeout
      }
    }

    this.activeSessions.set(userId, { userId, token, timestamp: new Date() });
    return true;
  }

  clearSession(userId: string): void {
    this.activeSessions.delete(userId);
  }

  getActiveSession(userId: string): UserSession | null {
    return this.activeSessions.get(userId) || null;
  }

  isSessionActive(userId: string, token: string): boolean {
    const session = this.activeSessions.get(userId);
    if (!session) {
      return false;
    }
    const currentTime = new Date().getTime();
    const sessionTime = new Date(session.timestamp).getTime();
    return (
      session.token === token &&
      currentTime - sessionTime < this.SESSION_TIMEOUT
    );
  }
}
