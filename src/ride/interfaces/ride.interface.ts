import { Document, Types } from 'mongoose';
import { Car } from '@src/car/interfaces/car.interface';
import { User } from '@src/user/interfaces/user.interface';
import { Address } from '@src/address/interfaces/address.interface';
import { RideResponseDto } from '../dto/response-ride.dto';
import { Candidate } from './candidate.interface';
import { Member } from '../schemas/member.schema';

export interface Ride extends Document {
  readonly rideId: string;
  readonly driver: User;
  readonly members?: Member[];
  readonly candidates?: Candidate[];
  readonly startAddress: Address;
  readonly destinationAddress: Address;
  readonly numSeats: number;
  readonly goingToCollege: boolean;
  readonly price: number;
  readonly scheduledTime: Date;
  readonly car: Car;
  readonly description?: string;
  readonly toWomen: boolean;
  readonly isOver: boolean;

  toDTO(): RideResponseDto
}
