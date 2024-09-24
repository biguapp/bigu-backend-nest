import { Test, TestingModule } from '@nestjs/testing';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ride } from './schemas/ride.schema';
import { CreateRideDto } from './dto/create-ride.dto';
import { AuthService } from '../auth/auth.service';
import { RideResponseDto } from './dto/response-ride.dto';

describe('RideController', () => {
  let controller: RideController;
  let service: RideService;
  let model: Model<Ride>;

  const mockRideDto : CreateRideDto = {
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
      email: 'joao.silva@example.com',
      phoneNumber: '(83) 99999-9999',
      userId: '1',
      avgScore: 4.8,
      feedbacks: [
        'Ótimo motorista, muito pontual.',
        'A viagem foi tranquila e confortável.'
      ],
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
        addressId: '1',
      
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
    members: [
    ],
    candidates: [
    ],
    isOver: false,
  };
  
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

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue(true),
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
          useValue: model,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<RideController>(RideController);
    service = module.get<RideService>(RideService);
    model = module.get<Model<Ride>>(getModelToken(Ride.name));
  });

  describe('define', () => {
  it('should be defined', () => {
    expect(controller).toBeDefined();
    });
  });

  describe('create', () => {
  it('should create a ride and return it', async () => {
    const createRideDto: CreateRideDto = { ...mockRideDto };

    await controller.create(createRideDto, response);
    
    expect(service.create).toHaveBeenCalledWith(createRideDto);
    expect(response.json).toHaveBeenCalledWith({
      message: "A carona foi criada com sucesso.",
      newRide: { ...createRideDto },
    });
  })});
  
  describe('findAll', () => {
  it('should return all rides', async () => {
    const rides = await service.findAll();
    expect(rides).toEqual([mockRideDto,mockRideDto]);
    });
  });

  describe('findOne', () => {
  it('should return one ride', async () => {
    const rideId = '23';
  
    await controller.findOne(rideId, response);

    expect(service.findOne).toHaveBeenCalledWith(rideId);
    expect(response.json).toHaveBeenCalledWith({
      message: "A carona foi retornada com sucesso.",
      ride: [],
      });
    });
  });

});