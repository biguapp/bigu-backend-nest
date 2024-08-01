import { Test, TestingModule } from '@nestjs/testing';
import { HealthUnitController } from './health-unit.controller';

describe('HealthUnitController', () => {
  let controller: HealthUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthUnitController],
    }).compile();

    controller = module.get<HealthUnitController>(HealthUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
