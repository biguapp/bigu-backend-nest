import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHealthUnitDto } from '../health-unit/dto/create-health-unit.dto';
import { UpdateHealthUnitDto } from '../health-unit/dto/update-health-unit.dto';
import { HealthUnit } from '../health-unit/interfaces/health-unit.interface';
import { Admin } from '../admin/schemas/admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { NotFoundException } from '@nestjs/common';
import { HealthUnit as HealthUnitSchema } from 'src/health-unit/schemas/health-unit.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    @InjectModel(HealthUnitSchema.name)
    private readonly healthUnitModel: Model<HealthUnit>,
  ) {}

  async createHealthUnit(
    createHealthUnitDto: CreateHealthUnitDto,
  ): Promise<HealthUnit> {
    const createdHealthUnit = new this.healthUnitModel(createHealthUnitDto);
    return createdHealthUnit.save();
  }

  async findByEmail(email: string): Promise<Admin> {
    const admin = await this.adminModel.findOne({ email }).exec();
    if (!admin) {
      throw new NotFoundException(`Admin with email ${email} not found`);
    }
    return admin;
  }

  async getHealthUnit(id: string): Promise<HealthUnit> {
    return this.healthUnitModel.findById(id).exec();
  }

  async updateHealthUnit(
    id: string,
    updateHealthUnitDto: UpdateHealthUnitDto,
  ): Promise<HealthUnit> {
    return this.healthUnitModel
      .findByIdAndUpdate(id, updateHealthUnitDto, { new: true })
      .exec();
  }

  async deleteHealthUnit(id: string): Promise<HealthUnit> {
    return this.healthUnitModel.findByIdAndDelete(id).exec();
  }

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const newAdmin = new this.adminModel(createAdminDto);
    return newAdmin.save();
  }

  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }

  async findOne(id: string): Promise<Admin> {
    return this.adminModel.findById(id).exec();
  }

  async update(id: string, UpdateAdminDto: UpdateAdminDto): Promise<Admin> {
    const updatedAdmin = await this.adminModel
      .findByIdAndUpdate(id, UpdateAdminDto, { new: true })
      .exec();
    if (!updatedAdmin) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return updatedAdmin;
  }

  async remove(id: string): Promise<void> {
    const result = await this.adminModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Paciente não encontrado', HttpStatus.NOT_FOUND);
    }
  }
}
