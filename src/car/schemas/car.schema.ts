import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CarResponseDto } from '../dto/response-car.dto';

@Schema()
export class Car extends Document {
  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  carModel: string;

  @Prop()
  modelYear?: string;

  @Prop({ required: true })
  avgConsumption: number;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true})
  plate: string;

  @Prop({ required: true})
  user: string;
}

export const CarSchema = SchemaFactory.createForClass(Car);

CarSchema.methods.toDTO = function (): CarResponseDto {
  return {
    carId: this.id,
    brand: this.brand,
    carModel: this.carModel,
    avgConsumption: this.avgConsumption,
    plate: this.plate,
    modelYear: this.modelYear,
    color: this.color
  };
};
