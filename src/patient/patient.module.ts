import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PatientSchema } from './schemas/patient.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Patient', schema: PatientSchema }])],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
