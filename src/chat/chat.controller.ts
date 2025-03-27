import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { CreateChatRoomDto } from './dto/createChatRoom.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';

@ApiTags('users')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('conversations/:userId')
  findUserConversations(@Param('userId') userId: string) {
    return this.chatService.getUserConversations(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('messages/:chatRoomId')
  findMessages(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.getMessages(chatRoomId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('messages')
  sendMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.sendMessage(createMessageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-or-get-room')
  async createOrGetRoom(@Body() dto: CreateChatRoomDto) {
    const chatRoom = await this.chatService.createOrGetChatRoom(dto);
    return { chatRoomId: chatRoom._id };
  }
}
