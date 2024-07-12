import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoggedUserOutput } from '../users/dto/logged-user.output.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserInputDto } from '../users/dto/login-user.input.dto';
import { RegisterResponse } from '../users/dto/register-response.dto';
import { UseGuards } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { UserResponse } from '../users/dto/user-response.dto';
import { GraphqlResponse } from '../global/graphql-response.dto';
import { JwtAuthGuard } from './JwtAuth.guard';
import { CurrentUser } from './current-user.decorator';
import { SessionService } from '../session/session.service';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private sessionService: SessionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => UserResponse, { nullable: true })
  public async getUserFromToken(
    @CurrentUser('user') user: User,
  ): Promise<UserResponse | null> {
    const userFromToken = await this.usersService.getUserFromToken(user.id);
    if (!userFromToken) {
      return {
        ...userFromToken,
        status: 404,
        message: 'User not found',
      };
    }
    return {
      ...userFromToken,
      status: 200,
      message: 'User found',
    };
  }

  @Mutation(() => LoggedUserOutput)
  async authenticate(@Args('loginUserInput') loginUserDto: LoginUserInputDto) {
    const { access_token, refresh_token } =
      await this.authService.login(loginUserDto);
    return {
      access_token,
      refresh_token,
      status: 200,
      message: 'User authenticated successfully',
    };
  }

  @Mutation(() => RegisterResponse)
  async register(@Args('createUserInput') createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return {
      ...user,
      status: 201,
      message: 'User created successfully',
    };
  }

  @Mutation(() => GraphqlResponse)
  async verifyEmailToken(@Args('token') token: string) {
    const result = await this.authService.verifyEmailToken(token);
    if (result === null) {
      return {
        status: 400,
        message: 'Invalid email token verification',
      };
    }
    return {
      status: 200,
      message: 'User email successfully verified',
    };
  }

  @Mutation(() => Boolean)
  async logout(@CurrentUser('user') user: User) {
    this.sessionService.clearSession(user.id);
    return true;
  }
}
