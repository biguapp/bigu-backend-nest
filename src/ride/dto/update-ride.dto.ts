import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsDate, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../user/schemas/user.schema';
import { Address } from '../../address/schemas/address.schema';
import { Car } from '../../car/schemas/car.schema';

export class UpdateRideDto {
  
  @ApiProperty({ description: 'ID do motorista', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  readonly driverId?: number;

  @ApiProperty({ description: 'Lista de membros do passeio', type: [User], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => User)
  readonly members?: User[];

  @ApiProperty({ description: 'Lista de candidatos ao passeio', type: [User], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => User)
  readonly candidates?: User[];

  @ApiProperty({ description: 'Endereço de início do passeio', type: Address, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  readonly startAddress?: Address;

  @ApiProperty({ description: 'Endereço de destino do passeio', type: Address, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  readonly destinationAddress?: Address;

  @ApiProperty({ description: 'Número de assentos disponíveis', example: 4, required: false })
  @IsOptional()
  @IsNumber()
  readonly numSeats?: number;

  @ApiProperty({ description: 'Indica se o passeio é para o campus universitário', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  readonly goingToCollege?: boolean;

  @ApiProperty({ description: 'Distância do passeio em quilômetros', example: 15.5, required: false })
  @IsOptional()
  @IsNumber()
  readonly distance?: number;

  @ApiProperty({ description: 'Preço do passeio', example: 20.0, required: false })
  @IsOptional()
  @IsNumber()
  readonly price?: number;

  @ApiProperty({ description: 'Data e hora agendadas para o passeio', example: '2024-09-10T15:30:00Z', required: false })
  @IsOptional()
  @IsDate()
  readonly scheduledTime?: Date;

  @ApiProperty({ description: 'Informações sobre o carro', type: Car, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => Car)
  readonly car?: Car;

  @ApiProperty({ description: 'Descrição do passeio', example: 'Passeio para o campus universitário', required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ description: 'Indica se o passeio é exclusivo para mulheres', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  readonly toWomen?: boolean;

  @ApiProperty({ description: 'Indica se o passeio já ocorreu', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  readonly isOver?: boolean;
}
