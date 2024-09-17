import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AskAndAcceptRideDto {
  @ApiProperty({ 
    description: 'User id', 
    example: '1', 
    required: true })
  @IsString()
  readonly userId: string;

  @ApiProperty({
    description: 'Ride id',
    type: String,
    required: true,
  })
  @IsString()
  readonly rideId: string;
}
