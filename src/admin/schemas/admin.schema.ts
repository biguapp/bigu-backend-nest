import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Admin extends Document {

  @Prop({ required: true, unique: true})
  email: string;

  @Prop({ required: true })
  password: string;
}

export const AdminSchema = { name: 'Admin', schema: Admin };
