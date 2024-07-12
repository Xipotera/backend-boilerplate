import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SessionService } from '../session/session.service';

@Injectable()
export class SingleUserGuard implements CanActivate {
  constructor(private sessionService: SessionService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { user, headers } = ctx.getContext().req;

    if (!user || !user.id) {
      throw new UnauthorizedException('User information is missing.');
    }

    const authorizationHeader = headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    const token = authorizationHeader.split(' ')[1]; // Extract token from Authorization header

    const session = this.sessionService.getActiveSession(user.id);
    if (session) {
      const currentTime = new Date().getTime();
      const sessionTime = new Date(session.timestamp).getTime();
      if (currentTime - sessionTime >= this.sessionService.SESSION_TIMEOUT) {
        this.sessionService.clearSession(user.id); // Clear expired session
      }
    }

    if (!this.sessionService.setActiveSession(user.id, token)) {
      throw new UnauthorizedException(
        'Another session for the same user is already active.',
      );
    }

    return true;
  }
}
