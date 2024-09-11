import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../user/schemas/user.schema';
import { Address } from '../../address/schemas/address.schema';
import { Car } from '../../car/schemas/car.schema';

export class CreateRideDto {
  @ApiProperty({ description: 'ID do motorista', example: '1', required: true })
  @IsOptional()
  @IsString()
  readonly driverId: string;

  @ApiProperty({
    description: 'Lista de membros do passeio',
    type: [User],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  readonly members?: string[];

  @ApiProperty({
    description: 'Lista de candidatos ao passeio',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  readonly candidates?: string[];

  @ApiProperty({
    description: 'Endereço de início do passeio',
    type: Number,
    required: true,
  })
  @ValidateNested()
  @IsNumber()
  readonly driverAddress: number;

  @ApiProperty({
    description: 'Endereço de destino do passeio',
    type: Number,
    required: true,
  })
  @ValidateNested()
  @IsNumber()
  readonly collegeAddress: number;

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

  @ApiProperty({
    description: 'Distância do passeio em quilômetros',
    example: 15.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly distance?: number;

  @ApiProperty({ description: 'Preço do passeio', example: 20.0 })
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    description: 'Data e hora agendadas para o passeio',
    example: '2024-09-10T15:30:00Z',
  })
  @IsDate()
  readonly scheduledTime: Date;

  @ApiProperty({
    description: 'Informações sobre o carro',
    type: Number,
    required: true,
  })
  @ValidateNested()
  @IsNumber()
  readonly car: number;

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
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly toWomen?: boolean;
}
