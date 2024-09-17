import { Document } from 'mongoose';
import { CarResponseDto } from '../dto/response-car.dto';

export interface Car extends Document {
  readonly brand: string;
  readonly carModel: string;
  readonly modelYear?: string;
  readonly color: string;
  readonly plate: string;
  readonly user: string

  toDTO(): CarResponseDto;
}