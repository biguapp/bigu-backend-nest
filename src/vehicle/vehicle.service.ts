import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './interfaces/vehicle.interface';
import { Ride } from '../ride/interfaces/ride.interface';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel('Vehicle') private vehicleModel: Model<Vehicle>,
    @InjectModel('Ride') private rideModel: Model<Ride>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto, userId: string): Promise<Vehicle> {
    const newVehicle = { ...createVehicleDto, user: userId };
    const vehicle = new this.vehicleModel(newVehicle);

    return await vehicle.save();
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleModel.find().exec();
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }
    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const updatedVehicle = await this.vehicleModel
      .findByIdAndUpdate(id, updateVehicleDto, { new: true })
      .exec();
    if (!updatedVehicle) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }
    return updatedVehicle;
  }

  async remove(id: string): Promise<Vehicle> {
    const exists = await this.rideModel.findOne({ vehicle: id, isOver: false });
    if (exists)
      throw new BadRequestException(
        'O veículo está sendo utilizado em uma carona e não pode ser removido.',
      );
    const result = await this.vehicleModel.findByIdAndDelete(id).exec();
    if (!result)
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);

    return result;
  }

  async removeAll(): Promise<void> {
    const result = await this.vehicleModel.deleteMany();
  }

  async getUserVehicles(userId: string): Promise<Vehicle[]> {
    const vehicles = await this.vehicleModel.find({ user: userId }).exec();
    return vehicles;
  }
}
