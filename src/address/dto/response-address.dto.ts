import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsNumber } from 'class-validator';

export class AddressResponseDto {
  @ApiProperty({ description: 'Nome da rua', example: 'Avenida Paulista' })
  @IsString()
  readonly rua: string;

  @ApiProperty({ description: 'Nome do endereço', example: 'Caasa' })
  @IsString()
  readonly nome: string;

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

  @ApiProperty({ description: 'Id do endereço', example: '1' })
  @IsString()
  readonly addressId: string;

  @ApiProperty({ description: 'CEP do endereço', example: '58417-191' })
  @IsString()
  readonly cep: string;

  /*@ApiProperty({ description: 'Distância de ida para a UFCG em km', example: '2.15' })
  @IsNumber()
  readonly outwardDistance: number;

  @ApiProperty({ description: 'Distância de volta da UFCG em km', example: '2.15' })
  @IsNumber()
  readonly returnDistance: number;*/

  @ApiProperty({ description: 'Distância entre o endereço e a UFCG em km', example: '2.150' })
  @IsNumber()
  readonly distance: number;
}
