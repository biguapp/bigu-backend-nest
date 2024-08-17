import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../enums/enum';
import { Document } from 'mongoose';

// Define o schema para o endereço
@Schema()
export class Address {
  @Prop()
  rua?: string;

  @Prop()
  numero?: string;

  @Prop()
  complemento?: string;

  @Prop()
  bairro?: string;

  @Prop()
  cidade?: string;

  @Prop()
  estado?: string;

  @Prop({ match: /^[0-9]{8}$/ })
  cep?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema()
export class Patient extends Document {
  @Prop({ required: true })
  role: Role;

  @Prop({ required: true, unique: true, match: /^[0-9]{11}$/ })
  cpf: string;

  @Prop({ required: true })
  nome: string;

  @Prop()
  nomeSocial?: string;

  @Prop({ required: true })
  nomeMae: string;

  @Prop()
  nomePai?: string;

  @Prop({ required: true, match: /^[0-9]{15}$/ })
  numeroSus: string;

  @Prop({ enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], default: 'O+' })
  tipoSanguineo?: string;

  @Prop({
    required: true,
    validate: {
      validator: function (value: Date) {
        return value.getTime() < Date.now();
      },
      message: 'Data de nascimento deve ser no passado.',
    },
  })
  dataNascimento: Date;

  @Prop({ required: true, enum: ['Masculino', 'Feminino', 'Outro'] })
  sexo: string;

  @Prop({ enum: ['Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'Outro'] })
  estadoCivil?: string;

  @Prop({ required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, match: /^\(\d{2}\) \d{5}-\d{4}$/ })
  celular: string;

  @Prop({ enum: ['Branco', 'Preto', 'Pardo', 'Amarelo', 'Indígena', 'Outro'] })
  racaCor?: string;

  @Prop({
    type: AddressSchema,
    default: {}
  })
  endereco?: Address;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
