import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
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
import { toZonedTime } from 'date-fns-tz';

@Injectable()
export class RideService {
  constructor(
    @InjectModel('Ride') private readonly rideModel: Model<Ride>,
    @InjectModel('Member') private readonly memberModel: Model<Member>,
    @InjectModel('Candidate') private readonly candidateModel: Model<Candidate>,
    private readonly userService: UserService,
    private readonly mailjetService: MailjetService,
  ) { }

  // Criação de uma nova carona
  // 66e093bfe2323b4802da45c3 - ENTRADA PRINCIPAL
  // 66e09414e2323b4802da45c5 - ENTRADA CEEI
  // 66e09431e2323b4802da45c7 - ENTRADA HUMANAS
  // 66e09466e2323b4802da45c9 - ENTRADA CCT
  async create(createRideDto: CreateRideDto): Promise<Ride> {
    const driver = await this.userService.findOne(createRideDto.driver);
    if (!driver) {
      throw new NotFoundException(
        'O motorista não foi encontrado na base de dados.',
      );
    }

    if (createRideDto.toWomen && driver.sex === 'Masculino') {
      throw new BadRequestException(
        'Um motorista homem não pode criar caronas só para mulheres.',
      );
    }

    const scheduledDate = new Date(createRideDto.scheduledTime);

    const timeZone = 'America/Sao_Paulo';
    const zonedDate = toZonedTime(scheduledDate, timeZone);
    if (zonedDate < new Date()) {
      throw new BadRequestException('A data agendada não pode ser no passado.');
    }

    const ride = {
      ...createRideDto,
      driver: new Types.ObjectId(createRideDto.driver),
      startAddress: new Types.ObjectId(createRideDto.startAddress),
      destinationAddress: new Types.ObjectId(createRideDto.destinationAddress),
      car: new Types.ObjectId(createRideDto.car),
      members: [],
      candidates: [],
      isOver: false,
      scheduledTime: zonedDate,
    };

    try {
      const rideCreated = await this.rideModel.create(ride);
      return rideCreated;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar uma carona');
    }
  }

  async findAll(filter: any = {}): Promise<Ride[]> {
    return await this.rideModel.find(filter);
  }

  async findOne(id: string): Promise<Ride> {
    const ride = await this.rideModel.findById(id);
    if (!ride) {
      throw new NotFoundException(`Carona com ID ${id} não foi encontrada.`);
    }

    return ride;
  }

  async update(id: string, updateRideDto: UpdateRideDto): Promise<Ride> {
    let zonedDate;
    if (updateRideDto.scheduledTime) {
      const date = new Date(updateRideDto.scheduledTime);
      const timeZone = 'America/Sao_Paulo';
      zonedDate = toZonedTime(date, timeZone);
      if (zonedDate < new Date() && !updateRideDto.isOver) {
        throw new BadRequestException('A data agendada não pode ser no passado.');
      }
    }

    const ride = {
      ...updateRideDto,
      driver: new Types.ObjectId(updateRideDto.driver),
      startAddress: new Types.ObjectId(updateRideDto.startAddress),
      destinationAddress: new Types.ObjectId(updateRideDto.destinationAddress),
      car: new Types.ObjectId(updateRideDto.car),
      ...(zonedDate && { scheduledTime: zonedDate })
    };

    const updatedRide = await this.rideModel.findByIdAndUpdate(id, ride, {
      new: true,
    });
    if (!updatedRide) {
      throw new NotFoundException(`Carona com ID ${id} não encontrado`);
    }
    return updatedRide;
  }

  async remove(id: string): Promise<Ride> {
    const result = await this.rideModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Carona com ID ${id} não encontrado`);
    }
    const membersEmails = await Promise.all(
      result.members.map((member) =>
        this.userService
          .findOne(member.user.toString())
          .then((user) => user.email)
          .catch((err) => {
            throw new NotFoundException('Erro na captura: ', err);
          }),
      ),
    );
    this.sendEmail(
      membersEmails,
      '[BIGU] Carona cancelada :(',
      `Sua carona foi cancelada.`,
    );
    return result;
  }

  async getDriverHistory(userId: string) {
    const objId = new Types.ObjectId(userId);
    const userRides = await this.rideModel
      .find({ $and: [{ driver: objId }, { isOver: true }] })
      .exec();
    return userRides;
  }

  async getMemberHistory(userId: string) {
    const objId = new Types.ObjectId(userId);
    const userRides = await this.rideModel
      .find({ $and: [{ members: objId }, { isOver: true }] })
      .exec();
    return userRides;
  }

  async getUserHistory(userId: string) {
    const objId = new Types.ObjectId(userId);
    const userRides = await this.rideModel
      .find({
        $or: [{ driver: objId }, { members: objId }],
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
    const ride: any = await this.findOne(rideId);
    if (!ride) {
      throw new NotFoundException('Carona não encontrada.');
    }
    const driver = ride.driver.toString();

    if (driver !== userId) {
      throw new BadRequestException('Somente o motorista pode encerrar a carona.');
    }

    if (ride.isOver) {
      throw new BadRequestException('A carona já foi encerrada.');
    }

    const updatedRide = {
      ...ride._doc,
      isOver: true,
    }

    const returnedRide = await this.update(rideId, updatedRide);
    await this.userService.updateRideCount(driver, true);

    for (const member of ride.members) {
      await this.userService.updateRideCount(member.user.toString(), false);
    }

    return returnedRide;
  }

  async addRatingToRide(
    rideId: string,
    ratingId: string,
    { raterId, rateeId, score }: { raterId: string, rateeId: string, score: number },
  ): Promise<void> {
    const ride = await this.rideModel.findById(rideId).exec();
    if (!ride) {
      throw new NotFoundException('Carona não encontrada.');
    }
    if (!ride.isOver) {
      throw new BadRequestException('Avaliações só podem ser feitas após o término da carona.');
    }

    /*const alreadyRated = 
      ride.driverRatings.some((id) => id.toString() === raterId) ||
      ride.memberRatings.some((id) => id.toString() === raterId);

    // o usuário pode atualizar a que já tinha, não criar uma nova
    if (alreadyRated) {
      throw new BadRequestException('O usuário já fez uma avaliação.')
    }*/

    if (ride.driver.toString() === raterId) {
      ride.driverRatings.push(ratingId);
    } else {
      ride.memberRatings.push(ratingId);
    }

    await this.userService.updateScore(rateeId, score);

    await ride.save();
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

    const updateRideDto: any = { ...ride, candidates: rideCandidates }

    return await this.update(rideId, updateRideDto);
  }

  async acceptCandidate(driverId: string, rideId: string, candidateId: string) {
    const ride: any = await this.findOne(rideId);
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
        const newRide = await this.update(rideId, {
          ...ride,
          candidates: rideCandidates,
          members: newMembers,
        });
        return newRide.toDTO();

      } else throw new NotFoundException('Candidato não encontrado.');
    } else throw new NotFoundException('Corrida não encontrada.');
  }

  async declineCandidate(
    driverId: string,
    rideId: string,
    candidateId: string,
  ) {
    const ride: any = await this.findOne(rideId);
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
            ...ride,
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
    const ride: any = await this.findOne(rideId);
    const rideMembers = ride.members;
    const rideMembersId = rideMembers.map((member) => member.user.toString());
    if (ride.driver.toString() === driverId) {
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
            ...ride,
            members: rideMembers,
          })
        ).toDTO();
      } else if (driverId === memberId) {
        this.remove(ride.id);
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
    emails: string | string[],
    subject: string,
    text: string,
  ): Promise<string> {
    const recipients = Array.isArray(emails) // Se apenas um email for fornecido, transforma-o em uma lista
      ? emails.map((email) => ({ Email: email })) // Mapeia para o formato esperado pelo Mailjet
      : [{ Email: emails }];
    const repl = await this.mailjetService.send({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL,
          },
          To: recipients,
          Subject: subject,
          TextPart: text,
        },
      ],
    });

    return repl.body.Messages[0].Status;
  }
}
