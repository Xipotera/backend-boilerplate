import { Test, TestingModule } from '@nestjs/testing';
import { EnvController } from './env.controller';
import { EnvService } from './env.service';

describe('EnvController', () => {
  let controller: EnvController;
  let service: EnvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnvController],
      providers: [
        {
          provide: EnvService,
          useValue: {
            getNodeEnv: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EnvController>(EnvController);
    service = module.get<EnvService>(EnvService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the correct NODE_ENV', () => {
    const nodeEnv = process.env.NODE_ENV || 'development';
    (service.getNodeEnv as jest.Mock).mockReturnValue(nodeEnv);

    expect(controller.getNodeEnv()).toEqual({ nodeEnv });
    expect(service.getNodeEnv).toHaveBeenCalled();
  });
});
