import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { EmailTokenVerificationEntity } from '../token/emailTokenVerification.entity';
import { Configuration } from '../utils';
import { SessionService } from '../session/session.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailTokenVerificationEntity]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: Configuration.jwt.token.secret,
      signOptions: { expiresIn: Configuration.jwt.token.expiresIn },
    }),
  ],
  providers: [AuthService, AuthResolver, SessionService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
