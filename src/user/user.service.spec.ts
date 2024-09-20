import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  const mockUser = {
    _id: 'userId1',
    name: 'João Silva',
    email: 'teste1@teste.ufcg.edu.br',
    matricula: '123456789',
    phoneNumber: '(83) 99999-9999',
    password: 'hashedPassword',
    role: 'user',
    verificationCode: '123456',
    isVerified: false,
  };

  const mockUserModel = {
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    find: jest.fn().mockReturnThis(),
    create: jest.fn().mockResolvedValue(mockUser),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const create_user_dto: CreateUserDto = {
        name: 'João Silva',
        email: 'teste12345@teste.ufcg.edu.br',
        matricula: '2021001234',
        sex: 'Masculino',
        phoneNumber: '(83) 99999-9999',
        password: 'senha123',
      };
      const verification_code = '123456';
      const hashed_password = 'hashed_password';

      // Mock do hash da senha
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashed_password);

      // console.log(create_user_dto.email);
      const result = await service.create(create_user_dto, verification_code);

      expect(result).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      // expect(created_user.save).toHaveBeenCalled(); // Verifica se o save foi chamado
    });

    it('should throw an error if email is already in use', async () => {
      jest.spyOn(service, 'verifyEmail').mockResolvedValue(true);
      const createUserDto: CreateUserDto = {
        name: 'João Silva',
        email: 'joao.silva@ufcg.edu.br',
        matricula: '2021001234',
        sex: 'Masculino',
        phoneNumber: '(83) 99999-9999',
        password: 'senha123',
      };
      const verificationCode = '123456';

      await expect(
        service.create(createUserDto, verificationCode),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserModel.find.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser);
      const result = await service.findOne('userId1');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);
      await expect(service.findOne('userId1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'New Name' };
      mockUserModel.findByIdAndUpdate.mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });
      const result = await service.update('userId1', updateUserDto);
      expect(result.name).toEqual('New Name');
    });

    it('should throw an error if user not found', async () => {
      mockUserModel.findByIdAndUpdate.mockResolvedValue(null);
      await expect(
        service.update('userId1', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue(mockUser);
      const result = await service.remove('userId1');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user not found', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue(null);
      await expect(service.remove('userId1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
