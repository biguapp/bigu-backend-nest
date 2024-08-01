import { Schema } from 'mongoose';

export const HealthUnitSchema = new Schema({
  name: String,
  type: String,
  address: String,
  openingHours: String,
  specialties: [String],
  services: [String],
});
