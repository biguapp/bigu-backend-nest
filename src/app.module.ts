import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthUnitModule } from './health-unit/health-unit.module';
import { DatabaseModule } from './database.module';
import { PatientModule } from './patient/patient.module';
import { CepService } from './cep/cep.service';
import { CepController } from './cep/cep.controller';
import { CepModule } from './cep/cep.module';

@Module({
  imports: [DatabaseModule, HealthUnitModule, PatientModule, CepModule],
  controllers: [AppController, CepController],
  providers: [AppService, CepService],
})
export class AppModule {}
