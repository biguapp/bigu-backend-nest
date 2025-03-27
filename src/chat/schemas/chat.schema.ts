import { Schema, Document, model, Types } from 'mongoose';

export interface ChatRoom extends Document {
  ride: Types.ObjectId; // Referência à carona
  participants: Types.ObjectId[]; // IDs dos usuários no chat
  isGroup: boolean; // true para grupo, false para chat 1:1
  createdAt: Date;
}

export const ChatRoomSchema = new Schema<ChatRoom>(
  {
    ride: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
    participants: [{ type: Types.ObjectId, ref: 'User', required: true }],
    isGroup: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ChatRoomModel = model<ChatRoom>('ChatRoom', ChatRoomSchema);
