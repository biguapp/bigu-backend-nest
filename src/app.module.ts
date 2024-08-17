import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthUnitModule } from './health-unit/health-unit.module';
import { DatabaseModule } from './database.module';
import { PatientModule } from './patient/patient.module';
import { CepService } from './cep/cep.service';
import { CepController } from './cep/cep.controller';
import { CepModule } from './cep/cep.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, HealthUnitModule, PatientModule, CepModule, AdminModule, AuthModule, JwtModule],
  controllers: [AppController, CepController],
  providers: [AppService, CepService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
