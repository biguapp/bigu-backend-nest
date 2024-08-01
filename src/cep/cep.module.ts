import { Module } from '@nestjs/common';
import { CepService } from './cep.service';
import { CepController } from './cep.controller';

@Module({
  providers: [CepService],
  controllers: [CepController],
})
export class CepModule {}
