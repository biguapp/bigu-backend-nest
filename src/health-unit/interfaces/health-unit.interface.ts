import { Document } from 'mongoose';

export interface HealthUnit extends Document {
  readonly name: string;
  readonly type: string;
  readonly address: string;
  readonly openingHours: string;
  readonly specialties: string[];
  readonly services: string[];
}
