import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating } from './interfaces/rating.interface';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Ride } from '@src/ride/interfaces/ride.interface';
import { UserService } from '@src/user/user.service';
import { RideService } from '@src/ride/ride.service';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel('Rating') private readonly ratingModel: Model<Rating>,
    @InjectModel('Ride') private readonly rideModel: Model<Ride>,
    private readonly userService: UserService,
    private readonly rideService: RideService,
  ) {}

  async create(
    createRatingDto: CreateRatingDto,
    raterId: string,
  ): Promise<Rating> {
    const raterName = (await this.userService.findOne(raterId)).name;
    const raterSex = (await this.userService.findOne(raterId)).sex;
    const newRating = { ...createRatingDto, raterId, raterName, raterSex };
    const rating = new this.ratingModel(newRating);
    const { rideId, rateeId, score } = createRatingDto;
    await this.rideService.addRatingToRide(rideId, rating._id.toString(), {
      raterId,
      rateeId,
      score,
    });
    return await rating.save();
  }

  async addMemberRating(
    createRatingDto: CreateRatingDto,
    raterId: string,
  ): Promise<Rating> {
    const raterName = (await this.userService.findOne(raterId)).name;
    const newRating = { ...createRatingDto, raterId, raterName };
    const rating = new this.ratingModel(newRating);
    return await rating.save();
  }

  async getUserSubmittedRatings(userId: string): Promise<Rating[]> {
    if (!this.userService.findOne(userId)) {
      throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);
    }
    return await this.ratingModel.find({ raterId: userId }).exec();
  }

  async getUserRatings(userId: string): Promise<Rating[]> {
    if (!this.userService.findOne(userId)) {
      throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);
    }
    return await this.ratingModel.find({ rateeId: userId }).exec();
  }

  async updateDriverRating(
    ratingId: string,
    updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    const rating = await this.ratingModel
      .findByIdAndUpdate(ratingId, updateRatingDto, { new: true })
      .exec();
    if (!rating) {
      throw new NotFoundException(
        `Avaliação de motorista com ID ${ratingId} não encontrada.`,
      );
    }
    return rating;
  }

  async updateMemberRating(
    ratingId: string,
    updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    const rating = await this.ratingModel
      .findByIdAndUpdate(ratingId, updateRatingDto, { new: true })
      .exec();
    if (!rating) {
      throw new NotFoundException(
        `Avaliação de membro com ID ${ratingId} não encontrada.`,
      );
    }
    return rating;
  }

  async removeDriverRating(ratingId: string): Promise<Rating> {
    const rating = await this.ratingModel.findByIdAndDelete(ratingId).exec();
    if (!rating) {
      throw new NotFoundException(
        `Avaliação de motorista com ID ${ratingId} não encontrada.`,
      );
    }
    return rating;
  }

  async removeMemberRating(ratingId: string): Promise<Rating> {
    const rating = await this.ratingModel.findByIdAndDelete(ratingId).exec();
    if (!rating) {
      throw new NotFoundException(
        `Avaliação de membro com ID ${ratingId} não encontrada.`,
      );
    }
    return rating;
  }

  async findOne(id: string): Promise<Rating> {
    const rating = await this.ratingModel.findById(id).exec();
    if (!rating) {
      throw new NotFoundException(`Avaliação com ID ${id} não encontrada.`);
    }
    return rating;
  }

  async findAll(): Promise<Rating[]> {
    return await this.ratingModel.find().exec();
  }

  async removeAll(): Promise<void> {
    await this.ratingModel.deleteMany().exec();
  }
}
