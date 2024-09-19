import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  const mockUserModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
    create: jest.fn().mockResolvedValue({
      save: jest.fn().mockResolvedValue({
        _id: '1',
        email: 'test@test.com',
        matricula: '12345',
        password: 'hashedPassword',
        role: 'user',
      }),
    }),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(service, 'verifyEmail').mockResolvedValue(false);
      jest.spyOn(service, 'verifyMatricula').mockResolvedValue(false);

      const createUserDto: CreateUserDto = {
        name: 'Teste da Silva',
        email: 'test@test.com',
        matricula: '12345',
        password: 'password',
        sex: 'M',
        phoneNumber: '83996798478'
      };

      const result = await service.create(createUserDto);

      expect(result).toEqual({
        _id: 'mockUserId',
        email: 'test@test.com',
        matricula: '12345',
        password: 'hashedPassword',
        role: 'user',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(service.verifyEmail).toHaveBeenCalledWith('test@test.com');
      expect(service.verifyMatricula).toHaveBeenCalledWith('12345');
    });

    it('should throw BadRequestException if email is already in use', async () => {
      jest.spyOn(service, 'verifyEmail').mockResolvedValue(true);

      const createUserDto: CreateUserDto = {
        name: 'Teste da Silva',
        email: 'test@test.com',
        matricula: '12345',
        password: 'password',
        sex: 'M',
        phoneNumber: '83996798478'
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        new BadRequestException('O email já está em uso.'),
      );
    });

    it('should throw BadRequestException if matricula is already in use', async () => {
      jest.spyOn(service, 'verifyEmail').mockResolvedValue(false);
      jest.spyOn(service, 'verifyMatricula').mockResolvedValue(true);

      const createUserDto: CreateUserDto = {
        name: 'Teste da Silva',
        email: 'test@test.com',
        matricula: '12345',
        password: 'password',
        sex: 'M',
        phoneNumber: '83996798478'
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        new BadRequestException('A matrícula já está em uso.'),
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { _id: '1', email: 'test@test.com' },
        { _id: '2', email: 'user2@test.com' },
      ];
      mockUserModel.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });

  describe('findDrivers', () => {
    it('should return all drivers', async () => {
      const mockDrivers = [
        { _id: '1', email: 'test@test.com', role: 'Driver' },
      ];
      mockUserModel.find.mockResolvedValue(mockDrivers);

      const result = await service.findDrivers();
      expect(result).toEqual(mockDrivers);
      expect(mockUserModel.find).toHaveBeenCalledWith({ role: 'Driver' });
    });

    it('should throw NotFoundException if no drivers found', async () => {
      mockUserModel.find.mockResolvedValue([]);

      await expect(service.findDrivers()).rejects.toThrow(
        new NotFoundException('Nenhum usuário com a role Driver encontrado'),
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = { _id: '1', email: 'user@test.com' };
      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(
        new NotFoundException('User with id 1 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const mockUser = { _id: '1', email: 'test@test.com' };
      mockUserModel.findByIdAndDelete.mockResolvedValue(mockUser);

      const result = await service.remove('1');
      expect(result).toEqual(mockUser);
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(
        new NotFoundException('Usuario não encontrado'),
      );
    });
  });
});
