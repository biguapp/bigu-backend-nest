import { Document, Types } from 'mongoose';
import { Vehicle } from '@src/vehicle/interfaces/vehicle.interface';
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
  //readonly price: number;
  readonly scheduledTime: Date;
  readonly vehicle: Vehicle;
  readonly description?: string;
  readonly toWomen: boolean;
  readonly isOver: boolean;
  readonly driverRatings: string[];  // feitas pelo motorista
  readonly memberRatings: string[];  // feitas pelos membros

  toDTO(): RideResponseDto
}
