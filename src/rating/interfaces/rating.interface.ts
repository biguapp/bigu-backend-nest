import { Document } from 'mongoose';
import { RatingResponseDto } from '../dto/rating-response.dto';

export interface Rating extends Document {
  readonly rideId: string;
  readonly raterId: string;  // avaliador
  readonly rateeId: string;  // avaliado
  readonly rating: number;  // nota (0-5)
  readonly comment?: string;  // comentário opcional
  readonly createdAt: Date;

  toDTO(): RatingResponseDto;
}
