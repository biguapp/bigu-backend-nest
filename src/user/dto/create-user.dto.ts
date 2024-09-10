import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '../../enums/enum';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { CreateCarDto } from '../../car/dto/create-car.dto';

export class CreateUserDto {

  @ApiProperty({ description: 'Nome completo do usuário', example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao.silva@ufcg.edu.br' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ description: 'Matrícula do usuário', example: '2021001234' })
  @IsString()
  @IsNotEmpty()
  readonly matricula: string;

  @ApiProperty({ description: 'Sexo do usuário', example: 'Masculino' })
  @IsString()
  @IsNotEmpty()
  readonly sex: string;

  @ApiProperty({ description: 'Número de telefone do usuário', example: '(83) 99999-9999' })
  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'password123' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;
}
