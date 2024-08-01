import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthUnitModule } from './health-unit/health-unit.module';
import { DatabaseModule } from './database.module';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [DatabaseModule, HealthUnitModule, PatientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
