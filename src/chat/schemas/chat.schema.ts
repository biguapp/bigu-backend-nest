import { Schema, Document, model } from 'mongoose';

export const ChatSchema = new Schema(
  {
    senderId: { type: String, required: true },
    recipientId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true } 
);

export interface ChatMessage extends Document {
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: Date;
}

export const ChatMessageModel = model<ChatMessage>('ChatMessage', ChatSchema);
