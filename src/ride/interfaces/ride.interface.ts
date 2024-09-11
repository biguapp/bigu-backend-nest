import { Address } from '../../address/interfaces/address.interface';
import { Car } from '../../car/interfaces/car.interface';
import { User } from '../../user/interfaces/user.interface';
import { Document } from 'mongoose';

export interface Ride extends Document {
  readonly driverId?: string;
  readonly members?: string[];
  readonly candidates?: string[];
  readonly startAddress?: string;
  readonly destinationAddress?: string;
  readonly numSeats: number;
  readonly goingToCollege?: boolean;
  readonly distance?: number;
  readonly price: number;
  readonly scheduledTime: Date;
  readonly car: Car;
  readonly description?: string;
  readonly toWomen?: boolean;
  readonly isOver?: boolean;
}
