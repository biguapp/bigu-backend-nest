import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HealthUnitType, ServiceType } from '../../enums/enum'; // Atualize o caminho conforme necessário

// Define o schema para o horário de funcionamento
@Schema()
export class OperatingHours {
  @Prop({ required: true })
  abre: string; // Ex: '08:00'

  @Prop({ required: true })
  fecha: string; // Ex: '18:00'
}

export const OperatingHoursSchema = SchemaFactory.createForClass(OperatingHours);

// Define o schema para o grupo de horários de funcionamento por dia da semana
@Schema()
export class OperatingHoursGroup {
  @Prop({ type: OperatingHoursSchema })
  segunda?: OperatingHours;

  @Prop({ type: OperatingHoursSchema })
  terca?: OperatingHours;

  @Prop({ type: OperatingHoursSchema })
  quarta?: OperatingHours;

  @Prop({ type: OperatingHoursSchema })
  quinta?: OperatingHours;

  @Prop({ type: OperatingHoursSchema })
  sexta?: OperatingHours;

  @Prop({ type: OperatingHoursSchema })
  sabado?: OperatingHours;

  @Prop({ type: OperatingHoursSchema })
  domingo?: OperatingHours;
}

export const OperatingHoursGroupSchema = SchemaFactory.createForClass(OperatingHoursGroup);

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

  @Prop()
  cep?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

// Define o schema para a especialidade
@Schema()
export class Specialty {
  @Prop({ required: true })
  nome: string; // Ex: 'Pediatra'

  @Prop({ type: OperatingHoursGroupSchema })
  horarioFuncionamento?: OperatingHoursGroup;
}

export const SpecialtySchema = SchemaFactory.createForClass(Specialty);

// Define o schema para a avaliação
@Schema()
export class Rating {
  @Prop({ required: true, min: 0.0, max: 5.0 })
  nota: number; // Nota de 0 a 5

  @Prop()
  descricao?: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);

// Define o schema principal para HealthUnit
@Schema()
export class HealthUnit extends Document {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true, enum: Object.values(HealthUnitType) })
  tipo: HealthUnitType; // Enum para tipo de unidade de saúde

  @Prop({ type: AddressSchema })
  endereco?: Address;

  @Prop({ type: OperatingHoursGroupSchema })
  horarioFuncionamento?: OperatingHoursGroup;

  @Prop({ type: [String], enum: Object.values(ServiceType) })
  servicosOfertados?: ServiceType[]; // Enum para serviços oferecidos

  @Prop({ required: true })
  telefoneContato: string;

  @Prop({ required: true })
  emailContato: string;

  @Prop({ type: [SpecialtySchema] })
  especialidadesDisponiveis?: Specialty[];

  @Prop({ type: RatingSchema })
  avaliacao?: Rating; // Avaliação opcional
}

export const HealthUnitSchema = SchemaFactory.createForClass(HealthUnit);
