import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Address extends Document {

  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  rua: string;

  @Prop({ required: true })
  numero: string;

  @Prop()
  complemento?: string;

  @Prop({ required: true })
  bairro: string;

  @Prop({ required: true })
  cidade: string;

  @Prop({ required: true })
  estado: string;

  @Prop({ required: true, match: /^[0-9]{5}-?[0-9]{3}$/ })
  cep: string;

  @Prop()
  user: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
