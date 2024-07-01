import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a user', async () => {
    const user: User = {
      id: uuidv4(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      isVerified: false,
      isActive: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Mock the create and save methods
    (repository.create as jest.Mock).mockReturnValue(user);
    (repository.save as jest.Mock).mockResolvedValue(user);

    const createUserInput = {
      username: user.username,
      email: user.email,
      password: user.password,
    };

    expect(await service.create(createUserInput)).toEqual(user);
    expect(repository.create).toHaveBeenCalledWith(createUserInput);
    expect(repository.save).toHaveBeenCalledWith(user);
  });
});
