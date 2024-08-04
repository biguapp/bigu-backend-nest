import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Admin } from '../admin/interfaces/admin.interface';
import { Admin as AdminSchema } from '../admin/schemas/admin.schema';
import { Patient } from '../patient/interfaces/patient.interface';
import { Patient as PatientSchema } from '../patient/schemas/patient.schema';
import { AdminService } from '../admin/admin.service';
import { PatientService } from '../patient/patient.service';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(PatientSchema.name) private readonly patientModel: Model<Patient>,
    @InjectModel(AdminSchema.name) private readonly adminModel: Model<Admin>,
    private readonly adminService: AdminService,
    private readonly patientService: PatientService,
  ) {}

  async validateAdmin(email: string, password: string): Promise<any> {
    const admin = await this.adminService.findByEmail(email);
    if (admin && (await bcrypt.compare(password, admin.password))) {
      return { email: admin.email, sub: admin._id };
    }
    throw new UnauthorizedException('Invalid credentials 1');
  }

  async validatePatient(cpf: string, password: string): Promise<any> {
    const patient = await this.patientService.findByCpf(cpf);
    if (patient && (await bcrypt.compare(password, patient.password))) {
      return { name: patient.nome, sub: patient._id };
    }
    throw new UnauthorizedException('Invalid credentials 1');
  }

  async loginAdmin(email: string, password: string): Promise<string> {
    const validated = await this.validateAdmin(email, password);
    return this.jwtService.sign(validated);
  }

  async loginPatient(cpf: string, password: string): Promise<string> {
    const validated = await this.validatePatient(cpf, password);
    return this.jwtService.sign(validated);
  }

  async registerPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    const { password } = createPatientDto;
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return this.patientService.create({ ...createPatientDto, password: hashedPassword });
  }

  async registerAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { password } = createAdminDto;
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return this.adminService.create({ ...createAdminDto, password: hashedPassword });
  }

}
