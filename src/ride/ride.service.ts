import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { Ride } from './interfaces/ride.interface';
import { UserService } from '../user/user.service';
import { Candidate } from './interfaces/candidate.interface';
import { Member } from './interfaces/member.interface';
import { MailjetService } from 'nest-mailjet';

@Injectable()
export class RideService {
  constructor(
    @InjectModel('Ride') private readonly rideModel: Model<Ride>,
    @InjectModel('Member') private readonly memberModel: Model<Member>,
    @InjectModel('Candidate') private readonly candidateModel: Model<Candidate>,
    private readonly userService: UserService,
    private readonly mailjetService: MailjetService,
  ) {}

  // Criação de um novo passeio
  // 66e093bfe2323b4802da45c3 - ENTRADA PRINCIPAL
  // 66e09414e2323b4802da45c5 - ENTRADA CEEI
  // 66e09431e2323b4802da45c7 - ENTRADA HUMANAS
  // 66e09466e2323b4802da45c9 - ENTRADA CCT
  async create(createRideDto: CreateRideDto): Promise<Ride> {
    const driver = await this.userService.findOne(createRideDto.driver)

    if (createRideDto.toWomen && driver.sex === 'Masculino') {
      throw new BadRequestException('Um motorista homem não pode criar caronas só para mulheres.');
    }

    const date = new Date(createRideDto.scheduledTime);
    const ride = {
      ...createRideDto,
      driver: new Types.ObjectId(createRideDto.driver),
      startAddress: new Types.ObjectId(createRideDto.startAddress),
      destinationAddress: new Types.ObjectId(createRideDto.destinationAddress),
      car: new Types.ObjectId(createRideDto.car),
      toWomen: createRideDto.toWomen,
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
    const updatedRide = await this.rideModel.findByIdAndUpdate(
      id,
      updateRideDto,
      { new: true },
    );
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

  async getRidesAvailableToWomen(): Promise<Ride[]> {
    const rides = await this.rideModel.find().exec();
    return rides.filter((ride) => ride.isOver === false && ride.toWomen === true);
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
    const objId = new Types.ObjectId(userId);
    const userRides = await this.rideModel
      .find({
        $and: [{ driver: objId }, { isOver: false }],
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

  async requestRide(userId: string, rideId: string, addressId: string) {
    const rideIdObj = new Types.ObjectId(rideId);
    const addressIdObj = new Types.ObjectId(addressId);

    const ride = await this.rideModel.findById(rideIdObj);
    const user = await this.userService.findOne(userId);
    const rideCandidates = ride.candidates || [];
    const userIdObj = new Types.ObjectId(userId);

    if (ride.driver.toString() === userIdObj.toString()) {
      throw new BadRequestException('Você é o motorista dessa carona.');
    }

    if (
      ride.members.some(
        (member) => member.user.toString() === userIdObj.toString(),
      )
    ) {
      throw new BadRequestException('Você já é membro dessa carona.');
    }

    if (
      ride.candidates.some(
        (candidate) => candidate.user.toString() === userIdObj.toString(),
      )
    ) {
      throw new BadRequestException('Você já é candidato a essa carona.');
    }

    if (ride.toWomen && user.sex === 'Masculino') {
      throw new BadRequestException('Essa carona é só para mulheres.');
    }

    if (ride.members.length === ride.numSeats) {
      throw new BadRequestException('Essa carona já está cheia.');
    }

    rideCandidates.push({
      user: userIdObj,
      address: addressIdObj,
    } as Candidate);

    // COTA DE 100 EMAILS POR DIA, CUIDADO NOS TESTES, PODE COMENTAR O TRECHO SE NÃO ESTIVER PRECISANDO
    await this.sendEmail(
      (await this.userService.findOne(ride.driver.toString())).email,
      '[BIGUAPP] Nova solicitação',
      'Nova solicitação de bigu!',
    );

    return await this.update(rideId, { candidates: rideCandidates });
  }

  async acceptCandidate(driverId: string, rideId: string, candidateId: string) {
    const ride = await this.findOne(rideId);
    const candidateObjId = new Types.ObjectId(candidateId);
    const rideCandidates = ride.candidates;
    const rideCandidatesId = rideCandidates.map((candidate) =>
      candidate.user.toString(),
    );
    if (ride.driver.toString() === driverId) {
      if (rideCandidatesId.includes(candidateId)) {
        const addressIdObj = rideCandidates.find(
          (candidate) => candidate.user.toString() === candidateId,
        ).address;
        const idx = rideCandidatesId.indexOf(candidateId);
        const member = new this.memberModel({
          user: candidateObjId,
          address: addressIdObj,
        });
        ride.members.push(member);
        const newMembers = ride.members;

        // COTA DE 100 EMAILS POR DIA, CUIDADO NOS TESTES, PODE COMENTAR O TRECHO SE NÃO ESTIVER PRECISANDO
        await this.sendEmail(
          (await this.userService.findOne(ride.driver.toString())).email,
          '[BIGUAPP] Solicitação aceita!',
          'Você conseguiu um bigu!',
        );

        rideCandidates.splice(idx, 1);
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
    const rideCandidates = ride.candidates;
    const rideCandidatesId = rideCandidates.map((candidate) =>
      candidate.user.toString(),
    );
    if (ride.driver.toString() === driverId) {
      if (rideCandidatesId.includes(candidateId)) {
        const idx = rideCandidatesId.indexOf(candidateId);
        rideCandidates.splice(idx, 1);

        // COTA DE 100 EMAILS POR DIA, CUIDADO NOS TESTES, PODE COMENTAR O TRECHO SE NÃO ESTIVER PRECISANDO
        await this.sendEmail(
          (await this.userService.findOne(ride.driver.toString())).email,
          '[BIGUAPP] Solicitação rejeitada!',
          'Procure outro bigu!',
        );

        return (
          await this.update(rideId, {
            candidates: rideCandidates,
          })
        ).toDTO();
      } else throw new NotFoundException('Candidato não encontrado.');
    } else throw new NotFoundException('Corrida não encontrada.');
  }

  async declineOrAcceptCandidate(
    driverId: string,
    rideId: string,
    candidateId: string,
    status: string,
  ) {
    if (status === 'declined') {
      return await this.declineCandidate(driverId, rideId, candidateId);
    } else {
      return await this.acceptCandidate(driverId, rideId, candidateId);
    }
  }

  async removeMember(driverId: string, rideId: string, memberId: string) {
    const ride = await this.findOne(rideId);
    const rideMembers = ride.members;
    const rideMembersId = rideMembers.map((member) => member.user.toString());
    if (ride.driver.toString() === driverId || driverId === memberId) {
      if (rideMembersId.includes(memberId)) {
        const idx = rideMembersId.indexOf(memberId);
        rideMembers.splice(idx, 1);

        // COTA DE 100 EMAILS POR DIA, CUIDADO NOS TESTES, PODE COMENTAR O TRECHO SE NÃO ESTIVER PRECISANDO
        await this.sendEmail(
          (await this.userService.findOne(ride.driver.toString())).email,
          '[BIGUAPP] Remoção da carona!',
          'Você perdeu um bigu!',
        );

        return (
          await this.update(rideId, {
            members: rideMembers,
          })
        ).toDTO();
      } else throw new NotFoundException('Candidato não encontrado.');
    } else throw new NotFoundException('Corrida não encontrada.');
  }

  async getCandidates(driverId: string) {
    const objId = new Types.ObjectId(driverId);
    const userRides = await this.rideModel.find({
      $and: [{ driver: objId }, { isOver: false }],
    });
    let candidates: Candidate[] = [];
    userRides.forEach((item) => {
      candidates = candidates.concat(item.candidates);
    });
    return candidates;
  }

  private async sendEmail(
    email: string,
    subject: string,
    text: string,
  ): Promise<string> {
    const repl = await this.mailjetService.send({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL,
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: subject,
          TextPart: text,
        },
      ],
    });

    return repl.body.Messages[0].Status;
  }
}
