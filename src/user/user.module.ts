import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './schemas/user.schema';
import { CarModule } from '../car/car.module';
import { AddressModule } from '../address/address.module';
import { AuthModule } from '@src/auth/auth.module';
import { RideModule } from '@src/ride/ride.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
