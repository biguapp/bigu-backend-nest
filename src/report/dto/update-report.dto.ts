import { IsOptional, IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReportDto {

    @ApiProperty({
        description: 'Novo motivo central da denúncia',
        example: 'Mudança no motivo: Reportar uma agressão física',
        enum: ['O motorista não corresponde ao perfil no meu aplicativo', 'O veículo do meu motorista era diferente',
        'Reportar racismo', 'Reportar assédio sexual', 'Reportar um roubo', 'O comportamento do motorista me troxe insegurança',
        'Reportar discriminação', 'Reportar uma agressão física', 'Reportar LGBTQIA+Fobia', 'Outro'],
    })
    @IsNotEmpty()
    @IsIn(['O motorista não corresponde ao perfil no meu aplicativo', 'O veículo do meu motorista era diferente',
    'Reportar racismo', 'Reportar assédio sexual', 'Reportar um roubo', 'O comportamento do motorista me troxe insegurança',
    'Reportar discriminação', 'Reportar uma agressão física', 'Reportar LGBTQIA+Fobia', 'Outro'])
    content: string;

    @ApiProperty({
        description: 'Novo comentário opcional sobre a denúncia',
        example: 'Mudança no comentário: Motorista me bateu.',
        required: false,
    })
    @IsOptional()
    @IsString()
    comment?: string;
}