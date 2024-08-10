import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';
import { LoginPatientDto } from '../patient/dto/login-patient.dto';
import { Admin } from '../admin/schemas/admin.schema';
import { Patient } from '../patient/interfaces/patient.interface';
import { Role } from '../enums/enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    loginAdmin: jest.fn(),
    loginPatient: jest.fn(),
    registerPatient: jest.fn(),
    registerAdmin: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('loginAdmin', () => {
    it('should return an access token for valid credentials', async () => {
      const createAdminDto: CreateAdminDto = { email: 'admin@example.com', password: 'password', role: Role.Admin };
      jest.spyOn(authService, 'loginAdmin').mockResolvedValue('jwt-token');

      const result = await controller.loginAdmin(createAdminDto);
      expect(result).toEqual({ access_token: 'jwt-token' });
    });

    it('should throw BadRequestException for invalid credentials', async () => {
      const createAdminDto: CreateAdminDto = { email: 'admin@example.com', password: 'password', role: Role.Admin };
      jest.spyOn(authService, 'loginAdmin').mockResolvedValue(null);

      await expect(controller.loginAdmin(createAdminDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('loginPatient', () => {
    it('should return an access token for valid credentials', async () => {
      const loginPatientDto: LoginPatientDto = { cpf: '12345678901', password: 'password' };
      jest.spyOn(authService, 'loginPatient').mockResolvedValue('jwt-token');

      const result = await controller.loginPatient(loginPatientDto);
      expect(result).toEqual({ access_token: 'jwt-token' });
    });

    it('should throw BadRequestException for invalid credentials', async () => {
      const loginPatientDto: LoginPatientDto = { cpf: '12345678901', password: 'password' };
      jest.spyOn(authService, 'loginPatient').mockResolvedValue(null);

      await expect(controller.loginPatient(loginPatientDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('registerAdmin', () => {
    it('should register an admin and return a success message', async () => {
      const createAdminDto: CreateAdminDto = { email: 'admin@example.com', password: 'password', role: Role.Admin };
      const mockAdmin: Admin = {
        _id: 'adminId',
        email: createAdminDto.email,
        password: 'hashedPassword',
      } as Admin;
      jest.spyOn(authService, 'registerAdmin').mockResolvedValue(mockAdmin);

      const result = await controller.registerAdmin(createAdminDto);
      expect(result).toEqual({ message: 'Admin registered successfully' });
    });

    it('should throw BadRequestException if registration fails', async () => {
      const createAdminDto: CreateAdminDto = { email: 'admin@example.com', password: 'password', role: Role.Admin };
      jest.spyOn(authService, 'registerAdmin').mockResolvedValue(null);

      await expect(controller.registerAdmin(createAdminDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('registerPatient', () => {
    it('should register a patient and return a success message', async () => {
      const createPatientDto: CreatePatientDto = {
        role: Role.Patient,
        cpf: '12345678901',
        nome: 'Patient Name',
        nomeMae: 'Mother Name',
        numeroSus: '123456789012345',
        dataNascimento: new Date(),
        sexo: 'Masculino',
        email: 'patient@example.com',
        password: 'password',
        celular: '(11) 98765-4321',
        endereco: {
          rua: 'Rua das Flores',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '12345-678',
        },
      };
      const mockPatient: Patient = {
        _id: 'patientId',
        cpf: createPatientDto.cpf,
        nome: createPatientDto.nome,
        nomeMae: createPatientDto.nomeMae,
        numeroSus: createPatientDto.numeroSus,
        dataNascimento: createPatientDto.dataNascimento,
        sexo: createPatientDto.sexo,
        email: createPatientDto.email,
        password: 'hashedPassword',
        celular: createPatientDto.celular,
        endereco: createPatientDto.endereco,
      } as Patient;
      jest.spyOn(authService, 'registerPatient').mockResolvedValue(mockPatient);

      const result = await controller.registerPatient(createPatientDto);
      expect(result).toEqual({ message: 'Patient registered successfully' });
    });

    it('should throw BadRequestException if registration fails', async () => {
      const createPatientDto: CreatePatientDto = {
        role: Role.Patient,
        cpf: '12345678901',
        nome: 'Patient Name',
        nomeMae: 'Mother Name',
        numeroSus: '123456789012345',
        dataNascimento: new Date(),
        sexo: 'Masculino',
        email: 'patient@example.com',
        password: 'password',
        celular: '(11) 98765-4321',
        endereco: {
          rua: 'Rua das Flores',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '12345-678',
        },
      };
      jest.spyOn(authService, 'registerPatient').mockResolvedValue(null);

      await expect(controller.registerPatient(createPatientDto)).rejects.toThrow(BadRequestException);
    });
  });
});
