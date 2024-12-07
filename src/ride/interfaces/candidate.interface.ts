import { Document, Types } from 'mongoose';
import { CandidateResponseDto } from '../dto/candidate-response.dto';

export interface Candidate extends Document {
  readonly user: Types.ObjectId;
  readonly address: Types.ObjectId;
  readonly suggestedValue: number;

  toDTO(): CandidateResponseDto
}
