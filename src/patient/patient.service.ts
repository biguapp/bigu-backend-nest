import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './interfaces/patient.interface';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/enum';

@Injectable()
export class PatientService {
  constructor(@InjectModel('Patient') private readonly patientModel: Model<Patient>) {}

  async create(createPatientDto: CreatePatientDto, role: Role.Patient): Promise<Patient> {
    const hashedPassword = await bcrypt.hash(createPatientDto.password, 10);
    console.log(hashedPassword);
    console.log(createPatientDto.password);
    const createdPatient = new this.patientModel({
      ...createPatientDto,
      role: role,
      password: hashedPassword,
    });
    return createdPatient.save();
  }

  async findAll(): Promise<Patient[]> {
    return this.patientModel.find().exec();
  }

  async findOne(id: string): Promise<Patient> {
    return this.patientModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<Patient> {
    const patient = await this.patientModel.findOne({ email }).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with email ${email} not found`);
    }
    return patient;
  }

  async findByCpf(cpf: string): Promise<Patient> {
    const patient = await this.patientModel.findOne({ cpf }).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with email ${cpf} not found`);
    }
    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const updatedPatient = await this.patientModel.findByIdAndUpdate(
      id,
      updatePatientDto,
      { new: true }
    ).exec();
    if (!updatedPatient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return updatedPatient;
  }

  async remove(id: string): Promise<void> {
    const result = await this.patientModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Paciente não encontrado', HttpStatus.NOT_FOUND);
    }
  }

  async removeAll(): Promise<void> {
    await this.patientModel.deleteMany({});
  }

}
