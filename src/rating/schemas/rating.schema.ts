import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RatingResponseDto } from '../dto/rating-response.dto';

@Schema()
export class Rating extends Document {

  @Prop({ required: true })
  rideId: Types.ObjectId;

  @Prop({ required: true })
  raterId: Types.ObjectId;  // avaliador

  @Prop({ required: true })
  raterName: string;  

  @Prop({ required: true })
  rateeId: Types.ObjectId;  // avaliado

  @Prop({ required: true, min: 0, max: 5 })
  score: number;  // nota em estrelas

  @Prop()
  comment?: string;  // comentário opcional

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);

RatingSchema.methods.toDTO = function (): RatingResponseDto {
  return {
    rideId: this.rideId,
    raterId: this.raterId,
    raterName: this.raterName,
    rateeId: this.rateeId,
    score: this.score,
    comment: this.comment,
    createdAt: this.createdAt,
    ratingId: this._id,
  };
};
