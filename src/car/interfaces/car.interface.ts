import { Document } from 'mongoose';

export interface Car extends Document {
  readonly brand: string;
  readonly carModel: string;
  readonly modelYear?: string;
  readonly color: string;
  readonly plate: string;
}
