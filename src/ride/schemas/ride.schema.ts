import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Car } from '../../car/schemas/car.schema';
import { Document } from 'mongoose';
import { CarResponseDto } from '@src/car/dto/response-car.dto';
import { Address } from '@src/address/schemas/address.schema';

@Schema()
export class Ride extends Document {
  @Prop({ required: true })
  driverId: string;

  @Prop({ type: [{ type: String }] })
  members?: string[];

  @Prop({ type: [{ type: String }] })
  candidates?: string[];

  @Prop({ type: Address, required: true })
  startAddress: Address;

  @Prop({ type: Address, required: true })
  destinationAddress: Address;

  @Prop({ required: true })
  numSeats: number;

  @Prop({ required: true })
  goingToCollege: boolean;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  scheduledTime: Date;

  @Prop({ type: CarResponseDto, required: true })
  car: Car;

  @Prop()
  description?: string;

  @Prop({ required: true })
  toWomen: boolean;

  @Prop( { required: true })
  isOver: boolean;
}

export const RideSchema = SchemaFactory.createForClass(Ride);
