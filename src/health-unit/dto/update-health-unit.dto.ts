import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateHealthUnitDto, AddressDto, SpecialtyDto, RatingDto, OperatingHoursGroupDto,  } from './create-health-unit.dto';
import { HealthUnitType, ServiceType } from '../../enums/enum'; 

export class UpdateHealthUnitDto extends PartialType(CreateHealthUnitDto) {
  @ApiProperty({ example: 'Updated Health Unit Name', required: false })
  readonly nome?: string;

  @ApiProperty({ example: 'UPA', required: false })
  readonly tipo?: HealthUnitType;

  @ApiProperty({ type: AddressDto, required: false })
  readonly endereco?: AddressDto;

  @ApiProperty({ type: OperatingHoursGroupDto, required: false })
  readonly horarioFuncionamento?: OperatingHoursGroupDto;

  @ApiProperty({ type: [String], required: false })
  readonly servicosOfertados?: ServiceType[];

  @ApiProperty({ example: 'Updated Contact Phone', required: false })
  readonly telefoneContato?: string;

  @ApiProperty({ example: 'updated-email@example.com', required: false })
  readonly emailContato?: string;

  @ApiProperty({ type: [SpecialtyDto], required: false })
  readonly especialidadesDisponiveis?: SpecialtyDto[];

  @ApiProperty({ type: RatingDto, required: false })
  readonly avaliacao?: RatingDto;
}
