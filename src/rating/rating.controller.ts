import { Controller, Post, Get, Delete, Param, Body, Res, Req, UseGuards, HttpStatus, NotFoundException } from '@nestjs/common';
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
    @Post('/driver')
    @ApiOperation({ summary: 'Avaliar um motorista' })
    @ApiResponse({
        status: 201,
        description: 'Avaliação do motorista criada com sucesso.',
        type: RatingResponseDto
    })
    @ApiResponse({ status: 500, description: 'Erro no servidor.' })
    async rateDriver(
        @Req() req,
        @Body() createRatingDto: CreateRatingDto,
        @Res() response
    ): Promise<RatingResponseDto> {
        try {
            const memberId = req.user.sub;
            const rating = await this.ratingService.addDriverRating(createRatingDto, memberId);

            return response.status(HttpStatus.CREATED).json({
                message: 'Avaliação do motorista criada com sucesso.',
                rating
            });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Erro ao criar avaliação do motorista.',
                error: error.message,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('/member')
    @ApiOperation({ summary: 'Avaliar um membro (passageiro)' })
    @ApiResponse({
        status: 201,
        description: 'Avaliação do membro criada com sucesso.',
        type: RatingResponseDto
    })
    @ApiResponse({ status: 500, description: 'Erro no servidor.' })
    async rateMember(
        @Req() req,
        @Body() createRatingDto: CreateRatingDto,
        @Res() response
    ): Promise<RatingResponseDto> {
        try {
            const driverId = req.user.sub;
            const rating = await this.ratingService.addMemberRating(createRatingDto, driverId);

            return response.status(HttpStatus.CREATED).json({
                message: 'Avaliação do membro criada com sucesso.',
                rating
            });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Erro ao criar avaliação do membro.',
                error: error.message,
            });
        }
    }

    @Get('/driver/:driverId')
    @ApiOperation({ summary: 'Obter todas as avaliações de um motorista' })
    @ApiParam({
        name: 'driverId',
        required: true,
        description: 'ID do motorista',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'Avaliações do motorista retornadas com sucesso.',
        type: [RatingResponseDto]
    })
    @ApiResponse({ status: 404, description: 'Motorista não encontrado.' })
    async getDriverRatings(@Param('driverId') driverId: string, @Res() response): Promise<RatingResponseDto[]> {
        try {
            const ratings = await this.ratingService.getDriverRatings(driverId);

            if (!ratings.length) {
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: 'Nenhuma avaliação encontrada para este motorista.',
                });
            }

            return response.status(HttpStatus.OK).json({
                message: 'Avaliações do motorista retornadas com sucesso.',
                ratings
            });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Erro ao buscar avaliações do motorista.',
                error: error.message,
            });
        }
    }

    @Get('/member/:memberId')
    @ApiOperation({ summary: 'Obter todas as avaliações de um membro (passageiro)' })
    @ApiParam({
        name: 'memberId',
        required: true,
        description: 'ID do membro (passageiro)',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'Avaliações do membro retornadas com sucesso.',
        type: [RatingResponseDto]
    })
    @ApiResponse({ status: 404, description: 'Membro não encontrado.' })
    async getMemberRatings(@Param('memberId') memberId: string, @Res() response): Promise<RatingResponseDto[]> {
        try {
            const ratings = await this.ratingService.getMemberRatings(memberId);

            if (!ratings.length) {
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: 'Nenhuma avaliação encontrada para este membro.',
                });
            }

            return response.status(HttpStatus.OK).json({
                message: 'Avaliações do membro retornadas com sucesso.',
                ratings
            });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Erro ao buscar avaliações do membro.',
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
