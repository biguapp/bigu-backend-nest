import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const hasEmail = await this.verifyEmail(createUserDto.email);
    const hasMatricula = await this.verifyMatricula(createUserDto.matricula);

    if (hasEmail) throw new BadRequestException('O email já está em uso.');
    if (hasMatricula)
      throw new BadRequestException('A matrícula já está em uso.');

    const createdUser = new this.userModel({
      ...createUserDto,
      role: 'user',
      password: hashedPassword,
    });

    const user = await createdUser.save();

    return user;
  }

  async findAll(): Promise<User[]> {
    const users= await this.userModel.find().exec();
    
    return users
  }

  async findDrivers(): Promise<User[]> {
    const drivers = await this.userModel.find({ role: Role.Driver }).exec();
    if (!drivers || drivers.length === 0) {
      throw new NotFoundException(
        'Nenhum usuário com a role Driver encontrado',
      );
    }
    return drivers;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Credenciais inválidas.');
    }
    return user;
  }

  async verifyEmail(email: string): Promise<Boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user) return true;
    return false;
  }

  async verifyMatricula(matricula: string): Promise<Boolean> {
    const user = await this.userModel.findOne({ matricula }).exec();
    if (user) return true;
    return false;
  }

  verifyMinSizePassword(password: string): Boolean {
    if (password.length >= 6) return true;
    return false;
  }

  async findByMatricula(matricula: string): Promise<User> {
    const user = await this.userModel.findOne({ matricula }).exec();
    if (!user) {
      throw new NotFoundException('Matrícula não existente.');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (result) {
      throw new HttpException('Endereço não encontrado', HttpStatus.NOT_FOUND);
    }
    return result
  }

  async removeAll(): Promise<void> {
    await this.userModel.deleteMany({});
  }  
}
