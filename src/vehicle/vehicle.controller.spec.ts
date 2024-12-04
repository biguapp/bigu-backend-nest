import { Test, TestingModule } from '@nestjs/testing';
import { CarController } from './vehicle.controller';
import { CarService } from './vehicle.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('CarController', () => {
  let controller: CarController;
  let service: CarService;

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue(true),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true), // Permite a ativação do guard nas rotas protegidas
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        {
          provide: CarService,
          useValue: {
            // Mock methods of CarService as needed
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            removeAll: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: mockAuthService, // Mock AuthService
        },
      ],
    }).overrideGuard(JwtAuthGuard) // Sobrescreve o guard para evitar erros
    .useValue(mockJwtAuthGuard) // Mock JwtAuthGuard
    .compile();

    controller = module.get<CarController>(CarController);
    service = module.get<CarService>(CarService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more tests here to cover CarController methods
});