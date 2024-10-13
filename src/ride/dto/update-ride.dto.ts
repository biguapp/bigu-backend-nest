import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRideDto } from './create-ride.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { Candidate } from '../interfaces/candidate.interface';
import { Candidate as CandidateSchema} from '../schemas/candidate.schema';
import { Member } from '../schemas/member.schema';

export class UpdateRideDto extends PartialType(CreateRideDto){
  
  @ApiProperty({ description: 'Lista de candidatos da carona', type: [CandidateSchema], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  readonly candidates?: Candidate[];

  @ApiProperty({ description: 'Lista de membros da carona', type: [Member], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  readonly members?: Member[];
}
