import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class RideChat extends Document {
  @Prop({ type: String, ref: 'Ride', required: true })
  rideId: string;

  @Prop({ type: [String], ref: 'User', required: true })
  members: string[];

  @Prop({ default: [] })
  messages: {
    sender: string,
    content: string,
    timestamp: Date
  }[];
}

export const RideChatSchema = SchemaFactory.createForClass(RideChat);