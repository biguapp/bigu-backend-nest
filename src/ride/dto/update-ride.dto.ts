import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRideDto } from './create-ride.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateRideDto extends PartialType(CreateRideDto){
  
  @ApiProperty({ description: 'Lista de candidatos ao passeio', type: [Types.ObjectId], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  readonly candidates?: Types.ObjectId[];

  @ApiProperty({ description: 'Lista de membros ao passeio', type: [Types.ObjectId], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  readonly members?: Types.ObjectId[];
}
