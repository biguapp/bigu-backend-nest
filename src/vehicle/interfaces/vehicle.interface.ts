import { Document } from 'mongoose';
import { VehicleResponseDto } from '../dto/response-vehicle.dto';

export interface Vehicle extends Document {
  readonly brand: string;
  readonly vehicleModel: string;
  readonly modelYear?: string;
  readonly color: string;
  readonly avgConsumption: number;
  readonly plate: string;
  readonly user: string;
  readonly type: string;

  toDTO(): VehicleResponseDto;
}