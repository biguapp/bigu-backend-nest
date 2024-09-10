import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { AddressService } from '../address/address.service';
import { CarService } from '../car/car.service';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  const mockUserModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    // adicione outros métodos necessários
  };

  const mockAddressService = {
    // Mock methods of AddressService
    find: jest.fn(),
  };

  const mockCarService = {
    // Mock methods of CarService
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: AddressService, // Mocking AddressService
          useValue: mockAddressService,
        },
        {
          provide: CarService, // Mocking CarService
          useValue: mockCarService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Adicione outros testes aqui
});
