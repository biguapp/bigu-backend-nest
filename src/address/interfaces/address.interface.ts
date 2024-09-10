import { Role } from '../../enums/enum';
import { Document } from 'mongoose';

export interface Address extends Document {
  readonly rua: string;
  readonly numero: string;
  readonly complemento?: string;
  readonly bairro: string;
  readonly cidade: string;
  readonly estado: string;
  readonly cep: string;
}
