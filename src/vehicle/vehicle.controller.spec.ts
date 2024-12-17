import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('VehicleController', () => {
  let controller: VehicleController;
  let service: VehicleService;

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue(true),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true), // Permite a ativação do guard nas rotas protegidas
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: {
            // Mock methods of VehicleService as needed
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

    controller = module.get<VehicleController>(VehicleController);
    service = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more tests here to cover VehicleController methods
});