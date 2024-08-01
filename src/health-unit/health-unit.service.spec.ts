import { Test, TestingModule } from '@nestjs/testing';
import { HealthUnitService } from './health-unit.service';

describe('HealthUnitService', () => {
  let service: HealthUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthUnitService],
    }).compile();

    service = module.get<HealthUnitService>(HealthUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
