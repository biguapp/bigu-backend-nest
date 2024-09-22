import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressSchema } from './schemas/address.schema';
import { AuthModule } from '../auth/auth.module';
import { RideSchema } from '@src/ride/schemas/ride.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ride', schema: RideSchema }]),
    MongooseModule.forFeature([{ name: 'Address', schema: AddressSchema }]),
    AuthModule
  ],
  providers: [AddressService],
  controllers: [AddressController],
  exports: [AddressService],
})
export class AddressModule {}
