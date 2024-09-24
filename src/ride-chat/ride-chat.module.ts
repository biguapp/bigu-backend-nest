import { Module } from '@nestjs/common';
import { RideChat, RideChatSchema } from './schema/ride-chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RideChatService } from './ride-chat.service';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: RideChat.name, schema: RideChatSchema }]),
      ],
    providers: [RideChatService],
    exports: [RideChatService],
  })
export class RideChatModule {}
