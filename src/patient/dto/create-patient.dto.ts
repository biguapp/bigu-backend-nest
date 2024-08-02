// src/patient/dto/create-patient.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';


export class CreatePatientDto {
  @ApiProperty({ example: '10050972405' })
  @IsString()
  @IsNotEmpty()
  readonly cpf: string;

  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  readonly nome: string;

  @ApiProperty({ example: 'Joãozinho', required: false })
  @IsString()
  @IsOptional()
  readonly nomeSocial?: string;

  @ApiProperty({ example: 'Maria da Silva' })
  @IsString()
  @IsNotEmpty()
  readonly nomeMae: string;

  @ApiProperty({ example: 'José da Silva', required: false })
  @IsString()
  @IsOptional()
  readonly nomePai?: string;

  @ApiProperty({ example: '123456789012345' })
  @IsString()
  @IsNotEmpty()
  readonly numeroSus: string;

  @ApiProperty({ example: 'O+', required: false })
  @IsString()
  @IsOptional()
  readonly tipoSanguineo?: string;

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z' })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  readonly dataNascimento: Date;

  @ApiProperty({ example: 'Masculino' })
  @IsString()
  @IsNotEmpty()
  readonly sexo: string;

  @ApiProperty({ example: 'Solteiro', required: false })
  @IsString()
  @IsOptional()
  readonly estadoCivil?: string;

  @ApiProperty({ example: 'joao@example.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: '(11) 98765-4321' })
  @IsString()
  @IsNotEmpty()
  readonly celular: string;

  @ApiProperty({ example: 'Branco', required: false })
  @IsString()
  @IsOptional()
  readonly racaCor?: string;

  @ApiProperty({
    example: {
      rua: 'Rua das Flores',
      numero: '123',
      complemento: 'Apt 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '12345-678',
    },
  })
  readonly endereco: {
    readonly rua?: string;
    readonly numero?: string;
    readonly complemento?: string;
    readonly bairro?: string;
    readonly cidade?: string;
    readonly estado?: string;
    readonly cep?: string;
  };
}