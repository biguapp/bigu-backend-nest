import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Candidate {
  @Prop({ type: Types.ObjectId, ref: 'User'})
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Address' })
  address: Types.ObjectId;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);