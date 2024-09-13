import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';

export class ResponseAddressDto {
  @ApiProperty({ description: 'Nome da rua', example: 'Avenida Paulista' })
  @IsString()
  readonly rua: string;

  @ApiProperty({ description: 'Número da residência', example: '1234' })
  @IsString()
  readonly numero: string;

  @ApiProperty({ description: 'Complemento do endereço, opcional', example: 'Apartamento 56', required: false })
  @IsOptional()
  @IsString()
  readonly complemento?: string;

  @ApiProperty({ description: 'Nome do bairro', example: 'Bela Vista' })
  @IsString()
  readonly bairro: string;

  @ApiProperty({ description: 'Nome da cidade', example: 'São Paulo' })
  @IsString()
  readonly cidade: string;

  @ApiProperty({ description: 'Nome do estado', example: 'SP' })
  @IsString()
  @Length(2, 2)
  readonly estado: string;
}
