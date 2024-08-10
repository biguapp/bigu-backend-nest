import { Test, TestingModule } from '@nestjs/testing';
import { HealthUnitController } from './health-unit.controller';
import { HealthUnitService } from './health-unit.service';

describe('HealthUnitController', () => {
  let controller: HealthUnitController;
  let service: HealthUnitService;

  beforeEach(async () => {
    const mockHealthUnitService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthUnitController],
      providers: [
        {
          provide: HealthUnitService,
          useValue: mockHealthUnitService,
        },
      ],
    }).compile();

    controller = module.get<HealthUnitController>(HealthUnitController);
    service = module.get<HealthUnitService>(HealthUnitService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
