import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { NotFoundException } from '@nestjs/common';
import { UserResponseDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser = {
    _id: '1',
    name: 'João Silva',
    email: 'joao.silva@ufcg.edu.br',
    matricula: '2021001234',
    phoneNumber: '(83) 99999-9999',
    sex: 'Masculino',
    password: 'hashedPassword',
    verificationCode: '123456',
    role: 'user',
    avgScore: 4.5,
    isVerified: true,
    toDTO: jest.fn().mockReturnValue({
      name: 'João Silva',
      email: 'joao.silva@ufcg.edu.br',
      matricula: '2021001234',
      phoneNumber: '(83) 99999-9999',
      avgScore: 4.5,
      isVerified: true,
    }),
  };

  const mockUserService = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findByEmail: jest.fn().mockResolvedValue(mockUser),
    findByMatricula: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockResolvedValue(mockUser),
    remove: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: getModelToken('User'), useValue: mockUser },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // Simular o JwtAuthGuard como válido
      .compile();

    controller = await module.resolve(UserController);
    service = await module.resolve(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      await controller.findAll(mockResponse);
      expect(service.findAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Os usuários foram retornados com sucesso.',
        users: [mockUser.toDTO()],
      });
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      await controller.findOneByEmail(mockResponse, 'joao.silva@ufcg.edu.br');
      expect(service.findByEmail).toHaveBeenCalledWith(
        'joao.silva@ufcg.edu.br',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'O usuário foi retornado com sucesso.',
        user: mockUser.toDTO(),
      });
    });

    it('should return 404 if user not found', async () => {
      jest
        .spyOn(service, 'findByEmail')
        .mockRejectedValueOnce(new NotFoundException());

      await controller.findOneByEmail(mockResponse, 'notfound@ufcg.edu.br');
      expect(service.findByEmail).toHaveBeenCalledWith('notfound@ufcg.edu.br');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Usuário não encontrado.',
      });
    });
  });

  describe('remove', () => {
    it('should remove a user and return the deleted user', async () => {
      const mockRequest = { user: { sub: '1' } };
      await controller.remove(mockResponse, mockRequest);
      expect(service.remove).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'O usuário foi removido com sucesso.',
        userRemoved: mockUser.toDTO(),
      });
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'João Atualizado' };
      const mockRequest = { user: { sub: '1' } };
      await controller.update(mockRequest, updateUserDto, mockResponse);
      expect(service.update).toHaveBeenCalledWith('1', updateUserDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'O usuário foi atualizado com sucesso.',
        userUpdated: mockUser.toDTO(),
      });
    });
  });
});
