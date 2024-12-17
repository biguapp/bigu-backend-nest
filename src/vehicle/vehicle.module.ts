import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleService } from './vehicle.service';
import { VehicleSchema } from './schemas/vehicle.schema';
import { VehicleController } from './vehicle.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@src/auth/auth.module';
import { RideService } from '@src/ride/ride.service';
import { RideModule } from '@src/ride/ride.module';
import { RideSchema } from '@src/ride/schemas/ride.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ride', schema: RideSchema }]),
    MongooseModule.forFeature([{ name: 'Vehicle', schema: VehicleSchema }]),
    JwtModule,
    AuthModule,
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
