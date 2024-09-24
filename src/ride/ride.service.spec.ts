import { Test, TestingModule } from '@nestjs/testing';
import { RideService } from './ride.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ride } from './schemas/ride.schema';
import { UserService } from '../user/user.service';
import { AddressService } from '../address/address.service';
import { MailjetService } from 'nest-mailjet';

describe('RideService', () => {
  let service: RideService;
  let model: Model<Ride>;

  // Mock do RideModel
  const mockRideModel = {
    find: jest.fn().mockResolvedValue([]), // Exemplo de método mockado
    findById: jest.fn().mockResolvedValue(null),
    findOne: jest.fn().mockResolvedValue({/* mock user data */}),

    create: jest.fn().mockResolvedValue({}),
    // Adicione outros métodos conforme necessário
  };
  const mockMailjetService = {
    sendEmail: jest.fn().mockResolvedValue(true), // Example of a mocked method
  };
  // Mock do UserService
  const mockUserService = {
    findOne: jest.fn().mockResolvedValue({/* mock user data */}),
    // Adicione métodos mockados do UserService, se necessário
  };

  // Mock do AddressService
  const mockAddressService = {
    // Adicione métodos mockados do AddressService, se necessário
  };

  // Mock do MemberModel
  const mockMemberModel = {
    // Adicione métodos mockados do MemberModel, se necessário
  };

  // Mock do CandidateModel
  const mockCandidateModel = {
    // Adicione métodos mockados do CandidateModel, se necessário
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
          provide: MailjetService,
          useValue: mockMailjetService,
        },
        {
          provide: getModelToken('Member'),
          useValue: mockMemberModel,
        },
        {
          provide: getModelToken('Candidate'),
          useValue: mockCandidateModel,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AddressService,
          useValue: mockAddressService,
        },
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
