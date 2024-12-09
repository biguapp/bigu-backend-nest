import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatDocument } from './schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel('Chat') private readonly chatModel: Model<ChatDocument>) {}

  async saveMessage(rideId: string, userId: string, message: string) {
    const chat = new this.chatModel({ rideId, userId, message, timestamp: new Date() });
    return chat.save();
  }

  async getMessagesAfter(rideId: string, timestamp: Date) {
    return this.chatModel
      .find({ rideId, timestamp: { $gt: timestamp } })
      .sort({ timestamp: 1 })
      .exec();
  }
}
