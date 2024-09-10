import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from '../../address/schemas/address.schema';
import { Car } from '../../car/schemas/car.schema';
import { Role } from '../../enums/enum';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {

  @Prop({ required: false })
  cpf?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sex: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  matricula: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: Role.User;

  @Prop({ type: [Address], default: [] })
  addresses?: Address[];

  @Prop({ type: [Car], default: [] })
  cars?: Car[];

  @Prop([String])
  rides?: string[];

  @Prop([String])
  feedbacks?: string[];

  @Prop({ default: 0 })
  avgScore: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
