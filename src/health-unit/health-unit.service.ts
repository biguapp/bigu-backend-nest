import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HealthUnit } from './interfaces/health-unit.interface';
import { CreateHealthUnitDto } from './dto/create-health-unit.dto';
import { UpdateHealthUnitDto } from './dto/update-health-unit.dto';
import { HealthUnit as HealthUnitSchema } from './schemas/health-unit.schema';

@Injectable()
export class HealthUnitService {
  constructor(@InjectModel(HealthUnitSchema.name) private readonly healthUnitModel: Model<HealthUnit>) {}

  async create(createHealthUnitDto: CreateHealthUnitDto): Promise<HealthUnit> {
    const createdHealthUnit = new this.healthUnitModel(createHealthUnitDto);
    return createdHealthUnit.save();
  }

  async findAll(): Promise<HealthUnit[]> {
    return this.healthUnitModel.find().exec();
  }

  async findOne(id: string): Promise<HealthUnit> {
    const healthUnit = await this.healthUnitModel.findById(id).exec();
    if (!healthUnit) {
      throw new NotFoundException(`HealthUnit with ID ${id} not found`);
    }
    return healthUnit;
  }

  async update(id: string, updateHealthUnitDto: UpdateHealthUnitDto): Promise<HealthUnit> {
    const updatedHealthUnit = await this.healthUnitModel.findByIdAndUpdate(
      id,
      updateHealthUnitDto,
      { new: true }
    ).exec();
    if (!updatedHealthUnit) {
      throw new NotFoundException(`HealthUnit with ID ${id} not found`);
    }
    return updatedHealthUnit;
  }

  async remove(id: string): Promise<void> {
    const result = await this.healthUnitModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`HealthUnit with ID ${id} not found`);
    }
  }
}
