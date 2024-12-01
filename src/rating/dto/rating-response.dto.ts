import { ApiProperty } from '@nestjs/swagger';

export class RatingResponseDto {

    @ApiProperty({
        description: 'ID da avaliação',
        example: '60d5ec49f10a2c001b564ece',
    })
    ratingId: string;

    @ApiProperty({
        description: 'ID da carona associada à avaliação',
        example: '60d5ec49f10a2c001b564ece',
    })
    rideId: string;

    @ApiProperty({
        description: 'ID de quem está avaliando (motorista ou membro)',
        example: '60d5ec49f10a2c001b564ece',
    })
    raterId: string;

    @ApiProperty({
        description: 'Nome de quem está avaliando (motorista ou membro)',
        example: 'Fulano de Tal',
    })
    raterName: string;

    @ApiProperty({
        description: 'ID de quem está sendo avaliado (motorista ou membro)',
        example: '60d5ec49f10a2c001b564ece',
    })
    rateeId: string;

    @ApiProperty({
        description: 'Avaliação em estrelas (0-5)',
        example: 4,
    })
    score: number;

    @ApiProperty({
        description: 'Comentário opcional sobre a avaliação',
        example: 'Motorista foi pontual e educado.',
        required: false,
    })
    comment?: string;

    @ApiProperty({
        description: 'Data da criação da avaliação',
        example: '2021-06-25T15:56:30.000Z',
    })
    createdAt: Date;
}
