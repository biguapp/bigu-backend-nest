import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CandidateResponseDto {
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
}
