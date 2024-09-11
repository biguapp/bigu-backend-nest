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
import { AddressService } from '../address/address.service';
import { CarService } from '../car/car.service';
import { CreateAddressDto } from '../address/dto/create-address.dto';
import { CreateCarDto } from '../car/dto/create-car.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly addressService: AddressService,
    private readonly carService: CarService,
  ) {}

  async addAddressToUser(userId: string, addressDto: CreateAddressDto) {
    const address = await this.addressService.create(addressDto);
    const user = await this.findOne(userId);
    user.addresses.push(address);
    return user.save();
  }

  async addCarToUser(userId: string, carDto: CreateCarDto) {
    const car = await this.carService.create(carDto);
    const user = await this.userModel.findByIdAndUpdate(userId, { role: Role.Driver} );
    user.cars.push(car);
    return user.save();
  }

  async getUserCars(userId: string) {
    const user = await this.findOne(userId);
    if(user) return user.cars;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const hasEmail = await this.verifyEmail(createUserDto.email)
    const hasMatricula = await this.verifyMatricula(createUserDto.matricula);

    if(hasEmail) throw new BadRequestException("O email já está em uso.")
    if(hasMatricula) throw new BadRequestException("A matrícula já está em uso.")

    const createdUser = new this.userModel({
      ...createUserDto,
      role: "user",
      password: hashedPassword,
    });
    
    const user = await createdUser.save();

    return user
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
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
    const user = this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException("Credenciais inválidas.");
    }
    return user;
  }

  async verifyEmail(email: string): Promise<Boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    if(user) return true;
    return false
  }

  async verifyMatricula(matricula: string): Promise<Boolean> {
    const user = await this.userModel.findOne({ matricula }).exec();
    if(user) return true;
    return false
  }

  verifyMinSizePassword(password: string): Boolean {
    if(password.length >= 6) return true
    return false
  }

  async findByMatricula(matricula: string): Promise<User> {
    const user = await this.userModel.findOne({ matricula }).exec();
    if (!user) {
      throw new NotFoundException("Matrícula não existente.");
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

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Paciente não encontrado', HttpStatus.NOT_FOUND);
    }
  }

  async removeAll(): Promise<void> {
    await this.userModel.deleteMany({});
  }
}
