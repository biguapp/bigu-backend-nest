import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarService } from './car.service';
import { CarSchema } from './schemas/car.schema';
import { CarController } from './car.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@src/auth/auth.module';
import { RideService } from '@src/ride/ride.service';
import { RideModule } from '@src/ride/ride.module';
import { RideSchema } from '@src/ride/schemas/ride.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ride', schema: RideSchema }]),
    MongooseModule.forFeature([{ name: 'Car', schema: CarSchema }]),
    JwtModule,
    AuthModule,
  ],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
