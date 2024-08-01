import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthUnitService } from './health-unit.service';
import { HealthUnitController } from './health-unit.controller';
import { HealthUnitSchema } from './schemas/health-unit.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'HealthUnit', schema: HealthUnitSchema }])],
  controllers: [HealthUnitController],
  providers: [HealthUnitService],
})
export class HealthUnitModule {}
