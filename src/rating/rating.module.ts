import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingSchema } from './schemas/rating.schema';
import { AuthModule } from '../auth/auth.module';
import { RideSchema } from '@src/ride/schemas/ride.schema';
import { RideService } from '../ride/ride.service';
import { RideModule } from '../ride/ride.module';
import { UserService } from '../user/user.service'; 
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Rating', schema: RatingSchema }]),
    RideModule,
    UserModule,
    AuthModule,
  ],
  providers: [RatingService],
  controllers: [RatingController],
  exports: [RatingService],
})
export class RatingModule {}
