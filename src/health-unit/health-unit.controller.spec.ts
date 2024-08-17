import { Test, TestingModule } from '@nestjs/testing';
import { HealthUnitController } from './health-unit.controller';
import { HealthUnitService } from './health-unit.service';
import { JwtService } from '@nestjs/jwt';
import { PatientService } from '../patient/patient.service';
import { AdminService } from '../admin/admin.service';
import { RolesGuard } from '../roles/roles.guard';
import { getModelToken } from '@nestjs/mongoose';

describe('HealthUnitController', () => {
  let controller: HealthUnitController;
  let service: HealthUnitService;
  let jwtService: JwtService;
  let rolesGuard: RolesGuard;

  const mockHealthUnitService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest
      .fn()
      .mockResolvedValue({
        email: 'admin@example.com',
        sub: '66c00aa5d9e94a59544eb423',
      }),
  };

  const mockRolesGuard = {
    canActivate: jest.fn().mockResolvedValue(true),
  };

  const mockPatientService = {
    findByCpf: jest.fn(),
  };

  const mockAdminService = {
    findByEmail: jest.fn(),
  };

  const mockPatientModel = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthUnitController],
      providers: [
        JwtService,
        {
          provide: getModelToken('Patient'),
          useValue: mockPatientModel,
        },
        {
          provide: PatientService,
          useValue: mockPatientService,
        },
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
        {
          provide: RolesGuard,
          useValue: mockRolesGuard,
        },
        {
          provide: HealthUnitService,
          useValue: mockHealthUnitService,
        },
      ],
    }).compile();

    controller = module.get<HealthUnitController>(HealthUnitController);
    service = module.get<HealthUnitService>(HealthUnitService);
    jwtService = module.get<JwtService>(JwtService);
    rolesGuard = module.get<RolesGuard>(RolesGuard);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Adicione mais testes conforme necessário
});
