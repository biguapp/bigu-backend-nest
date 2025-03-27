import { Schema, Document, model, Types } from 'mongoose';

export interface Message extends Document {
  chatRoom: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  timestamp: Date;
}

export const MessageSchema = new Schema<Message>(
  {
    chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const MessageModel = model<Message>('Message', MessageSchema);
