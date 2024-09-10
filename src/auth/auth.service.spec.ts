import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AddressService } from '../address/address.service';
import { CarService } from '../car/car.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../user/interfaces/user.interface';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService, // Mocking UserService
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
            validatePassword: jest.fn(),
            addAddressToUser: jest.fn(), // Adicione o mock do método usado no serviço
          },
        },
        {
          provide: AddressService, // Mocking AddressService
          useValue: {
            create: jest.fn(), // Mock the create method for AddressService
          },
        },
        {
          provide: CarService, // Mocking CarService
          useValue: {
            // Mock methods of CarService if necessary
          },
        },
        {
          provide: JwtService, // Mocking JwtService
          useValue: {
            sign: jest.fn().mockReturnValue('mockJwtToken'),
          },
        },
        {
          provide: getModelToken('User'), // Mocking the UserModel
          useValue: {
            // Mock methods of UserModel if necessary
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add other tests for your AuthService methods
});
