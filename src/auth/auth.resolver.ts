import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from '../users/dto/login-response.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { RegisterResponse } from '../users/dto/register-response.dto';
import * as process from 'node:process';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { nullable: true })
  public async getUserFromToken(
    @Args('token') token: string,
  ): Promise<User | null> {
    return await this.usersService.findOneByEmail(token);
  }

  @Mutation(() => LoginResponse)
  async authenticate(@Args('loginUserInput') loginUserDto: LoginUserDto) {
    const tokens = await this.authService.login(loginUserDto);
    return {
      ...tokens,
      status: 200,
      message: 'User authenticated successfully',
    };
  }

  @Mutation(() => RegisterResponse)
  async register(@Args('createUserInput') createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return {
      ...user,
      token: process.env.NODE_ENV !== 'prod' ? 123456 : undefined,
      status: 201,
      message: 'User created successfully',
    };
  }
}
