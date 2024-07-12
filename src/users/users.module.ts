import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersResolver } from './users.resolver';
import { EmailTokenVerificationEntity } from '../token/emailTokenVerification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailTokenVerificationEntity])],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
