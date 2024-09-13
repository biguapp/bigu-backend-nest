import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AddressResponseDto } from '../dto/response-address.dto';

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

AddressSchema.methods.toDTO = function (): AddressResponseDto {
  return {
    rua: this.rua,
    nome: this.nome,
    cidade: this.cidade,
    numero: this.numero,
    bairro: this.bairro,
    estado: this.estado,
    addressId: this.id
  };
};
