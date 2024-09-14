import { Document } from 'mongoose';
import { AddressResponseDto } from '../dto/response-address.dto';

export interface Address extends Document {
  readonly rua: string;
  readonly numero: string;
  readonly complemento?: string;
  readonly bairro: string;
  readonly cidade: string;
  readonly estado: string;
  readonly cep: string;
  readonly user: string

  toDTO(): AddressResponseDto;
}
