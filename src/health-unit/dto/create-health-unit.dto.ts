// src/health-unit/dto/create-health-unit.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, ValidateNested, IsInt, Min, Max, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { HealthUnitType, ServiceType } from '../../enums/enum'

export class OperatingHoursDto {
  @ApiProperty({ example: '08:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Time must be in HH:MM format' })
  readonly abre: string;

  @ApiProperty({ example: '18:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Time must be in HH:MM format' })
  readonly fecha: string;
}

export class OperatingHoursGroupDto {
  @ApiProperty({ type: OperatingHoursDto })
  @ValidateNested()
  @Type(() => OperatingHoursDto)
  readonly segunda: OperatingHoursDto;

  @ApiProperty({ type: OperatingHoursDto })
  @ValidateNested()
  @Type(() => OperatingHoursDto)
  readonly terca: OperatingHoursDto;

  @ApiProperty({ type: OperatingHoursDto })
  @ValidateNested()
  @Type(() => OperatingHoursDto)
  readonly quarta: OperatingHoursDto;

  @ApiProperty({ type: OperatingHoursDto })
  @ValidateNested()
  @Type(() => OperatingHoursDto)
  readonly quinta: OperatingHoursDto;

  @ApiProperty({ type: OperatingHoursDto })
  @ValidateNested()
  @Type(() => OperatingHoursDto)
  readonly sexta: OperatingHoursDto;

  @ApiProperty({ type: OperatingHoursDto })
  @ValidateNested()
  @Type(() => OperatingHoursDto)
  readonly sabado: OperatingHoursDto;

  @ApiProperty({ type: OperatingHoursDto })
  @ValidateNested()
  @Type(() => OperatingHoursDto)
  readonly domingo: OperatingHoursDto;
}

export class AddressDto {
  @ApiProperty({ example: 'Rua das Flores' })
  @IsString()
  @IsNotEmpty()
  readonly rua: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty()
  readonly numero: string;

  @ApiProperty({ example: 'Apt 45', required: false })
  @IsString()
  @IsOptional()
  readonly complemento?: string;

  @ApiProperty({ example: 'Centro' })
  @IsString()
  @IsNotEmpty()
  readonly bairro: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  readonly cidade: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  @IsNotEmpty()
  readonly estado: string;

  @ApiProperty({ example: '12345-678' })
  @IsString()
  @IsNotEmpty()
  readonly cep: string;
}

export class SpecialtyDto {
  @ApiProperty({ example: 'Pediatra' })
  @IsString()
  @IsNotEmpty()
  readonly nome: string;

  @ApiProperty({ type: OperatingHoursGroupDto })
  @ValidateNested()
  @Type(() => OperatingHoursGroupDto)
  readonly horarioFuncionamento: OperatingHoursGroupDto;
}

export class RatingDto {
  @ApiProperty({ example: 4.5, minimum: 0, maximum: 5 })
  @IsInt()
  @Min(0)
  @Max(5)
  readonly nota: number;

  @ApiProperty({ example: 'Ótimo atendimento e estrutura.' })
  @IsString()
  @IsOptional()
  readonly descricao?: string;
}

export class CreateHealthUnitDto {
  @ApiProperty({ example: 'Hospital Municipal' })
  @IsString()
  @IsNotEmpty()
  readonly nome: string;

  @ApiProperty({ example: 'HOSPITAL', enum: HealthUnitType })
  @IsEnum(HealthUnitType)
  @IsNotEmpty()
  readonly tipo: HealthUnitType;

  @ApiProperty({ example: ['Pediatria', 'Clínica Geral'], enum: ServiceType, isArray: true })
  @IsEnum(ServiceType, { each: true })
  @IsNotEmpty()
  readonly servicosOfertados: ServiceType[];

  @ApiProperty({ type: OperatingHoursGroupDto })
  @ValidateNested()
  @Type(() => OperatingHoursGroupDto)
  @IsNotEmpty()
  readonly horarioFuncionamento: OperatingHoursGroupDto;

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty()
  readonly endereco: AddressDto;

  @ApiProperty({ example: '(11) 98765-4321' })
  @IsString()
  @IsNotEmpty()
  readonly telefoneContato: string;

  @ApiProperty({ example: 'contato@hospital.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly emailContato: string;

  @ApiProperty({ type: [SpecialtyDto], required: false })
  @ValidateNested({ each: true })
  @Type(() => SpecialtyDto)
  @IsOptional()
  readonly especialidadesDisponiveis?: SpecialtyDto[];

  @ApiProperty({ type: RatingDto, required: false })
  @ValidateNested()
  @Type(() => RatingDto)
  @IsOptional()
  readonly avaliacao?: RatingDto;
}
