import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from '../../address/schemas/address.schema';
import { Car } from '../../car/schemas/car.schema';
import { User } from '../../user/schemas/user.schema';
import { Document } from 'mongoose';

@Schema()
export class Ride extends Document {
  @Prop({ required: true })
  driverId: string;

  @Prop({ type: [{ type: String }] })
  members?: string[];

  @Prop({ type: [{ type: String }] })
  candidates?: string[];

  @Prop({ type: String, required: true })
  startAddress: string;

  @Prop({ type: String, required: true })
  destinationAddress: string;

  @Prop({ required: true })
  numSeats: number;

  @Prop({ required: true })
  goingToCollege: boolean;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  scheduledTime: Date;

  @Prop({ type: String, required: true })
  car: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  toWomen: boolean;

  @Prop( { required: true })
  isOver: boolean;
}

export const RideSchema = SchemaFactory.createForClass(Ride);
