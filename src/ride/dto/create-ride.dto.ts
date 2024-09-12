import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
  ValidateNested,
} from 'class-validator';

export class CreateRideDto {
  @ApiProperty({ description: 'ID do motorista', example: '1', required: true })
  @IsOptional()
  @IsString()
  readonly driverId: string;

  @ApiProperty({
    description: 'Endereço de início do passeio',
    type: String,
    required: true,
  })
  readonly startAddress: string;

  @ApiProperty({
    description: 'Endereço de destino do passeio',
    type: String,
    required: true,
  })
  readonly destinationAddress: string;

  @ApiProperty({ description: 'Número de assentos disponíveis', example: 4 })
  @IsNumber()
  readonly numSeats: number;

  @ApiProperty({
    description: 'Indica se o passeio é para o campus universitário',
    example: true,
    required: true,
  })
  @IsBoolean()
  readonly goingToCollege: boolean;

  @ApiProperty({ description: 'Preço do passeio', example: 20.0 })
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    description: 'Data e hora agendadas para o passeio',
    example: '2024-09-10T15:30:00Z',
  })
  readonly scheduledTime: string;

  @ApiProperty({
    description: 'Informações sobre o carro',
    type: String,
    required: true,
  })
  readonly car: string;

  @ApiProperty({
    description: 'Descrição do passeio',
    example: 'Passeio para o campus universitário',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    description: 'Indica se o passeio é exclusivo para mulheres',
    example: false,
    required: true,
  })
  @IsBoolean()
  readonly toWomen: boolean;
}
