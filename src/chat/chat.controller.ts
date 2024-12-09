import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(
    @Body('senderId') senderId: string,
    @Body('recipientId') recipientId: string,
    @Body('message') message: string,
  ) {
    const savedMessage = await this.chatService.saveMessage(senderId, recipientId, message);
    return { status: 'Message sent', message: savedMessage };
  }

  @Get('messages')
  async getMessages(
    @Query('userId') userId: string,
    @Query('otherUserId') otherUserId: string,
  ) {
    const messages = await this.chatService.getMessages(userId, otherUserId);
    return { messages };
  }

  @Get('poll')
  async pollMessages(
    @Query('userId') userId: string,
    @Query('otherUserId') otherUserId: string,
    @Query('lastTimestamp') lastTimestamp: string,
  ) {
    const timestamp = new Date(lastTimestamp.trim());
    const messages = await this.chatService.getMessagesAfter(userId, otherUserId, timestamp);
    return { messages };
  }
}
