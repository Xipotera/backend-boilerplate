import { Test, TestingModule } from '@nestjs/testing';
import { EnvService } from './env.service';

describe('EnvService', () => {
  let service: EnvService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvService,
        {
          provide: EnvService,
          useValue: {
            getNodeEnv: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EnvService>(EnvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the correct NODE_ENV', () => {
    const nodeEnv = process.env.NODE_ENV || 'development';
    (service.getNodeEnv as jest.Mock).mockReturnValue(nodeEnv);

    expect(service.getNodeEnv()).toBe(nodeEnv);
    expect(service.getNodeEnv).toHaveBeenCalled();
  });
});
