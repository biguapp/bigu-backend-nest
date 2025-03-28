import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MemberResponseDto {
  @ApiProperty({ 
    description: 'User id', 
    example: '1', 
    required: true })
  @IsString()
  readonly user: string;

  @ApiProperty({
    description: 'Address id',
  })
  @IsString()
  readonly address: string;

  @ApiProperty({
    description: 'Final price for the ride',
  })
  @IsString()
  readonly agreedValue: number;
}
