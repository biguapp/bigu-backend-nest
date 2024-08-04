import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getModelToken } from '@nestjs/mongoose';
import { AdminSchema } from './schemas/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

describe('AdminService', () => {
  let service: AdminService;

  const mockAdminModel = {
    // Adicione os métodos mockados que seu serviço utiliza
    findOne: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('token'),
  };

  const mockAuthService = {
    loginAdmin: jest.fn().mockResolvedValue('token'),
    validateAdmin: jest.fn().mockResolvedValue({ email: 'test@admin.com', sub: '1' }),
  };

  beforeEach(() =>{
    jest.resetAllMocks();
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getModelToken(AdminSchema.name),
          useValue: mockAdminModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Adicione outros testes aqui
});
