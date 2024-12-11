import { Injectable } from '@nestjs/common';
import { ChatMessageModel, ChatMessage } from './schemas/chat.schema';  


@Injectable()
export class ChatService {
  async saveMessage(senderId: string, recipientId: string, message: string): Promise<ChatMessage> {
    return await new ChatMessageModel({ senderId, recipientId, message }).save();
  }

  async getMessages(userId: string, otherUserId: string): Promise<ChatMessage[]> {
    return await ChatMessageModel.find({
      $or: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
    }).sort({ timestamp: 1 });
  }

  async getMessagesAfter(
    userId: string,
    otherUserId: string,
    timestamp: Date,
  ): Promise<ChatMessage[]> {
    return await ChatMessageModel.find({
      $or: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
      timestamp: { $gt: timestamp },
    }).sort({ timestamp: 1 });
  }
}
