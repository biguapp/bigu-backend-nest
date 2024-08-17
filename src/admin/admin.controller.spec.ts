import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Role } from '../enums/enum';

const uuid = '4fbf7c1f-4174-4105-997d-45e62f5cc5a3';

describe('AdminController', () => {
  let adminController: AdminController;

  const mockAdminService = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockAdminService}],
    }).compile();

    adminController = module.get<AdminController>(AdminController);
  });

  beforeEach(() =>{
    jest.resetAllMocks();
  })

  it('should be defined', () => {
    expect(adminController).toBeDefined();
  });

  it('create', async () => {
    const adminDto: CreateAdminDto = {
      email: 'example@mail.com',
      password: '123'
    };
    await adminController.create(adminDto);

    expect(mockAdminService.create).toHaveBeenCalledTimes(1);
    expect(mockAdminService.create).toHaveBeenCalledWith(adminDto, Role.Admin);
  });

  it('findAll', async () => {
    await adminController.findAll();

    expect(mockAdminService.findAll).toHaveBeenCalledTimes(1);
    expect(mockAdminService.findAll).toHaveBeenCalledWith();
  });

  it('findOne', async () => {
    await adminController.findOne(uuid);

    expect(mockAdminService.findOne).toHaveBeenCalledTimes(1);
    expect(mockAdminService.findOne).toHaveBeenCalledWith(uuid);
  });

  it('update', async () => {
    const adminDto: UpdateAdminDto = {
      email: 'example@mail.com',
      password: '123',
    };

    await adminController.update(uuid, adminDto);

    expect(mockAdminService.update).toHaveBeenCalledTimes(1);
    expect(mockAdminService.update).toHaveBeenCalledWith(uuid, adminDto);
  });

  it('findByEmail', async () => {
    await adminController.findByEmail('example@mail.com');

    expect(mockAdminService.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockAdminService.findByEmail).toHaveBeenCalledWith('example@mail.com');
  });

  it('remove', async () => {
    await adminController.remove(uuid);

    expect(mockAdminService.remove).toHaveBeenCalledTimes(1);
    expect(mockAdminService.remove).toHaveBeenCalledWith(uuid);
  });
  

  
});
