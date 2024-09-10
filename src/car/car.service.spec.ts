import { Test, TestingModule } from '@nestjs/testing';
import { CarService } from './car.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from './schemas/car.schema';

describe('CarService', () => {
  let service: CarService;
  let model: Model<Car>;

  beforeEach(async () => {
    const mockCarModel = {
      // Implementação mock das funções do Model aqui (e.g. find, findById, etc.)
      find: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      deleteMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: getModelToken('Car'), // Fornece o CarModel
          useValue: mockCarModel, // Mock do CarModel
        },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
    model = module.get<Model<Car>>(getModelToken('Car'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Outros testes para os métodos do CarService podem ser adicionados aqui.
});
