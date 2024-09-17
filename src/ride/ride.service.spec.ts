import { Test, TestingModule } from '@nestjs/testing';
import { RideService } from './ride.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ride } from './schemas/ride.schema';
import { UserService } from '../user/user.service'; // Ajuste o caminho se necessário
import { AddressService } from '../address/address.service';

describe('RideService', () => {
  let service: RideService;
  let model: Model<Ride>;

  // Mock do RideModel
  const mockRideModel = {
    find: jest.fn().mockResolvedValue([]), // Exemplo de método mockado
    findById: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({}),
    // Adicione outros métodos conforme necessário
  };

  // Mock do UserService
  const mockUserService = {
    // Adicione métodos mockados do UserService, se necessário
  };

  const mockAddressService = {

  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RideService,
        {
          provide: getModelToken(Ride.name),
          useValue: mockRideModel,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AddressService,
          useValue: mockAddressService,
        }
      ],
    }).compile();

    service = module.get<RideService>(RideService);
    model = module.get<Model<Ride>>(getModelToken(Ride.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Adicione mais testes aqui
});
