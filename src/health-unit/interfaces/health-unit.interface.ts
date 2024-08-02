import { Document } from 'mongoose';
import { HealthUnitType, ServiceType } from '../../enums'; // Atualize o caminho conforme a localização do seu arquivo de enums

// Define a interface para o horário de funcionamento
interface OperatingHours {
  abre: string; // Ex: '08:00'
  fecha: string; // Ex: '18:00'
}

// Define a interface para o grupo de horários de funcionamento por dia da semana
interface OperatingHoursGroup {
  segunda?: OperatingHours;
  terca?: OperatingHours;
  quarta?: OperatingHours;
  quinta?: OperatingHours;
  sexta?: OperatingHours;
  sabado?: OperatingHours;
  domingo?: OperatingHours;
}

// Define a interface para o endereço
interface Address {
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

// Define a interface para a especialidade
interface Specialty {
  nome: string; // Ex: 'Pediatra'
  horarioFuncionamento: OperatingHoursGroup;
}

// Define a interface para a avaliação
interface Rating {
  nota: number; // De 0 a 5
  descricao?: string; // Ex: 'Ótimo atendimento'
}

export interface HealthUnit extends Document {
  readonly nome: string;
  readonly tipo: HealthUnitType; // Enum para tipo de unidade de saúde
  readonly endereco: Address; // Endereço detalhado
  readonly horarioFuncionamento: OperatingHoursGroup; // Horários de funcionamento agrupados por dia
  readonly servicosOfertados: ServiceType[]; // Enum para serviços oferecidos
  readonly telefoneContato: string;
  readonly emailContato: string;
  readonly especialidadesDisponiveis?: Specialty[]; // Lista de especialidades disponíveis
  readonly avaliacao?: Rating; // Avaliação opcional
}
