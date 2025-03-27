import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/createMessage.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations/:userId')
  findUserConversations(@Param('userId') userId: string) {
    return this.chatService.getUserConversations(userId);
  }

  @Get('messages/:chatRoomId')
  findMessages(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.getMessages(chatRoomId);
  }

  @Post('messages')
  sendMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.sendMessage(createMessageDto);
  }
}
