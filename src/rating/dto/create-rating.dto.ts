import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {

    @ApiProperty({
        description: 'ID da carona associada à avaliação',
        example: '60d5ec49f10a2c001b564ece',
    })
    @IsNotEmpty()
    @IsString()
    rideId: string;

    @ApiProperty({
        description: 'ID de quem está sendo avaliado (motorista ou membro)',
        example: '60d5ec49f10a2c001b564ece',
    })
    @IsNotEmpty()
    @IsString()
    rateeId: string;

    @ApiProperty({
        description: 'Avaliação em estrelas (0-5)',
        example: 4,
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(5)
    score: number;

    @ApiProperty({
        description: 'Comentário opcional sobre a avaliação',
        example: 'Motorista foi pontual e muito educado.',
        required: false,
    })
    @IsOptional()
    @IsString()
    comment?: string;
}
