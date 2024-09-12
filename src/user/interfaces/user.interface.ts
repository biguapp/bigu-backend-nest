import { Document } from 'mongoose';
import { Address } from '../../address/interfaces/address.interface';
import { Role } from '../../enums/enum';
import { Car } from '../../car/interfaces/car.interface';

export interface User extends Document {
  readonly name: string;
  readonly sex: string;
  readonly email: string;
  readonly matricula: string;
  readonly phoneNumber: string;
  readonly password: string;
  readonly role?: Role;
  readonly feedbacks?: string[];
  readonly avgScore?: number;
}
