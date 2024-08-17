import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthUnitService } from './health-unit.service';
import { HealthUnitController } from './health-unit.controller';
import { HealthUnit, HealthUnitSchema } from './schemas/health-unit.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PatientModule } from '../patient/patient.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HealthUnit.name, schema: HealthUnitSchema }]),
    JwtModule,
    PatientModule, 
    AdminModule,    
  ],
  controllers: [HealthUnitController],
  providers: [HealthUnitService, JwtService],
})
export class HealthUnitModule {}
