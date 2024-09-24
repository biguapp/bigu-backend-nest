import { Test, TestingModule } from '@nestjs/testing';
import { RideService } from './ride.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ride } from './schemas/ride.schema';
import { UserService } from '../user/user.service'; // Ajuste o caminho se necessário
import { AddressService } from '../address/address.service';
import { Member } from './schemas/member.schema';
import { Candidate } from './schemas/candidate.schema';
import { MailjetService } from 'nest-mailjet';
import { RideChatService } from '@src/ride-chat/ride-chat.service';

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

  const mockMemberModel = {

  };

  const mockRideChatService = {

  };

  const mockCandidateModel = {

  };

  // Mock do UserService
  const mockUserService = {
    // Adicione métodos mockados do UserService, se necessário
  };

  const mockMailjetService = {
    
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
          provide: getModelToken(Member.name),
          useValue: mockMemberModel,
        },
        {
          provide: getModelToken(Candidate.name),
          useValue: mockCandidateModel,
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
          provide: RideChatService,
          useValue: mockRideChatService,
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
