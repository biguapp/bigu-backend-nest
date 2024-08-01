import { Schema } from 'mongoose';
import { HealthUnitType, ServiceType } from '../../enums'; // Atualize o caminho conforme necessário

// Define o schema para o horário de funcionamento
const OperatingHoursSchema = new Schema({
  abertura: { type: String, required: true }, // Ex: '08:00'
  fechamento: { type: String, required: true } // Ex: '18:00'
});

// Define o schema para o grupo de horários de funcionamento por dia da semana
const OperatingHoursGroupSchema = new Schema({
  segunda: { type: OperatingHoursSchema },
  terca: { type: OperatingHoursSchema },
  quarta: { type: OperatingHoursSchema },
  quinta: { type: OperatingHoursSchema },
  sexta: { type: OperatingHoursSchema },
  sabado: { type: OperatingHoursSchema },
  domingo: { type: OperatingHoursSchema }
});

// Define o schema para o endereço
const AddressSchema = new Schema({
  rua: { type: String },
  numero: { type: String },
  complemento: { type: String },
  bairro: { type: String },
  cidade: { type: String },
  estado: { type: String },
  cep: { type: String }
});

// Define o schema para a especialidade
const SpecialtySchema = new Schema({
  nome: { type: String, required: true }, // Ex: 'Pediatra'
  horarioFuncionamento: { type: OperatingHoursGroupSchema }
});

// Define o schema para a avaliação
const RatingSchema = new Schema({
  nota: { type: Number, min: 0, max: 5, required: true }, // Nota de 0 a 5
  descricao: { type: String }
});

// Define o schema principal para a unidade de saúde
export const HealthUnitSchema = new Schema({
  nome: { type: String, required: true },
  tipo: { type: String, enum: Object.values(HealthUnitType), required: true }, // Enum para tipo de unidade de saúde
  endereco: { type: AddressSchema },
  horarioFuncionamento: { type: OperatingHoursGroupSchema },
  servicosOfertados: { type: [String], enum: Object.values(ServiceType) }, // Enum para serviços oferecidos
  telefoneContato: { type: String, required: true },
  emailContato: { type: String, required: true },
  especialidadesDisponiveis: { type: [SpecialtySchema] }, // Lista de especialidades disponíveis
  avaliacao: { type: RatingSchema } // Avaliação opcional
});
