import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  // Set up the testing module before each test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          // Provide a mock repository for the User entity
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    // Get instances of the service and repository from the testing module
    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a user', async () => {
    // Create a mock user object
    const user: Partial<User> = {
      id: uuidv4(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      isVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the repository create and save methods
    (repository.create as jest.Mock).mockReturnValue(user);
    (repository.save as jest.Mock).mockResolvedValue(user);

    // Define input for the createUser method
    const createUserInput = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
      isActive: true,
    };

    // Call the register method and store the result
    const result = await service.register(createUserInput);

    // Remove the password property for comparison
    delete user.password;
    delete result.password;

    // Assert that the result matches the mock user
    expect(result).toEqual(user);
    // Verify that the repository create method was called with the correct input
    expect(repository.create).toHaveBeenCalledWith(createUserInput);
    // Verify that the repository save method was called with the correct user
    expect(repository.save).toHaveBeenCalledWith(user);
  });

  it('should find a user by email', async () => {
    // Generate a random email and create a mock user object
    const email = faker.internet.email();
    const user: Partial<User> = {
      id: uuidv4(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email,
      isVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the repository findOne method to return the mock user
    (repository.findOne as jest.Mock).mockResolvedValue(user);

    // Call the findOneByEmail method with the random email
    const result = await service.findOneByEmail(email);

    // Assert that the result matches the mock user
    expect(result).toEqual(user);
    // Verify that the repository findOne method was called with the correct parameter
    expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
  });
});
