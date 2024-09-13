import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Car } from '../../car/schemas/car.schema';
import { Document } from 'mongoose';
import { AddressResponseDto } from '@src/address/dto/response-address.dto';

@Schema()
export class Ride extends Document {
  @Prop({ required: true })
  driverId: string;

  @Prop({ type: [{ type: String }] })
  members?: string[];

  @Prop({ type: [{ type: String }] })
  candidates?: string[];

  @Prop({ type: AddressResponseDto, required: true })
  startAddress: AddressResponseDto;

  @Prop({ type: AddressResponseDto, required: true })
  destinationAddress: AddressResponseDto;

  @Prop({ required: true })
  numSeats: number;

  @Prop({ required: true })
  goingToCollege: boolean;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  scheduledTime: Date;

  @Prop({ type: Car, required: true })
  car: Car;

  @Prop()
  description?: string;

  @Prop({ required: true })
  toWomen: boolean;

  @Prop( { required: true })
  isOver: boolean;
}

export const RideSchema = SchemaFactory.createForClass(Ride);
