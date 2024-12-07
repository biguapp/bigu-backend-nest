import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateRideDto {
  @ApiProperty({ description: 'ID do motorista', example: '1', required: true })
  @IsOptional()
  @IsString()
  readonly driver: string;

  @ApiProperty({
    description: 'Endereço de início da carona',
    type: String,
    required: true,
  })
  readonly startAddress: string;

  @ApiProperty({
    description: 'Endereço de destino da carona',
    type: String,
    required: true,
  })
  readonly destinationAddress: string;

  @ApiProperty({ description: 'Número de assentos disponíveis', example: 4 })
  @IsNumber()
  readonly numSeats: number;

  @ApiProperty({
    description: 'Indica se a carona é para o campus universitário',
    example: true,
    required: true,
  })
  @IsBoolean()
  readonly goingToCollege: boolean;

/*  @ApiProperty({ description: 'Preço da carona', example: 20.0 })
  @IsNumber()
  readonly price: number;
*/
  @ApiProperty({
    description: 'Data e hora agendadas para a carona',
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
    description: 'Descrição da carona',
    example: 'Carona para o campus universitário',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    description: 'Indica se a carona é exclusivo para mulheres',
    example: false,
    required: true,
  })
  @IsBoolean()
  readonly toWomen: boolean;

  @ApiProperty({
    description: 'Indica se a carona acabou',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly isOver: boolean;


}
