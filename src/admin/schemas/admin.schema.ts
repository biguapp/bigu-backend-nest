import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../enums/enum';
import { Document } from 'mongoose';

@Schema()
export class Admin extends Document {

  @Prop({ required: true, unique: true})
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: Role;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
