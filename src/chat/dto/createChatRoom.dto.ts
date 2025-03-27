import { IsString } from 'class-validator';

export class CreateChatRoomDto {
  @IsString()
  rideId: string;

  @IsString()
  userId: string;

  @IsString()
  participantId: string;
}
