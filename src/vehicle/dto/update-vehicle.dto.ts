import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  
  @ApiProperty({ description: 'Marca do veículo', example: 'Chevrolet', required: false })
  @IsOptional()
  @IsString()
  readonly brand?: string;

  @ApiProperty({ description: 'Modelo do veículo', example: 'Onix', required: false })
  @IsOptional()
  @IsString()
  readonly vehicleModel?: string;

  @ApiProperty({ description: 'Consumo médio (km/l)', example: '16', required: false })
  @IsNumber()
  readonly avgConsumption?: number;

  @ApiProperty({ description: 'Ano do veículo', example: '2019', required: false })
  @IsOptional()
  @IsString()
  readonly modelYear?: string;

  @ApiProperty({ description: 'Cor do veículo', example: 'Preto', required: false })
  @IsOptional()
  @IsString()
  readonly color?: string;

  @ApiProperty({ description: 'Placa do veículo', example: 'KGU7E07', required: false })
  @IsOptional()
  @IsString()
  readonly plate?: string;

  
}
