import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {

    @ApiProperty({
        description: 'ID da carona associada à denúncia',
        example: '60d5ec49f10a2c001b564ece',
    })
    @IsNotEmpty()
    @IsString()
    rideId: string;

    @ApiProperty({
        description: 'ID de quem está sendo denunciado (motorista ou membro)',
        example: '60d5ec49f10a2c001b564ece',
    })
    @IsNotEmpty()
    @IsString()
    accusedId: string;

    @ApiProperty({
        description: 'O motivo central da denúncia',
        example: 'O motorista não corresponde ao perfil no meu aplicativo',
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
        description: 'Comentário opcional sobre a denúncia',
        example: 'Motorista era uma pessoa diferente.',
        required: false,
    })
    @IsOptional()
    @IsString()
    comment?: string;
}
