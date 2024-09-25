import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { getModelToken } from '@nestjs/mongoose';
import { MailjetService } from 'nest-mailjet';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let mailjetService: MailjetService;

  const mockUser = {
    id: '1',
    email: 'joao.silva@ufcg.edu.br',
    password: 'hashedPassword',
    verificationCode: '123456',
    role: 'user',
    toDTO: jest.fn().mockReturnValue({
      name: 'João Silva',
      email: 'joao.silva@ufcg.edu.br',
    }),
  };

  const mockUserService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    findByVerificationCode: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn().mockReturnValue({
    }),
    decode: jest.fn(),
  };

  const mockBlacklistedTokenModel = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn().mockRejectedValue(null),
  };

  const mockMailjetService = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: getModelToken('BlacklistedToken'),
          useValue: mockBlacklistedTokenModel,
        },
        { provide: MailjetService, useValue: mockMailjetService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    mailjetService = module.get<MailjetService>(MailjetService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should return tokens and user data when credentials are valid', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('access_token');

      const result = await service.loginUser(mockUser.email, 'password123');

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'access_token',
        userResponse: mockUser.toDTO(),
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.loginUser(mockUser.email, 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshAccessToken', () => {
    it('should return new access token when refresh token is valid', async () => {
      // Simular um payload válido de refresh token, incluindo a expiração
      const mockRefreshTokenPayload = {
        sub: '1',
        name: 'João Silva',
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // Token válido por 7 dias
      };

      // Mockar o método verify para simular a verificação bem-sucedida do refresh token
      mockJwtService.verify.mockReturnValue(mockRefreshTokenPayload);

      // Simular que o token não está na blacklist
      mockBlacklistedTokenModel.findOne.mockResolvedValue(null);

      // Mock para gerar um novo access token
      mockJwtService.sign.mockReturnValue('new_access_token');

      // Chamar o método e verificar o resultado
      const result = await service.refreshAccessToken('valid_refresh_token');

      expect(result).toEqual({ accessToken: 'new_access_token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { name: 'João Silva', sub: '1', role: undefined }, // Payload esperado
        { expiresIn: '15m' }, // Duração do novo access token
      );
    });

    it('should throw UnauthorizedException if refresh token is blacklisted', async () => {
      mockBlacklistedTokenModel.findOne.mockResolvedValue(true);

      await expect(
        service.refreshAccessToken('blacklisted_token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('registerUser', () => {
    it('should register user, send verification email, and return tokens', async () => {
      mockUserService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('access_token');
      mockMailjetService.send.mockResolvedValue({
        body: { Messages: [{ Status: 'sent' }] },
      });

      const createUserDto: CreateUserDto = {
        name: 'João Silva',
        email: 'joao.silva@ufcg.edu.br',
        password: 'password123',
        phoneNumber: '(83) 99999-9999',
        sex: 'Masculino',
        matricula: '2021001234',
      };

      const result = await service.registerUser(createUserDto);

      expect(mockUserService.create).toHaveBeenCalledWith(
        createUserDto,
        expect.any(String),
      );
      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'access_token',
        userResponse: mockUser.toDTO(),
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset the password when code is valid', async () => {
      mockUserService.findByVerificationCode.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.resetPassword(mockUser.email, '123456', 'newPassword123');

      expect(mockUserService.update).toHaveBeenCalledWith(mockUser.id, {
        password: 'hashedPassword',
        verificationCode: null,
      });
      expect(result).toBe('Senha alterada com sucesso!');
    });

    it('should throw UnauthorizedException if verification code is invalid', async () => {
      mockUserService.findByVerificationCode.mockResolvedValue(null);

      await expect(
        service.resetPassword(mockUser.email, 'wrong_code', 'newPassword123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
