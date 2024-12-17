import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from './schemas/vehicle.schema';

describe('VehicleService', () => {
  let service: VehicleService;
  let model: Model<Vehicle>;

  beforeEach(async () => {
    const mockVehicleModel = {
      // Implementação mock das funções do Model aqui (e.g. find, findById, etc.)
      find: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      deleteMany: jest.fn(),
    };

    const mockRideModel = {
      findOne: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getModelToken('Vehicle'), // Fornece o VehicleModel
          useValue: mockVehicleModel, // Mock do VehicleModel
        },
        {
          provide: getModelToken('Ride'), // Fornece o VehicleModel
          useValue: mockRideModel, // Mock do VehicleModel
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    model = module.get<Model<Vehicle>>(getModelToken('Vehicle'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Outros testes para os métodos do VehicleService podem ser adicionados aqui.
});
