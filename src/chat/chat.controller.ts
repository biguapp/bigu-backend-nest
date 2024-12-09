import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RideService } from '@src/ride/ride.service';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService, private readonly rideService: RideService
  ) { }

  @Post('send')
  async sendMessage(
    @Body('rideId') rideId: string,
    @Body('userId') userId: string,
    @Body('message') message: string,
  ) {
    const ride = await this.rideService.findOne(rideId);

    const isAuthorized =
      ride.driver._id.toString() === userId ||
      ride.members?.some((member) => member.user._id.toString() === userId);

    console.log(
      `Authorization check for user ${userId} in ride ${rideId}:`,
      isAuthorized,
    );

    if (isAuthorized) {
      await this.chatService.saveMessage(rideId, userId, message);
      return { status: 'Message sent' };
    }
  }


  @Get('poll')
  async pollMessages(
    @Query('rideId') rideId: string,
    @Query('lastTimestamp') lastTimestamp: string,
  ) {

    const messages = await this.chatService.getMessagesAfter(rideId, lastTimestamp);
    return { messages };
  }



}
