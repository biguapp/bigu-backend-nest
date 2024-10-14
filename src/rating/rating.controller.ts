import { Controller, Post, Get, Delete, Param, Body, Res, Req, UseGuards, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { RatingResponseDto } from './dto/rating-response.dto';

@ApiTags('ratings')
@Controller('ratings')
export class RatingController {
    constructor(private readonly ratingService: RatingService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Avaliar um motorista' })
    @ApiResponse({
        status: 201,
        description: 'Avaliação do usuário criada com sucesso.',
        type: RatingResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'O usuário não pode realizar esta avaliação.',
    })
    @ApiResponse({
        status: 404,
        description: 'A carona ou o usuário não foi encontrada.',
    })
    @ApiResponse({ status: 500, description: 'Erro no servidor.' })
    async create(
        @Req() req,
        @Body() createRatingDto: CreateRatingDto,
        @Res() response
    ): Promise<RatingResponseDto> {
        try {
            const raterId = req.user.sub;
            const rating = await this.ratingService.create(createRatingDto, raterId);

            return response.status(HttpStatus.CREATED).json({
                message: 'A avaliação foi registrada com sucesso.',
                rating,
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                return response.status(HttpStatus.BAD_REQUEST).json({
                    message: error.message,
                });
            }

            if (error instanceof NotFoundException) {
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: error.message,
                });
            }

            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Erro ao criar avaliação do motorista.',
                error: error.message,
            });
        }
    }

    @Get('/user/:userId')
    @ApiOperation({ summary: 'Obter todas as avaliações de um usuário' })
    @ApiParam({
        name: 'userId',
        required: true,
        description: 'ID do usuário',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'Avaliações do usuário retornadas com sucesso.',
        type: [RatingResponseDto]
    })
    @ApiResponse({ status: 204, description: 'Não há avaliações para esse usuário.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    async getUserRatings(@Param('userId') userId: string, @Res() response): Promise<RatingResponseDto[]> {
        try {
            const ratings = await this.ratingService.getUserRatings(userId);

            if (!ratings.length) {
                return response.status(HttpStatus.NO_CONTENT).json({
                    message: 'Nenhuma avaliação encontrada para este usuário.',
                });
            }

            return response.status(HttpStatus.OK).json({
                message: 'Avaliações do usuário retornadas com sucesso.',
                ratings
            });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Erro ao buscar avaliações do usuário.',
                error: error.message,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/driver/:ratingId')
    @ApiOperation({ summary: 'Remover avaliação de um motorista' })
    @ApiParam({
        name: 'ratingId',
        required: true,
        description: 'ID da avaliação do motorista a ser removida',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'Avaliação do motorista removida com sucesso.',
        type: RatingResponseDto
    })
    @ApiResponse({ status: 404, description: 'Avaliação não encontrada.' })
    async removeDriverRating(
        @Param('ratingId') ratingId: string,
        @Res() response
    ): Promise<RatingResponseDto> {
        try {
            const removedRating = await this.ratingService.removeDriverRating(ratingId);

            return response.status(HttpStatus.OK).json({
                message: 'Avaliação do motorista removida com sucesso.',
                removedRating
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: 'Avaliação do motorista não encontrada.',
                });
            }
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Erro ao remover avaliação do motorista.',
                error: error.message,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/member/:ratingId')
    @ApiOperation({ summary: 'Remover avaliação de um membro' })
    @ApiParam({
        name: 'ratingId',
        required: true,
        description: 'ID da avaliação do membro a ser removida',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'Avaliação do membro removida com sucesso.',
        type: RatingResponseDto
    })
    @ApiResponse({ status: 404, description: 'Avaliação não encontrada.' })
    async removeMemberRating(
        @Param('ratingId') ratingId: string,
        @Res() response
    ): Promise<RatingResponseDto> {
        try {
            const removedRating = await this.ratingService.removeMemberRating(ratingId);

            return response.status(HttpStatus.OK).json({
                message: 'Avaliação do membro removida com sucesso.',
                removedRating
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: 'Avaliação do membro não encontrada.',
                });
            }
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Erro ao remover avaliação do membro.',
                error: error.message,
            });
        }
    }
}
