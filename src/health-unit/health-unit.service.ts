import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HealthUnit } from './interfaces/health-unit.interface';
import { CreateHealthUnitDto } from './dto/create-health-unit.dto';

@Injectable()
export class HealthUnitService {
  constructor(@InjectModel('HealthUnit') private readonly healthUnitModel: Model<HealthUnit>) {}

  async create(createHealthUnitDto: CreateHealthUnitDto): Promise<HealthUnit> {
    const createdHealthUnit = new this.healthUnitModel(createHealthUnitDto);
    return createdHealthUnit.save();
  }

  async findAll(): Promise<HealthUnit[]> {
    return this.healthUnitModel.find().exec();
  }
}
