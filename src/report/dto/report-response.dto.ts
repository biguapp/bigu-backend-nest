import { ApiProperty } from '@nestjs/swagger';

export class ReportResponseDto {
  @ApiProperty({
    description: 'ID da denúncia',
    example: '60d5ec49f10a2c001b564ece',
  })
  reportId: string;

  @ApiProperty({
    description: 'ID de quem está denunciando (motorista ou membro)',
    example: '60d5ec49f10a2c001b564ece',
  })
  reporterId: string;

  @ApiProperty({
    description: 'Nome de quem está denunciando (motorista ou membro)',
    example: 'Fulano de Tal',
  })
  reporterName: string;

  @ApiProperty({ description: 'Sexo do usuário', example: 'Masculino' })
  reporterSex: string;

  @ApiProperty({
    description: 'ID de quem está sendo denunciado (motorista ou membro)',
    example: '60d5ec49f10a2c001b564ece',
  })
  accusedId: string;

  @ApiProperty({
    description: 'O motivo central da denúncia',
    example: 'O motorista não corresponde ao perfil no meu aplicativo',
    enum: [
      'O motorista não corresponde ao perfil no meu aplicativo',
      'O veículo do meu motorista era diferente',
      'Reportar racismo',
      'Reportar assédio sexual',
      'Reportar um roubo',
      'O comportamento do motorista me troxe insegurança',
      'Reportar discriminação',
      'Reportar uma agressão física',
      'Reportar LGBTQIA+Fobia',
      'Outro',
    ],
  })
  content: string;

  @ApiProperty({
    description: 'Comentário opcional sobre a denúncia',
    example: 'Motorista era uma pessoa diferente.',
    required: false,
  })
  comment?: string;

  @ApiProperty({
    description: 'Data da criação da denúncia',
    example: '2021-06-25T15:56:30.000Z',
  })
  createdAt: Date;
}
