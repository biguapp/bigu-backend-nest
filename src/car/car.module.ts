import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarService } from './car.service';
import { CarSchema } from './schemas/car.schema';
import { CarController } from './car.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Car', schema: CarSchema }]), JwtModule, AuthModule
  ],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
