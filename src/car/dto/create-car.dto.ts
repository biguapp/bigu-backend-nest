import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsNumber } from 'class-validator';

export class CreateCarDto {
  
  @ApiProperty({ description: 'Marca do carro', example: 'Chevrolet' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ description: 'Modelo do carro', example: 'Onix' })
  @IsString()
  readonly carModel: string;

  @ApiProperty({ description: 'Ano do carro', example: '2019', required: false })
  @IsOptional()
  @IsString()
  readonly modelYear?: string;

  @ApiProperty({ description: 'Consumo médio (km/l)', example: '16'})
  @IsNumber()
  readonly avgConsumption: number;

  @ApiProperty({ description: 'Cor do carro', example: 'Preto' })
  @IsString()
  readonly color: string;

  @ApiProperty({ description: 'Placa do carro', example: 'KGU7E07' })
  @IsString()
  readonly plate: string;
}
