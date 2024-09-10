import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressSchema } from './schemas/address.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Address', schema: AddressSchema}])],
  providers: [AddressService],
  controllers: [AddressController],
  exports: [AddressService],
})
export class AddressModule {}
