import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { RatingModule } from './rating/rating.module';
import { RideModule } from './ride/ride.module';
import { ConfigModule } from '@nestjs/config';
import { MailjetModule } from 'nest-mailjet';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    JwtModule,
    AddressModule,
    VehicleModule,
    RatingModule,
    RideModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailjetModule.registerAsync({
      useFactory: () => ({
        apiKey: process.env.MAILJET_API_KEY,
        apiSecret: process.env.MAILJET_API_SECRET,
      }),
    }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
