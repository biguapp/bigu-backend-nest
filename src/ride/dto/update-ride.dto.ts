import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRideDto } from './create-ride.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { Candidate } from '../interfaces/candidate.interface';
import { Candidate as CandidateSchema} from '../schemas/candidate.schema';

export class UpdateRideDto extends PartialType(CreateRideDto){
  
  @ApiProperty({ description: 'Lista de candidatos ao passeio', type: [CandidateSchema], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  readonly candidates?: Candidate[];

  @ApiProperty({ description: 'Lista de membros ao passeio', type: [Types.ObjectId], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  readonly members?: Types.ObjectId[];
}
