import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(@InjectModel('Message') private readonly messageModel: Model<Message>) {}

  async createMessage(data: { chatRoomId: string; senderId: string; content: string }) {
    const message = new this.messageModel({
      chatRoom: data.chatRoomId,
      sender: data.senderId,
      content: data.content,
    });
    return message.save();
  }

  async getMessages(chatRoomId: string) {
    return this.messageModel.find({ chatRoom: chatRoomId }).populate('sender').exec();
  }
}
