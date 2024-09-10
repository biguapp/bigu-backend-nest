import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiProperty({ description: 'Nome da rua', example: 'Avenida Paulista', required: false })
  readonly rua?: string;

  @ApiProperty({ description: 'Número da residência', example: '1234', required: false })
  readonly numero?: string;

  @ApiProperty({ description: 'Complemento do endereço, opcional', example: 'Apartamento 56', required: false })
  readonly complemento?: string;

  @ApiProperty({ description: 'Nome do bairro', example: 'Bela Vista', required: false })
  readonly bairro?: string;

  @ApiProperty({ description: 'Nome da cidade', example: 'São Paulo', required: false })
  readonly cidade?: string;

  @ApiProperty({ description: 'Nome do estado', example: 'SP', required: false })
  readonly estado?: string;

  @ApiProperty({ description: 'CEP do endereço', example: '01311-000', required: false })
  readonly cep?: string;
}
