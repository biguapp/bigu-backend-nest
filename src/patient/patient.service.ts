import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './interfaces/patient.interface';
import { CreatePatientDto } from './dto/create-patient.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PatientService {
  constructor(@InjectModel('Patient') private readonly patientModel: Model<Patient>) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const hashedPassword = await bcrypt.hash(createPatientDto.senha, 10);

    const createdPatient = new this.patientModel({
      ...createPatientDto,
      senha: hashedPassword,
    });
    return createdPatient.save();
  }

  async findAll(): Promise<Patient[]> {
    return this.patientModel.find().exec();
  }

  async findOne(id: string): Promise<Patient> {
    return this.patientModel.findById(id).exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.patientModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Paciente não encontrado', HttpStatus.NOT_FOUND);
    }
  }

}
