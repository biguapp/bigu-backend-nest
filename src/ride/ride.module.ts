import { forwardRef, Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ride, RideSchema } from './schemas/ride.schema';
import { UserModule } from '../user/user.module';
import { AddressModule } from '../address/address.module';
import { AuthModule } from '@src/auth/auth.module';
import { CarModule } from '@src/car/car.module';
import { ResendModule } from '../resend/resend.module';
import { Member, MemberSchema } from './schemas/member.schema';
import { Candidate, CandidateSchema } from './schemas/candidate.schema';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }]),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MongooseModule.forFeature([
      { name: Candidate.name, schema: CandidateSchema },
    ]),
    AddressModule,
    AuthModule,
    CarModule,
    ResendModule,
  ],
  controllers: [RideController],
  providers: [RideService,
    {
      provide: 'RESEND_API_KEY',
      useFactory: (ConfigService: ConfigService) => ConfigService.get<string>('RESEND_KEY'),
      inject: [ConfigService]
    }
  ],
  exports: [RideService],
})
export class RideModule {}
