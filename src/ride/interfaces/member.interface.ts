import { Document, Types } from 'mongoose';
import { MemberResponseDto } from '../dto/member-response.dto';

export interface Member extends Document {
  readonly user: Types.ObjectId;
  readonly address: Types.ObjectId;

  toDTO(): MemberResponseDto;
}
