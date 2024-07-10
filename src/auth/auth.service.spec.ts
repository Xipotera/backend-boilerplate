import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { IAuthPayload } from './dto/auth-payload-dto';
import { ApolloError } from 'apollo-server-express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user data without password if validation is successful', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const hashedPassword = await bcrypt.hash(password, 10);

      const user: Partial<User> = {
        id: uuidv4(),
        email,
        password: hashedPassword,
        isVerified: true,
        isActive: true,
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the usersService.findOneByEmail method
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(user);

      // Mock the bcrypt.compare method
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await authService.validateUser(email, password);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
        isActive: user.isActive,
        firstname: user.firstname,
        lastname: user.lastname,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });

    it('should return null if validation fails', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(null);

      const result = await authService.validateUser(email, password);

      expect(result).toBeNull();
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('login', () => {
    it('should return user and tokens if login is successful', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const hashedPassword = await bcrypt.hash(password, 10);
      const user: Partial<User> = {
        id: uuidv4(),
        email,
        password: hashedPassword,
        isVerified: true,
        isActive: true,
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      jest.spyOn(authService, 'getTokens').mockResolvedValue({
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
      });

      const dto: LoginUserDto = { email, password };
      const result = await authService.login(dto);

      expect(result).toEqual({
        user,
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
      });
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.getTokens).toHaveBeenCalledWith({ id: user.id });
    });

    it('should throw an ApolloError if credentials are invalid', async () => {
      const dto: LoginUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toThrow(ApolloError);
      await expect(authService.login(dto)).rejects.toHaveProperty(
        'extensions.code',
        'invalid-credentials',
      );
    });

    it('should throw an ApolloError if user is not verified', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const hashedPassword = await bcrypt.hash(password, 10);
      const user: Partial<User> = {
        id: uuidv4(),
        email,
        password: hashedPassword,
        isVerified: false,
        isActive: true,
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      const dto: LoginUserDto = { email, password };

      await expect(authService.login(dto)).rejects.toThrow(ApolloError);
      await expect(authService.login(dto)).rejects.toHaveProperty(
        'extensions.code',
        'check-inbox-to-validate-email',
      );
    });

    it('should throw an ApolloError if user is not active', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const hashedPassword = await bcrypt.hash(password, 10);
      const user: Partial<User> = {
        id: uuidv4(),
        email,
        password: hashedPassword,
        isVerified: true,
        isActive: false,
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      const dto: LoginUserDto = { email, password };

      await expect(authService.login(dto)).rejects.toThrow(ApolloError);
      await expect(authService.login(dto)).rejects.toHaveProperty(
        'extensions.code',
        'account-unavailable',
      );
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const user: Partial<User> = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
      };

      (usersService.register as jest.Mock).mockResolvedValue(user);

      const result = await authService.register(user);

      expect(result).toEqual(user);
      expect(usersService.register).toHaveBeenCalledWith(user);
    });
  });
});
