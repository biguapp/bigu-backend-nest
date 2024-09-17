import { Test, TestingModule } from '@nestjs/testing';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ride } from './schemas/ride.schema';
import { UserService } from '../user/user.service'; // Ajuste o caminho se necessário
import { AddressService } from '../address/address.service';

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

  const mockAddressService = {

  }

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
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AddressService,
          useValue: mockAddressService,
        }
      ],
    }).compile();

    controller = module.get<RideController>(RideController);
    service = module.get<RideService>(RideService);
    model = module.get<Model<Ride>>(getModelToken(Ride.name));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Adicione mais testes aqui
});
