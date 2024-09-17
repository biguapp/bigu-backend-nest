import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';

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

  @ApiProperty({ description: 'Cor do carro', example: 'Preto' })
  @IsString()
  readonly color: string;

  @ApiProperty({ description: 'Placa do carro', example: 'KGU7E07' })
  @IsString()
  readonly plate: string;
}
