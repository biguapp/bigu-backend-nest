import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { Ride } from './interfaces/ride.interface';
import { Ride as RideSchema } from './schemas/ride.schema';
import { UserService } from '../user/user.service';
import { isObject } from 'class-validator';

@Injectable()
export class RideService {
  constructor(
    @InjectModel('Ride') private readonly rideModel: Model<RideSchema>,
    private readonly userService: UserService,
  ) {}

  // Criação de um novo passeio
  // 66e093bfe2323b4802da45c3 - ENTRADA PRINCIPAL
  // 66e09414e2323b4802da45c5 - ENTRADA CEEI
  // 66e09431e2323b4802da45c7 - ENTRADA HUMANAS
  // 66e09466e2323b4802da45c9 - ENTRADA CCT
  async create(createRideDto: CreateRideDto): Promise<Ride> {
    const date = new Date(createRideDto.scheduledTime);
    const ride = {
      ...createRideDto,
      members: [],
      candidates: [],
      isOver: false,
    };
    const newRide = new this.rideModel(ride);
    newRide.scheduledTime = date;
    return newRide.save();
  }

  // Listar todos os passeios
  async findAll(): Promise<Ride[]> {
    return await this.rideModel.find().exec();
  }

  async findOne(id: string): Promise<Ride> {
    const ride = await this.rideModel.findById(id).exec();
    if (!ride) {
      throw new NotFoundException(`Passeio com ID ${id} não encontrado`);
    }
    return ride;
  }

  // Atualizar um passeio por ID
  async update(id: string, updateRideDto: UpdateRideDto): Promise<Ride> {
    const updatedRide = await this.rideModel
      .findByIdAndUpdate(id, updateRideDto, { new: true })
      .exec();
    if (!updatedRide) {
      throw new NotFoundException(`Passeio com ID ${id} não encontrado`);
    }
    return updatedRide;
  }

  // Remover um passeio por ID
  async remove(id: number): Promise<void> {
    const result = await this.rideModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Passeio com ID ${id} não encontrado`);
    }
  }

  async getRidesAvailable(): Promise<Ride[]> {
    const rides = await this.rideModel.find().exec();
    return rides.filter((ride) => ride.isOver === false);
  }

  async getDriverHistory(userId: string) {
    const userRides = await this.rideModel
      .find({ $and: [{ driverId: userId }, { isOver: true }] })
      .exec();
    return userRides;
  }

  async getMemberHistory(userId: string) {
    const userRides = await this.rideModel
      .find({ $and: [{ members: userId }, { isOver: true }] })
      .exec();
    return userRides;
  }

  async getUserHistory(userId: string) {
    const userRides = await this.rideModel
      .find({
        $or: [{ driverId: userId }, { members: userId }],
        $and: [{ isOver: true }],
      })
      .exec();
    return userRides;
  }

  async getDriverActiveRides(userId: string) {
    const userRides = await this.rideModel
      .find({
        $and: [{ driverId: userId }, { isOver: false }],
      })
      .exec();
    return userRides;
  }

  async getMemberActiveRides(userId: string) {
    const userRides = await this.rideModel
      .find({
        $and: [{ members: userId }, { isOver: false }],
      })
      .exec();
    return userRides;
  }

  async setRideOver(userId: string, rideId: string) {
    const ride = await this.findOne(rideId);
    if (ride.driverId === userId) {
      return await this.update(rideId, { isOver: true });
    } else throw new NotFoundException('Corrida não encontrada.');
  }
}
