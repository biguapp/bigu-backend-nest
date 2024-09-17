import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { Ride } from './interfaces/ride.interface';
import { ResendService } from '@src/resend/resend.service';
import { UserService } from '@src/user/user.service';
import { AskAndAcceptRideDto } from './dto/ask-ride.dto';

@Injectable()
export class RideService {
  constructor(
    @InjectModel('Ride') private readonly rideModel: Model<Ride>,
    private readonly resendService: ResendService,
    private readonly userService: UserService
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
      driver: new Types.ObjectId(createRideDto.driver),
      startAddress: new Types.ObjectId(createRideDto.startAddress),
      destinationAddress: new Types.ObjectId(createRideDto.destinationAddress),
      car: new Types.ObjectId(createRideDto.car),
      members: [],
      candidates: [],
      isOver: false,
      scheduledTime: date,
    };
    const newRide = await this.rideModel.create(ride);
    return newRide;
  }

  async findAll(): Promise<Ride[]> {
    return await this.rideModel.find();
  }

  async findOne(id: string): Promise<Ride> {
    const ride = await this.rideModel.findById(id);
    if (!ride) {
      throw new NotFoundException(`Passeio com ID ${id} não encontrado`);
    }
    return ride;
  }

  async update(id: string, updateRideDto: UpdateRideDto): Promise<Ride> {
    const updatedRide = await this.rideModel
      .findByIdAndUpdate(id, updateRideDto, { new: true });
    if (!updatedRide) {
      throw new NotFoundException(`Passeio com ID ${id} não encontrado`);
    }
    return updatedRide;
  }

  async remove(id: string): Promise<Ride> {
    const result = await this.rideModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Passeio com ID ${id} não encontrado`);
    }
    return result;
  }

  async getRidesAvailable(): Promise<Ride[]> {
    const rides = await this.rideModel.find().exec();
    return rides.filter((ride) => ride.isOver === false);
  }

  async getDriverHistory(userId: string) {
    const userRides = await this.rideModel
      .find({ $and: [{ driver: userId }, { isOver: true }] })
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
        $or: [{ driver: userId }, { members: userId }],
        $and: [{ isOver: true }],
      })
      .exec();
    return userRides;
  }

  async getDriverActiveRides(userId: string) {
    const userRides = await this.rideModel
      .find({
        $and: [{ driver: userId }, { isOver: false }],
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
    if (ride.driver.id === userId) {
      return await this.update(rideId, { isOver: true } as UpdateRideDto);
    } else throw new NotFoundException('Corrida não encontrada.');
  }

  async requestRide(userId: string, rideId: string) {
    const rideIdObj = new Types.ObjectId(rideId);
    
    const ride = await this.rideModel.findById(rideIdObj);
    const rideCandidates = ride.candidates || [];
    const userIdObj = new Types.ObjectId(userId);
    
    if (ride.driver.toString() === userIdObj.toString()) {
        throw new BadRequestException('Você é o motorista dessa carona.');
    }
    
    if (ride.members.some(member => member.toString() === userIdObj.toString())) {
        throw new BadRequestException('Você já é membro dessa carona.');
    }
    
    if (ride.candidates.some(candidate => candidate.toString() === userIdObj.toString())) {
        throw new BadRequestException('Você já é candidato a essa carona.');
    }
    
    if (ride.members.length === ride.numSeats) {
        throw new BadRequestException('Essa carona já está cheia.');
    }

    rideCandidates.push(userIdObj);
    await this.resendService.send({
        from: 'biguapp@hotmail.com',
        to: (await this.userService.findOne(ride.driver.toString())).email,
        subject: '[BIGUAPP] Nova solicitação',
        html: '<strong>Nova solicitação de bigu!</strong>',
    });
    
    return await this.update(rideId, { candidates: rideCandidates });
  }

  async acceptCandidate(driverId: string, rideId: string, candidateId: string) {
    const ride = await this.findOne(rideId);
    const candidateIdObj = new Types.ObjectId(candidateId);
    const rideCandidates = ride.candidates;
    if (ride.driver.toString() === driverId) {
      if (rideCandidates.includes(candidateIdObj)) {
        const idx = rideCandidates.indexOf(candidateIdObj);
        ride.members.push(candidateIdObj);
        const newMembers = ride.members;
        await this.resendService.send({
          from: 'biguapp@hotmail.com',
          to: (await this.userService.findOne(ride.driver.toString())).email,
          subject: '[BIGUAPP] Solicitação aceita!',
          html: '<strong>Você conseguiu um bigu!</strong>',
        })
        rideCandidates.splice(idx, 1)
        return (
          await this.update(rideId, {
            candidates: rideCandidates,
            members: newMembers,
          })
        ).toDTO();
      } else throw new NotFoundException('Candidato não encontrado.');
    } else throw new NotFoundException('Corrida não encontrada.');
  }

  async declineCandidate(
    driverId: string,
    rideId: string,
    candidateId: string,
  ) {
    const ride = await this.findOne(rideId);
    const candidateIdObj = new Types.ObjectId(candidateId);
    const rideCandidates = ride.candidates;
    if (ride.driver.toString() === driverId) {
      if (rideCandidates.includes(candidateIdObj)) {
        const idx = rideCandidates.indexOf(candidateIdObj);
        rideCandidates.splice(idx, 1)
        return (
          await this.update(rideId, {
            candidates: rideCandidates,
          })
        ).toDTO();
      } else throw new NotFoundException('Candidato não encontrado.');
    } else throw new NotFoundException('Corrida não encontrada.');
  }
}
