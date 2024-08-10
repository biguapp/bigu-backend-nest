import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { Patient, PatientSchema } from '../patient/schemas/patient.schema';
import { JwtAuthGuard } from './jwt-auth.guard';
import { jwtConstants } from './constants';
import { AdminSchema } from '../admin/schemas/admin.schema';
import { Admin } from '../admin/schemas/admin.schema';
import { AdminService } from '../admin/admin.service';
import { PatientService } from '../patient/patient.service';
import { HealthUnitService } from '../health-unit/health-unit.service';
import { HealthUnit, HealthUnitSchema } from '../health-unit/schemas/health-unit.schema';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret, 
      signOptions: { expiresIn: "1h" },
    }),
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: HealthUnit.name, schema: HealthUnitSchema}
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, AdminService, PatientService, HealthUnitService, LocalStrategy],
  exports: [AuthService, JwtAuthGuard, AdminService, PatientService, HealthUnitService],
})
export class AuthModule {}
