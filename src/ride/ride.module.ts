import { forwardRef, Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ride, RideSchema } from './schemas/ride.schema';
import { UserModule } from '../user/user.module';
import { AddressModule } from '../address/address.module';
import { AuthModule } from '@src/auth/auth.module';
import { CarModule } from '@src/car/car.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }]),
    AddressModule,
    AuthModule,
    CarModule
  ],
  controllers: [RideController],
  providers: [RideService],
  exports: [RideService],
})
export class RideModule {}
