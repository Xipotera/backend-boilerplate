import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { IAuthPayload } from './dto/auth-payload-dto';
import { ApolloError } from 'apollo-server-express';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(dto: LoginUserDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new ApolloError('Invalid credentials', 'invalid-credentials');
    }

    if (user && user.isVerified) {
      if (user.isActive) {
        // create authpayload
        const authpayload: IAuthPayload = {
          id: user.id,
        };
        const token = await this.getTokens(authpayload);

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
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(user: Partial<User>) {
    return await this.usersService.register(user);
  }

  // async verifyEmailToken(token: string) {
  //   const emailTokenVerification =
  //     await this.emailTokenVerificationRepository.findOne({
  //       where: {
  //         token,
  //       },
  //     });
  //   if (emailTokenVerification && emailTokenVerification.email) {
  //     const user = await this.usersRepository.findOne({
  //       where: { email: emailTokenVerification.email },
  //     });
  //     if (user) {
  //       user.isVerified = true;
  //       const savedUser = await this.usersRepository.save(user);
  //       await this.emailTokenVerificationRepository.delete({
  //         id: emailTokenVerification.id,
  //       });
  //       return !!savedUser;
  //     }
  //   } else {
  //     throw new ForbiddenException('EMAIL_CODE_INVALID');
  //   }
  // }
}
