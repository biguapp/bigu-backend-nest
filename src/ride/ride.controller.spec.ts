import { Test, TestingModule } from '@nestjs/testing';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ride } from './schemas/ride.schema';
import { UserService } from '../user/user.service'; 
import { Candidate } from './schemas/candidate.schema';
import { Member } from './schemas/member.schema';
import { MailjetService } from 'nest-mailjet';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('RideController', () => {
  let controller: RideController;
  let service: RideService;
  let model: Model<Ride>;

  // Mock do RideService
  const mockRideService = {
    create: jest.fn().mockResolvedValue({ /* mock de uma corrida */ } as Ride),
    findAll: jest.fn().mockResolvedValue([{ /* mock de corridas */ }] as Ride[]),
    findOne: jest.fn().mockResolvedValue({ /* mock de uma corrida */ } as Ride),
    update: jest.fn().mockResolvedValue({ /* mock de uma corrida atualizada */ } as Ride),
    remove: jest.fn().mockResolvedValue(undefined),
    removeAll: jest.fn().mockResolvedValue(undefined),
  };

  // Mock do UserService (se necessário)
  const mockUserService = {
    // Adicione métodos mockados do UserService, se necessário
  };

  const mockMemberModel = {

  };

  const mockCandidateModel = {

  };

  const mockMailjetService = {
    
  };

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue(true),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true), // Permite a ativação do guard nas rotas protegidas
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideController],
      providers: [
        RideService,
        {
          provide: getModelToken(Ride.name),
          useValue: model, // Use a instância de modelo mockada se necessário
        },
        {
          provide: getModelToken(Member.name),
          useValue: mockMemberModel, // Use a instância de modelo mockada se necessário
        },
        {
          provide: getModelToken(Candidate.name),
          useValue: mockCandidateModel, // Use a instância de modelo mockada se necessário
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: MailjetService,
          useValue: mockMailjetService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService, // Mock AuthService
        },
        
      ],
    }).overrideGuard(JwtAuthGuard) // Sobrescreve o guard para evitar erros
    .useValue(mockJwtAuthGuard) // Mock JwtAuthGuard
    .compile();

    controller = module.get<RideController>(RideController);
    service = module.get<RideService>(RideService);
    model = module.get<Model<Ride>>(getModelToken(Ride.name));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Adicione mais testes aqui
});
