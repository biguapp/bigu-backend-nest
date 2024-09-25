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
import { CreateRideDto } from './dto/create-ride.dto';
import { RideResponseDto } from './dto/response-ride.dto';

describe('RideController', () => {
  let controller: RideController;
  let service: RideService;
  let model: Model<Ride>;

  const mockRideDto: CreateRideDto = {
    driver: '1',
    startAddress: 'Start Location',
    destinationAddress: 'Destination Location',
    numSeats: 4,
    goingToCollege: true,
    price: 20.0,
    scheduledTime: '2024-09-10T15:30:00Z',
    car: 'Car Model',
    description: 'Ride to campus',
    toWomen: false,
  };

  const rideResponse: RideResponseDto = {
    rideId: '123',
    driver: {
      name: 'João Silva',
      matricula: '2021001234',
      sex: 'Masculino',
      email: 'joao.silva@example.ufcg.edu.br',
      phoneNumber: '(83) 99999-9999',
      userId: '1',
      avgScore: 5,
      feedbacks: [],
      isVerified: true,
    },
    startAddress: {
      rua: 'Avenida Paulista',
      nome: 'Casa',
      numero: '1234',
      complemento: 'Apartamento 56',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      addressId: '1',
    },
    destinationAddress: {
      rua: 'Avenida Paulista',
      nome: 'Casa',
      numero: '1234',
      complemento: 'Apartamento 56',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      addressId: '2',
    },
    numSeats: 3,
    goingToCollege: true,
    price: 15.0,
    scheduledTime: '2024-09-10T15:30:00Z',
    car: {
      brand: 'Chevrolet',
      carModel: 'Onix',
      modelYear: '2019',
      color: 'Preto',
      plate: 'KGU7E07',
      carId: '1',
    },
    description: 'Carona para o campus universitário',
    toWomen: false,
    members: [],
    candidates: [],
    isOver: false,
  };

  // Mock do RideService
  const mockRideService = {
    create: jest.fn().mockResolvedValue({
      ...mockRideDto,
      toDTO: jest.fn().mockReturnValue(mockRideDto),
    }),
    findAll: jest.fn().mockResolvedValue([mockRideDto, mockRideDto]),
    findOne: jest.fn().mockResolvedValue({
      ...rideResponse,
      toDTO: jest.fn().mockReturnValue(rideResponse),
    }),
    update: jest.fn().mockReturnThis(),
    remove: jest.fn().mockResolvedValue(undefined),
    removeAll: jest.fn().mockResolvedValue(undefined),
  };

  // Mock do UserService (se necessário)
  const mockUserService = {
    // Adicione métodos mockados do UserService, se necessário
  };

  const mockMemberModel = {};

  const mockCandidateModel = {};

  const mockMailjetService = {};

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue(true),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true), // Permite a ativação do guard nas rotas protegidas
  };

  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideController],
      providers: [
        {
          provide: RideService,
          useValue: mockRideService,
        },
        
        {
          provide: getModelToken(Ride.name),
          useValue: Model, // Use a instância de modelo mockada se necessário
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
    })
      .overrideGuard(JwtAuthGuard) // Sobrescreve o guard para evitar erros
      .useValue(mockJwtAuthGuard) // Mock JwtAuthGuard
      .compile();

    controller = module.get<RideController>(RideController);
    service = module.get<RideService>(RideService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a ride and return it', async () => {
      const createRideDto: CreateRideDto = { ...mockRideDto };

      await controller.create(createRideDto, response);

      expect(service.create).toHaveBeenCalledWith(createRideDto);
      expect(response.json).toHaveBeenCalledWith({
        message: 'A carona foi criada com sucesso.',
        newRide: { ...createRideDto },
      });
    });
  });

  describe('findAll', () => {
    it('should return all rides', async () => {
      const rides = await service.findAll();
      expect(rides).toEqual([mockRideDto, mockRideDto]);
    });
  });

  describe('findOne', () => {
    it('should return one ride by ID', async () => {
      const rideId = '123';

      await controller.findOne(rideId, response);

      expect(service.findOne).toHaveBeenCalledWith(rideId);
      expect(response.json).toHaveBeenCalledWith({
        message: 'A carona foi retornada com sucesso.',
        ride: rideResponse,
      });
    });

    it('should return 404 if ride not found', async () => {
      const rideId = 'non-existent-id';
      mockRideService.findOne.mockResolvedValueOnce(null); // Simula o comportamento de "não encontrado"

      await controller.findOne(rideId, response);

      expect(service.findOne).toHaveBeenCalledWith(rideId);
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Carona não encontrada.',
      });
    });
  });
});
