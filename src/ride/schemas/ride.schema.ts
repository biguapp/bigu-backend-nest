import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from '../../address/schemas/address.schema';
import { Car } from '../../car/schemas/car.schema';
import { User } from '../../user/schemas/user.schema';
import { Document } from 'mongoose';

@Schema()
export class Ride extends Document {

  @Prop()
  driverId?: string;

  @Prop({ type: [{ type: User }] })
  members?: User[];

  @Prop({ type: [{ type: User }] })
  candidates?: User[];

  @Prop({ type: Address })
  startAddress?: Address;

  @Prop({ type: Address })
  destinationAddress?: Address;

  @Prop({ required: true })
  numSeats: number;

  @Prop()
  goingToCollege?: boolean;

  @Prop()
  distance?: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  scheduledTime: Date;

  @Prop({ type: Car })
  car: Car;

  @Prop()
  description?: string;

  @Prop()
  toWomen?: boolean;

  @Prop()
  isOver?: boolean;
}

export const RideSchema = SchemaFactory.createForClass(Ride);
