import { ApiProperty } from '@nestjs/swagger';
import { AddressResponseDto } from '@src/address/dto/response-address.dto';
import { VehicleResponseDto } from '@src/vehicle/dto/response-vehicle.dto';
import { UserResponseDto } from '@src/user/dto/response-user.dto';
import { IsString, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class RideResponseDto {

  @ApiProperty({ description: 'Id da corrida', example: '1', required: true })
  readonly rideId: string
  
  @ApiProperty({ description: 'ID do motorista', example: '1', required: true })
  @IsString()
  readonly driver: UserResponseDto;

  @ApiProperty({
    description: 'Endereço de início da carona',
    type: AddressResponseDto
  })
  readonly startAddress: AddressResponseDto;

  @ApiProperty({
    description: 'Endereço de destino da carona',
    type: AddressResponseDto
  })
  readonly destinationAddress: AddressResponseDto;

  @ApiProperty({ description: 'Número de assentos disponíveis', example: 4 })
  @IsNumber()
  readonly numSeats: number;

  @ApiProperty({
    description: 'Indica se a carona é para o campus universitário',
    example: true
  })
  @IsBoolean()
  readonly goingToCollege: boolean;

  @ApiProperty({ description: 'Preço da carona', example: 20.0 })
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    description: 'Data e hora agendadas para a carona',
    example: '2024-09-10T15:30:00Z',
  })
  readonly scheduledTime: string;

  @ApiProperty({
    description: 'Informações sobre o carro',
    type: VehicleResponseDto
  })
  readonly vehicle: VehicleResponseDto;

  @ApiProperty({
    description: 'Descrição da carona',
    example: 'Vehicleona para o campus universitário'
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Indica se a carona é exclusivo para mulheres',
    example: false
  })
  @IsBoolean()
  readonly toWomen: boolean;

  @ApiProperty({ description: 'Lista de membros da carona', type: [UserResponseDto]})
  @IsArray()
  readonly members: UserResponseDto[];

  @ApiProperty({ description: 'Lista de candidatos da carona', type: [UserResponseDto]})
  @IsArray()
  readonly candidates: UserResponseDto[];

  @ApiProperty({ description: 'A corrida finalizou?'})
  @IsBoolean()
  readonly isOver: boolean;

  @ApiProperty({ description: 'IDs de avaliações feitas pelo motorista'})
  @IsArray()
  readonly driverRatings: string[];

  @ApiProperty({ description: 'IDs de avaliações feitas pelos membros'})
  @IsArray()
  readonly memberRatings: string[];
}
