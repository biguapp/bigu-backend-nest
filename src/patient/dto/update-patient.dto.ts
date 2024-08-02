import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @ApiProperty({ example: 'Updated Name', required: false })
  readonly nome?: string;

  @ApiProperty({ example: 'Updated Social Name', required: false })
  readonly nomeSocial?: string;

  @ApiProperty({ example: 'Updated Mother\'s Name', required: false })
  readonly nomeMae?: string;

  @ApiProperty({ example: 'Updated Father\'s Name', required: false })
  readonly nomePai?: string;

  @ApiProperty({ example: 'Updated SUS Number', required: false })
  readonly numeroSus?: string;

  @ApiProperty({ example: 'Updated Blood Type', required: false })
  readonly tipoSanguineo?: string;

  @ApiProperty({ example: '1991-01-01T00:00:00.000Z', required: false })
  readonly dataNascimento?: Date;

  @ApiProperty({ example: 'Updated Gender', required: false })
  readonly sexo?: string;

  @ApiProperty({ example: 'Updated Marital Status', required: false })
  readonly estadoCivil?: string;

  @ApiProperty({ example: 'updated-email@example.com', required: false })
  readonly email?: string;

  @ApiProperty({ example: 'updated-password', required: false })
  readonly password?: string;

  @ApiProperty({ example: '(11) 98765-4321', required: false })
  readonly celular?: string;

  @ApiProperty({ example: 'Updated Race/Color', required: false })
  readonly racaCor?: string;

  @ApiProperty({
    example: {
      rua: 'Updated Street',
      numero: '456',
      complemento: 'Updated Apt 45',
      bairro: 'Updated Neighborhood',
      cidade: 'Updated City',
      estado: 'Updated State',
      cep: '87654-321'
    },
    required: false
  })
  readonly endereco?: {
    readonly rua?: string;
    readonly numero?: string;
    readonly complemento?: string;
    readonly bairro?: string;
    readonly cidade?: string;
    readonly estado?: string;
    readonly cep?: string;
  };
}
