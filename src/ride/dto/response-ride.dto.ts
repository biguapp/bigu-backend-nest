import { ApiProperty } from '@nestjs/swagger';
import { AddressResponseDto } from '@src/address/dto/response-address.dto';
import { CarResponseDto } from '@src/car/dto/response-car.dto';
import { UserResponseDto } from '@src/user/dto/response-user.dto';
import { IsString, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class RideResponseDto {

  @ApiProperty({ description: 'Id da corrida', example: '1', required: true })
  readonly rideId: string
  
  @ApiProperty({ description: 'ID do motorista', example: '1', required: true })
  @IsString()
  readonly driver: UserResponseDto;

  @ApiProperty({
    description: 'Endereço de início do passeio',
    type: AddressResponseDto
  })
  readonly startAddress: AddressResponseDto;

  @ApiProperty({
    description: 'Endereço de destino do passeio',
    type: AddressResponseDto
  })
  readonly destinationAddress: AddressResponseDto;

  @ApiProperty({ description: 'Número de assentos disponíveis', example: 4 })
  @IsNumber()
  readonly numSeats: number;

  @ApiProperty({
    description: 'Indica se o passeio é para o campus universitário',
    example: true
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
    type: CarResponseDto
  })
  readonly car: CarResponseDto;

  @ApiProperty({
    description: 'Descrição do passeio',
    example: 'Passeio para o campus universitário'
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Indica se o passeio é exclusivo para mulheres',
    example: false
  })
  @IsBoolean()
  readonly toWomen: boolean;

  @ApiProperty({ description: 'Lista de membros do passeio', type: [UserResponseDto]})
  @IsArray()
  readonly members: UserResponseDto[];

  @ApiProperty({ description: 'Lista de candidatos ao passeio', type: [UserResponseDto]})
  @IsArray()
  readonly candidates: UserResponseDto[];

  @ApiProperty({ description: 'A corrida finalizou?'})
  @IsBoolean()
  readonly isOver: boolean;
}
