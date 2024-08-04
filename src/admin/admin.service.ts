import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminSchema } from './schemas/admin.schema';
import { Admin } from '../admin/interfaces/admin.interface';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(AdminSchema.name) private readonly adminModel: Model<Admin>
  ) {}

  async findByEmail(email: string): Promise<Admin> {
    const admin = await this.adminModel.findOne({ email }).exec();
    if (!admin) {
      throw new NotFoundException(`Admin with email ${email} not found`);
    }
    return admin;
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
