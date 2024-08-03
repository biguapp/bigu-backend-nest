import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { AdminModule } from './admin.module';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService, AdminModule],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  beforeEach(() =>{
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
