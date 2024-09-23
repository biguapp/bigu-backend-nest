import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AddressService } from '../address/address.service';
import { CarService } from '../car/car.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../user/interfaces/user.interface';
import { MailjetService } from 'nest-mailjet';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
            validatePassword: jest.fn(),
            addAddressToUser: jest.fn(),
          },
        },
        {
          provide: AddressService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CarService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockJwtToken'),
          },
        },
        {
          provide: MailjetService,
          useValue: {
            send: jest.fn().mockReturnValue('mockEmailSent'),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {},
        },
        {
          provide: getModelToken('BlacklistedToken'), // Mocking BlacklistedTokenModel
          useValue: {
            // Mock methods for BlacklistedTokenModel if necessary
            create: jest.fn(),
            findOne: jest.fn(),
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
