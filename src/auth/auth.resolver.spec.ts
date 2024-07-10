import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/user.entity';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { APP_GUARD } from '@nestjs/core';
import { GqlAuthGuard } from './gql-auth.guard';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: APP_GUARD,
          useClass: GqlAuthGuard,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getUserFromToken', () => {
    it('should return a user based on token', async () => {
      const email = faker.internet.email();
      const user: User = {
        id: uuidv4(),
        email,
        password: faker.internet.password(),
        isVerified: true,
        isActive: true,
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        createdAt: new Date(),
        updatedAt: new Date(),
        emailToLowerCase: jest.fn(),
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);

      const result = await resolver.getUserFromToken(email);

      expect(result).toEqual(user);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
    });

    it('should return null if user is not found', async () => {
      const email = faker.internet.email();

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);

      const result = await resolver.getUserFromToken(email);

      expect(result).toBeNull();
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('authenticate', () => {
    it('should return tokens if authentication is successful', async () => {
      const loginUserDto: LoginUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const tokens = {
        user: {
          id: uuidv4(),
          email: loginUserDto.email,
        },
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(tokens);

      const result = await resolver.authenticate(loginUserDto);

      expect(result).toEqual({
        ...tokens,
        status: 200,
        message: 'User authenticated successfully',
      });
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });
  });

  describe('register', () => {
    it('should return user if registration is successful', async () => {
      const password = faker.internet.password();
      const createUserDto: CreateUserDto = {
        email: faker.internet.email(),
        password: password,
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
      };

      const user: User = {
        id: uuidv4(),
        email: createUserDto.email.toLowerCase().trim(),
        password: password,
        isActive: true,
        isVerified: false,
        firstname: createUserDto.firstname,
        lastname: createUserDto.lastname,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailToLowerCase: jest.fn(),
      };

      jest.spyOn(authService, 'register').mockResolvedValue(user);

      const result = await resolver.register(createUserDto);

      expect(result).toEqual({
        ...user,
        token: 123456,
        status: 201,
        message: 'User created successfully',
      });
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });
});
