import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { LoginUserInputDto } from '../users/dto/login-user.input.dto';
import { IAuthPayload } from './dto/auth-payload-dto';
import { ApolloError } from 'apollo-server-express';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTokenVerificationEntity } from '../token/emailTokenVerification.entity';
import { omit } from 'lodash';
import { Configuration } from '../utils';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionService: SessionService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(EmailTokenVerificationEntity)
    private emailTokenVerificationRepository: Repository<EmailTokenVerificationEntity>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return omit(user, ['password']);
    }
    return null;
  }

  async login(dto: LoginUserInputDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new ApolloError('Invalid credentials', 'invalid-credentials');
    }

    if (user && user.isVerified) {
      if (user.isActive) {
        const authpayload: IAuthPayload = {
          sub: user.id,
        };
        const token = await this.getTokens(authpayload);
        // Check if there is an existing session
        const existingSession = this.sessionService.getActiveSession(
          user.userId,
        );
        if (
          existingSession &&
          !this.sessionService.isSessionActive(
            user.userId,
            existingSession.token,
          )
        ) {
          this.sessionService.clearSession(user.userId); // Clear expired session
        }

        // Set new session
        if (
          !this.sessionService.setActiveSession(user.userId, token.access_token)
        ) {
          throw new UnauthorizedException(
            'Another session for the same user is already active.',
          );
        }
        return {
          user,
          access_token: token.access_token,
          refresh_token: token.refresh_token,
        };
      } else {
        throw new ApolloError('Account unavailable', 'account-unavailable');
      }
    }
    throw new ApolloError(
      'Check inbox to validate email',
      'check-inbox-to-validate-email',
    );
  }

  public async getTokens(payload: IAuthPayload) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = jwt.sign(
      payload,
      Configuration.jwt.refreshToken.secret,
      {
        expiresIn: Configuration.jwt.refreshToken.expiresIn,
      },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(user: Partial<User>) {
    return await this.usersService.register(user);
  }

  async verifyEmailToken(token: string) {
    const emailTokenVerification =
      await this.emailTokenVerificationRepository.findOne({
        where: {
          token,
        },
      });
    if (emailTokenVerification && emailTokenVerification.email) {
      const user = await this.usersRepository.findOne({
        where: { email: emailTokenVerification.email },
      });
      if (user) {
        user.isVerified = true;
        const savedUser = await this.usersRepository.save(user);
        await this.emailTokenVerificationRepository.delete({
          id: emailTokenVerification.id,
        });
        return !!savedUser;
      }
    } else {
      throw new ForbiddenException('email-code-invalid');
    }
  }
}
