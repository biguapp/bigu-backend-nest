import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingSchema } from './schemas/rating.schema';
import { AuthModule } from '../auth/auth.module';
import { RideSchema } from '@src/ride/schemas/ride.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ride', schema: RideSchema }]),
    MongooseModule.forFeature([{ name: 'Rating', schema: RatingSchema }]),
    AuthModule,
  ],
  providers: [RatingService],
  controllers: [RatingController],
  exports: [RatingService],
})
export class RatingModule {}
