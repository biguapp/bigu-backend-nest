import { Role } from '../../enums/enum';
import { Document } from 'mongoose';

export interface Patient extends Document {
  readonly role: Role;
  readonly cpf: string;
  readonly nome: string;
  readonly nomeSocial?: string;
  readonly nomeMae: string;
  readonly nomePai?: string;
  readonly numeroSus: string;
  readonly tipoSanguineo?: string;
  readonly dataNascimento: Date;
  readonly sexo: string;
  readonly estadoCivil?: string;
  readonly email: string;
  readonly password: string;
  readonly celular: string;
  readonly racaCor?: string;
  readonly endereco: {
    readonly rua?: string;
    readonly numero?: string;
    readonly complemento?: string;
    readonly bairro?: string;
    readonly cidade?: string;
    readonly estado?: string;
    readonly cep?: string;
  };
}
