import { Document } from 'mongoose';
import { Car } from '@src/car/interfaces/car.interface';
import { User } from '@src/user/interfaces/user.interface';
import { Address } from '@src/address/interfaces/address.interface';
import { RideResponseDto } from '../dto/response-ride.dto';

export interface Ride extends Document {
  driver: User;
  members?: User[];
  candidates?: User[];
  startAddress: Address;
  destinationAddress: Address;
  numSeats: number;
  goingToCollege: boolean;
  price: number;
  scheduledTime: Date;
  car: Car;
  description?: string;
  toWomen: boolean;
  isOver: boolean;

  toDTO(): RideResponseDto
}
