import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';
import { ChatRoom } from './schemas/chat.schema';
import { CreateMessageDto } from './dto/createMessage.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    @InjectModel('ChatRoom') private readonly chatRoomModel: Model<ChatRoom>,
  ) {}

  async getMessages(chatRoomId: string) {
    return this.messageModel
      .find({ chatRoom: chatRoomId })
      .populate('sender')
      .exec();
  }

  async getUserConversations(userId: string) {
    const rooms = await this.chatRoomModel
      .find({
        $or: [{ driver: userId }, { passengers: userId }],
      })
      .populate('driver', 'fullName profileImage')
      .populate('passengers', 'fullName profileImage');

    return rooms;
  }

  async sendMessage(dto: CreateMessageDto): Promise<Message> {
    const room = await this.chatRoomModel.findById(dto.chatRoom);
    if (!room) {
      throw new NotFoundException('ChatRoom não encontrado.');
    }

    const newMessage = new this.messageModel({
      chatRoom: dto.chatRoom,
      sender: dto.sender,
      content: dto.content,
    });

    return await newMessage.save();
  }
}
