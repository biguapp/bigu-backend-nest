import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';
import { ChatRoom } from './schemas/chat.schema';
import { CreateMessageDto } from './dto/createMessage.dto';
import { CreateChatRoomDto } from './dto/createChatRoom.dto';
import { User } from '@src/user/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    @InjectModel('ChatRoom') private readonly chatRoomModel: Model<ChatRoom>,
    @InjectModel('User') private readonly userModel: Model<User>,
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
        participants: userId,
      })
      .populate('ride');

    // Aguarda todas as conversões assíncronas com Promise.all
    const formattedRooms = await Promise.all(
      rooms.map(async (room) => {
        const [first, second] = room.participants;
        const otherParticipantId = first.toString() === userId ? second : first;

        const otherParticipant = await this.userModel.findById(
          otherParticipantId,
          'name profileImage sex', // só busca os campos necessários
        );

        let profileImageBase64 = null;
        if (
          otherParticipant?.profileImage &&
          Buffer.isBuffer(otherParticipant.profileImage)
        ) {
          profileImageBase64 = otherParticipant.profileImage.toString('base64');
        }

        return {
          _id: room._id,
          otherParticipant: {
            _id: otherParticipant._id,
            name: otherParticipant.name,
            sex: otherParticipant.sex,
            profileImage: profileImageBase64,
          },
        };
      }),
    );

    return formattedRooms;
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

  async createOrGetChatRoom(dto: CreateChatRoomDto) {
    const { rideId, userId, participantId } = dto;
    // Procura por sala existente entre os dois participantes, independente da ordem
    let chatRoom = await this.chatRoomModel.findOne({
      ride: rideId,
      $or: [
        { participants: [userId, participantId] },
        { participants: [participantId, userId] },
      ],
    });

    // Se não existe, cria
    if (!chatRoom) {
      chatRoom = await this.chatRoomModel.create({
        ride: rideId,
        participants: [userId, participantId],
        isGroup: false,
        createdAt: Date.now(),
      });
    }

    return chatRoom;
  }
}
