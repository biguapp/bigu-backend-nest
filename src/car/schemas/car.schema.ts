import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Car extends Document {
  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  carModel: string;

  @Prop()
  modelYear?: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true, unique: true })
  plate: string;
}

export const CarSchema = SchemaFactory.createForClass(Car);
