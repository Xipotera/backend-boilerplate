import { Module } from '@nestjs/common';
import { TokenResolver } from './token.resolver';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { EmailTokenVerificationEntity } from './emailTokenVerification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailTokenVerificationEntity])],
  providers: [TokenResolver, TokenService],
})
export class TokenModule {}
