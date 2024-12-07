import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDto } from './create-car.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateCarDto extends PartialType(CreateCarDto) {
  
  @ApiProperty({ description: 'Marca do carro', example: 'Chevrolet', required: false })
  @IsOptional()
  @IsString()
  readonly brand?: string;

  @ApiProperty({ description: 'Modelo do carro', example: 'Onix', required: false })
  @IsOptional()
  @IsString()
  readonly carModel?: string;

  @ApiProperty({ description: 'Ano do carro', example: '2019', required: false })
  @IsOptional()
  @IsString()
  readonly modelYear?: string;

  @ApiProperty({ description: 'Consumo médio (km/l)', example: '16', required: false })
  @IsNumber()
  readonly avgConsumption?: number;

  @ApiProperty({ description: 'Cor do carro', example: 'Preto', required: false })
  @IsOptional()
  @IsString()
  readonly color?: string;

  @ApiProperty({ description: 'Placa do carro', example: 'KGU7E07', required: false })
  @IsOptional()
  @IsString()
  readonly plate?: string;
}
