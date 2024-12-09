import { Schema, Document } from 'mongoose';

export interface ChatDocument extends Document {
  rideId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

export const ChatSchema = new Schema({
  rideId: { type: String, required: true },
  userId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
