import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRatingDto {

    @ApiProperty({
        description: 'Nova avaliação em estrelas (0-5)',
        example: 5,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    score?: number;

    @ApiProperty({
        description: 'Novo comentário opcional sobre a avaliação',
        example: 'Mudança no comentário: Motorista foi excelente.',
        required: false,
    })
    @IsOptional()
    @IsString()
    comment?: string;
}
