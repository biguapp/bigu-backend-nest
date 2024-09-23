import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from './address.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from './interfaces/address.interface';

describe('AddressService', () => {
  let service: AddressService;
  let model: Model<Address>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getModelToken('Address'), // Mocking the Address model
          useValue: {
            // Mock the methods you will use
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
        {
          provide: getModelToken('Ride'),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    model = module.get<Model<Address>>(getModelToken('Address'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
