import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { VehicleResponseDto } from '../dto/response-vehicle.dto';

export enum VehicleType {
  CAR = 'CAR',
  MOTORCYCLE = 'MOTORCYCLE',
}

@Schema()
export class Vehicle extends Document {
  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  vehicleModel: string;

  @Prop()
  modelYear?: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  plate: string;

  @Prop({ required: true })
  user: string;

  @Prop({ required: true, enum: VehicleType })
  type: VehicleType;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.methods.toDTO = function (): VehicleResponseDto {
  return {
    vehicleId: this.id,
    brand: this.brand,
    vehicleModel: this.vehicleModel,
    plate: this.plate,
    modelYear: this.modelYear,
    color: this.color,
    type: this.type
  };
};
