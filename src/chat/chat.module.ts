import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatRoomSchema } from './schemas/chat.schema';
import { MessageSchema } from './schemas/message.schema';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Message', schema: MessageSchema },
      { name: 'ChatRoom', schema: ChatRoomSchema },
    ]),
    JwtModule,
    AuthModule
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
