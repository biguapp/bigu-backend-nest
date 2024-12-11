import { forwardRef, Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ride, RideSchema } from './schemas/ride.schema';
import { UserModule } from '../user/user.module';
import { AddressModule } from '../address/address.module';
import { AuthModule } from '@src/auth/auth.module';
import { VehicleModule } from '@src/vehicle/vehicle.module';
import { Member, MemberSchema } from './schemas/member.schema';
import { Candidate, CandidateSchema } from './schemas/candidate.schema';
import { MailjetModule } from 'nest-mailjet';
import { Car, CarSchema } from '@src/car/schemas/car.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }]),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    MongooseModule.forFeature([
      { name: Candidate.name, schema: CandidateSchema },
    ]),
    CarModule,
    AuthModule,
    AddressModule,
    MailjetModule.registerAsync({
      useFactory: () => ({
        apiKey: process.env.MAILJET_API_KEY,
        apiSecret: process.env.MAILJET_API_SECRET,
      }),
    }),
    VehicleModule
  ],
  controllers: [RideController],
  providers: [RideService],
  exports: [RideService, MongooseModule, MailjetModule, VehicleModule],
})
export class RideModule {}
