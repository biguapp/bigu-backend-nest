import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { HealthUnitModule } from '../health-unit/health-unit.module';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { HealthUnit, HealthUnitSchema } from '../health-unit/schemas/health-unit.schema'; // Certifique-se de que o caminho está correto
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { jwtConstants } from '../auth/constants';
import { PatientService } from '../patient/patient.service';
import { PatientModule } from '../patient/patient.module';
import { Patient, PatientSchema } from '../patient/schemas/patient.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]), 
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema}]),
    PassportModule,
    PatientModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AuthService, PatientService],
  exports: [AdminService, PatientService],
})
export class AdminModule {}
