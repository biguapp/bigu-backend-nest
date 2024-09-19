import { Document } from 'mongoose';
import { Role } from '../../enums/enum';
import { UserResponseDto } from '../dto/response-user.dto';

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
  readonly verificationCode: string;
  readonly isVerified: boolean;
  toDTO(): UserResponseDto;
}
