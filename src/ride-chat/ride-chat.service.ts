import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RideChat } from './schema/ride-chat.schema';

@Injectable()
export class RideChatService {
  constructor(
    @InjectModel(RideChat.name) private rideChatModel: Model<RideChat>,
  ) {}

  async createChat(rideId: string, members: string[]) {
    const chat = new this.rideChatModel({ rideId, members });
    return await chat.save();
  }

  async addMessage(rideId: string, senderId: string, content: string) {
    const chat = await this.rideChatModel.findOne({ rideId });
    if (!chat) throw new NotFoundException('Chat não encontrado.');

    chat.messages.push({
      sender: senderId,
      content,
      timestamp: new Date(),
    });

    return await chat.save();
  }

  async getMessages(rideId: string) {
    const chat = await this.rideChatModel.findOne({ rideId });
    if (!chat) throw new NotFoundException('Chat não encontrado.');

    return chat.messages;
  }

  async deleteChat(rideId: string) {
    return await this.rideChatModel.findOneAndDelete({ rideId });
  }

  async addMemberToChat(rideId: string, newMemberId: string) {
    const chat = await this.rideChatModel.findOne({ rideId });
    if (!chat) throw new NotFoundException('Chat não encontrado.');

    // Verifica se o membro já está no chat
    if (!chat.members.includes(newMemberId)) {
      chat.members.push(newMemberId); // Adiciona o novo membro ao chat
      await chat.save(); // Salva as mudanças no banco de dados
    } else {
      throw new Error('Membro já faz parte do chat.');
    }

    return chat;
  }

  async removeMemberFromChat(rideId: string, memberId: string) {
    const chat = await this.rideChatModel.findOne({ rideId });
    if (!chat) throw new NotFoundException('Chat não encontrado.');

    // Verifica se o membro está no chat
    if (chat.members.includes(memberId)) {
      const idx = chat.members.indexOf(memberId);
      chat.members.splice(idx, 1);
      await chat.save(); // Salva as mudanças no banco de dados
    } else {
      throw new Error('Membro não faz parte do chat.');
    }

    return chat;
  }
}
