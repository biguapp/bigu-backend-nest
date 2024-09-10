import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { Role } from '../../enums/enum';
import { CreateCarDto } from '../../car/dto/create-car.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'CPF do usuário', example: '123.456.789-00', required: false })
  @IsOptional()
  readonly cpf?: string;

  @ApiProperty({ description: 'Nome completo do usuário', example: 'João Silva', required: false })
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ description: 'Sexo do usuário', example: 'Masculino', required: false })
  @IsOptional()
  readonly sex?: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao.silva@ufcg.edu.br', required: false })
  @IsOptional()
  readonly email?: string;

  @ApiProperty({ description: 'Matrícula do usuário', example: '2021001234', required: false })
  @IsOptional()
  readonly matricula?: string;

  @ApiProperty({ description: 'Número de telefone do usuário', example: '(83) 99999-9999', required: false })
  @IsOptional()
  readonly phoneNumber?: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'password123', required: false })
  @IsOptional()
  readonly password?: string;

  @ApiProperty({ description: 'Papel do usuário', example: Role.User, required: false })
  @IsOptional()
  readonly role?: Role;

  @ApiProperty({ description: 'Endereços do usuário', type: [CreateAddressDto], required: false })
  @IsOptional()
  readonly addresses?: CreateAddressDto[];

  @ApiProperty({ description: 'Carros do usuário', type: [CreateCarDto], required: false })
  @IsOptional()
  readonly cars?: CreateCarDto[];

  @ApiProperty({ description: 'IDs das corridas do usuário', type: [String], required: false })
  @IsOptional()
  readonly rides?: string[];

  @ApiProperty({ description: 'IDs dos feedbacks do usuário', type: [String], required: false })
  @IsOptional()
  readonly feedbacks?: string[];

  @ApiProperty({ description: 'Pontuação média do usuário', example: 0, required: false })
  @IsOptional()
  readonly avgScore?: number;
}