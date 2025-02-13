import * as swagger from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { VehicleType } from '../schemas/vehicle.schema';


export class VehicleResponseDto {
  @swagger.ApiProperty({ description: 'Marca do veículo', example: 'Chevrolet' })
  @IsString()
  readonly brand: string;

  @swagger.ApiProperty({ description: 'Modelo do veículo', example: 'Onix' })
  @IsString()
  readonly vehicleModel: string;

  @swagger.ApiProperty({ description: 'Ano do veículo', example: '2019' })
  @IsString()
  readonly modelYear: string;

  @swagger.ApiProperty({ description: 'Consumo médio (km/l)', example: '16'})
  @IsNumber()
  readonly avgConsumption: number;

  @swagger.ApiProperty({ description: 'Cor do veículo', example: 'Preto' })
  @IsString()
  readonly color: string;

  @swagger.ApiProperty({ description: 'Placa do veículo', example: 'KGU7E07' })
  @IsString()
  readonly plate: string;

  @swagger.ApiProperty({ description: 'Id do veículo', example: '1' })
  @IsString()
  readonly vehicleId: string;
  @swagger.ApiProperty({ description: 'Tipo do veículo', example: VehicleType.CAR })
  readonly type: VehicleType;
}
