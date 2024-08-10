import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { AdminService } from '../admin/admin.service';
import { PatientService } from '../patient/patient.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Admin } from '../admin/interfaces/admin.interface';
import { Patient } from '../patient/interfaces/patient.interface';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { Role } from '../enums/enum';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let adminService: AdminService;
  let patientService: PatientService;

  const mockAdmin: Admin = {
    _id: 'adminId',
    email: 'admin@example.com',
    password: 'hashedPassword',
  } as Admin;

  const mockPatient: Patient = {
    _id: 'patientId',
    cpf: '12345678901',
    nome: 'Patient Name',
    nomeMae: 'Mother Name',
    numeroSus: '123456789012345',
    dataNascimento: new Date(),
    sexo: 'Masculino',
    email: 'patient@example.com',
    password: 'hashedPassword',
    celular: '(11) 98765-4321',
    endereco: {
      rua: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '12345-678',
    },
  } as Patient;

  beforeEach(() =>{
    jest.resetAllMocks();
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        AdminService,
        PatientService,
        {
          provide: getModelToken('Admin'),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockAdmin),
            create: jest.fn().mockResolvedValue(mockAdmin),
          },
        },
        {
          provide: getModelToken('Patient'),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockPatient),
            create: jest.fn().mockResolvedValue(mockPatient),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    adminService = module.get<AdminService>(AdminService);
    patientService = module.get<PatientService>(PatientService);

    jest.spyOn(adminService, 'findByEmail').mockResolvedValue(mockAdmin);
    jest.spyOn(patientService, 'findByCpf').mockResolvedValue(mockPatient);
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass, hashed) => {
      return Promise.resolve(pass === 'password' && hashed === 'hashedPassword');
    });
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
      return Promise.resolve('hashedPassword');
    });
    jest.spyOn(jwtService, 'sign').mockImplementation(() => 'jwt-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateAdmin', () => {
    it('should validate and return the admin if credentials are correct', async () => {
      const result = await authService.validateAdmin(mockAdmin.email, 'password');
      expect(result).toEqual({ email: mockAdmin.email, sub: mockAdmin._id });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(adminService, 'findByEmail').mockResolvedValue(null);
      await expect(authService.validateAdmin('invalid@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('loginAdmin', () => {
    it('should return a JWT token for valid admin credentials', async () => {
      const result = await authService.loginAdmin(mockAdmin.email, 'password');
      expect(result).toBe('jwt-token');
    });
  });

  describe('validatePatient', () => {
    it('should validate and return the patient if credentials are correct', async () => {
      const result = await authService.validatePatient(mockPatient.cpf, 'password');
      expect(result).toEqual({ name: mockPatient.nome, sub: mockPatient._id });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(patientService, 'findByCpf').mockResolvedValue(null);
      await expect(authService.validatePatient('invalidCpf', 'password')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('loginPatient', () => {
    it('should return a JWT token for valid patient credentials', async () => {
      const result = await authService.loginPatient(mockPatient.cpf, 'password');
      expect(result).toBe('jwt-token');
    });
  });

  describe('registerPatient', () => {
    it('should hash the password and create a new patient', async () => {
      const createPatientDto: CreatePatientDto = {
        role: Role.Patient,
        cpf: '10050972405',
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

      jest.spyOn(patientService, 'create').mockResolvedValue(mockPatient);

      const result = await authService.registerPatient(createPatientDto);
      expect(result).toEqual(mockPatient);
    });
  });

  describe('registerAdmin', () => {
    it('should hash the password and create a new admin', async () => {
      const createAdminDto: CreateAdminDto = {
        email: 'admin@example.com',
        password: 'password',
        role: Role.Admin
      };

      jest.spyOn(adminService, 'create').mockResolvedValue(mockAdmin);

      const result = await authService.registerAdmin(createAdminDto);
      expect(result).toEqual(mockAdmin);
    });
  });
});
