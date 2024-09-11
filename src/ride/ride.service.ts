import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { Ride } from './interfaces/ride.interface';
import { Ride as RideSchema } from './schemas/ride.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class RideService {
  constructor(
    @InjectModel('Ride') private readonly rideModel: Model<RideSchema>,
    private readonly userService: UserService
  ) {}

  // Criação de um novo passeio
  // 66e093bfe2323b4802da45c3 - ENTRADA PRINCIPAL
  // 66e09414e2323b4802da45c5 - ENTRADA CEEI
  // 66e09431e2323b4802da45c7 - ENTRADA HUMANAS
  // 66e09466e2323b4802da45c9 - ENTRADA CCT
  async create(createRideDto: CreateRideDto): Promise<Ride> {
    const newRide = new this.rideModel();
    newRide.driverId = createRideDto.driverId;
    if (createRideDto.goingToCollege) {
      newRide.startAddress = (
        await this.userService.findOne(newRide.driverId)
      ).addresses.at(createRideDto.driverAddress);
      switch (createRideDto.collegeAddress) {
        case 1:
          newRide.startAddress = '66e09414e2323b4802da45c5';
          break;
        case 2:
          newRide.startAddress = '66e09431e2323b4802da45c7';
          break;
        case 3:
          newRide.startAddress = '66e09466e2323b4802da45c9';
          break;
        default:
          newRide.startAddress = '66e093bfe2323b4802da45c3';
          break;
      }
    }
    return await newRide.save();
  }

  // Listar todos os passeios
  async findAll(): Promise<Ride[]> {
    return await this.rideModel.find().exec();
  }

  async findOne(id: string): Promise<Ride> {
    console.log(id)
    console.log(id)
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

  async getDriverRides(userId: string) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    if (user.rides.length > 0) {
      const rides: Ride[] = await Promise.all(
        user.rides.map((rideId) => this.findOne(rideId)),
      );

      const rideDriverActive = rides.filter((ride) => ride.driverId === userId && ride.isOver === false)
      
      return rideDriverActive;
    } 
    return []
  }

}
