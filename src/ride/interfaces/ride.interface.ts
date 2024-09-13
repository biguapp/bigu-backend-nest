import { AddressResponseDto } from '@src/address/dto/response-address.dto';
import { Document } from 'mongoose';
import { CarResponseDto } from '@src/car/dto/response-car.dto';
import { Car } from '@src/car/interfaces/car.interface';
import { Address } from '@src/address/interfaces/address.interface';

export interface Ride extends Document {
  readonly driverId: string;
  readonly members?: string[];
  readonly candidates?: string[];
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
}
