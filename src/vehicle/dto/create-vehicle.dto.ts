import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsEnum } from 'class-validator';
import { VehicleType } from '../schemas/vehicle.schema';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Tipo do veículo (CAR ou MOTORCYCLE)',
    example: VehicleType.CAR,
  })
  @IsEnum(VehicleType)
  readonly type: VehicleType;

  @ApiProperty({ description: 'Marca do veiculo', example: 'Chevrolet' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ description: 'Modelo do veículo', example: 'Onix' })
  @IsString()
  readonly vehicleModel: string;

  @ApiProperty({
    description: 'Ano do veículo',
    example: '2019',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly modelYear?: string;

  @ApiProperty({ description: 'Cor do veículo', example: 'Preto' })
  @IsString()
  readonly color: string;

  @ApiProperty({ description: 'Placa do veículo', example: 'KGU7E07' })
  @IsString()
  readonly plate: string;
}
