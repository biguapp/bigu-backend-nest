import { Role } from '@src/enums/enum';
import { Document } from 'mongoose';

export interface Admin extends Document {
  readonly email: string;
  readonly password: string;
  readonly role: Role;
}
