import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { VehicleType } from '../schemas/vehicle.schema';

export class VehicleResponseDto {
  @ApiProperty({ description: 'Marca do carro', example: 'Chevrolet' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ description: 'Modelo do carro', example: 'Onix' })
  @IsString()
  readonly vehicleModel: string;

  @ApiProperty({ description: 'Ano do carro', example: '2019' })
  @IsString()
  readonly modelYear: string;

  @ApiProperty({ description: 'Cor do carro', example: 'Preto' })
  @IsString()
  readonly color: string;

  @ApiProperty({ description: 'Placa do carro', example: 'KGU7E07' })
  @IsString()
  readonly plate: string;

  @ApiProperty({ description: 'Id do carro', example: '1' })
  @IsString()
  readonly vehicleId: string;
  @ApiProperty({ description: 'Tipo do veículo', example: VehicleType.CAR })
  readonly type: VehicleType;
}
