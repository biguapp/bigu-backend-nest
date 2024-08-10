import { Test, TestingModule } from '@nestjs/testing';
import { HealthUnitService } from './health-unit.service';
import { getModelToken } from '@nestjs/mongoose';
import { HealthUnit } from './schemas/health-unit.schema';
import { JwtService } from '@nestjs/jwt';

describe('HealthUnitService', () => {
  let service: HealthUnitService;

  const mockHealthUnitModel = {
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() =>{
    jest.resetAllMocks();
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthUnitService,
        {
          provide: getModelToken(HealthUnit.name),
          useValue: mockHealthUnitModel,
        },
      ],
    }).compile();

    service = module.get<HealthUnitService>(HealthUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
