import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PatientService } from './patient.service';
import { Model } from 'mongoose';
import { Patient } from './interfaces/patient.interface';

describe('PatientService', () => {
  let service: PatientService;
  let model: Model<Patient>;

  const mockPatientModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    // adicione outros métodos necessários
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: getModelToken('Patient'),
          useValue: mockPatientModel,
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
    model = module.get<Model<Patient>>(getModelToken('Patient'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Adicione outros testes aqui
});
