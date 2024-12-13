import { Controller, Post, Get, Delete, Param, Body, Res, Req, UseGuards, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { ReportResponseDto } from './dto/report-response.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Denunciar um motorista' })
    @ApiResponse({
        status: 201,
        description: 'Denúncia do usuário criada com sucesso.',
        type: ReportResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'O usuário não pode realizar esta denúncia.',
    })
    @ApiResponse({
        status: 404,
        description: 'A carona ou o usuário não foi encontrada.',
    })
    @ApiResponse({ status: 500, description: 'Erro no servidor.' })
    async create(
        @Req() req,
        @Body() createReportDto: CreateReportDto,
        @Res() response
    ): Promise<ReportResponseDto> {
        try {
            const raterId = req.user.sub;
            const report = await this.reportService.create(createReportDto, raterId);

            return response.status(HttpStatus.CREATED).json({
                message: 'A denúncia foi registrada com sucesso.',
                report,
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
                message: 'Erro ao criar denúncia do motorista.',
                error: error.message,
            });
        }
    }

    @Get('/user/:userId')
    @ApiOperation({ summary: 'Obter todas as denúncias de um usuário' })
    @ApiParam({
        name: 'userId',
        required: true,
        description: 'ID do usuário',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'Avaliações do usuário retornadas com sucesso.',
        type: [ReportResponseDto]
    })
    @ApiResponse({ status: 204, description: 'Não há denúncias para esse usuário.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    async getUserReports(@Param('userId') userId: string, @Res() response): Promise<ReportResponseDto[]> {
        try {
            const reports = await this.reportService.getUserReports(userId);

            if (!reports.length) {
                return response.status(HttpStatus.NO_CONTENT).json({
                    message: 'Nenhuma denúncia encontrada para este usuário.',
                });
            }

            return response.status(HttpStatus.OK).json({
                message: 'Denúncias do usuário retornadas com sucesso.',
                reports
            });
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Erro ao buscar denúncias do usuário.',
                error: error.message,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/driver/:reportId')
    @ApiOperation({ summary: 'Remover denúncia de um motorista' })
    @ApiParam({
        name: 'reportId',
        required: true,
        description: 'ID da denúncia do motorista a ser removida',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'Denúncia do motorista removida com sucesso.',
        type: ReportResponseDto
    })
    @ApiResponse({ status: 404, description: 'Denúncia não encontrada.' })
    async removeDriverReport(
        @Param('reportId') reportId: string,
        @Res() response
    ): Promise<ReportResponseDto> {
        try {
            const removedReport = await this.reportService.removeDriverReport(reportId);

            return response.status(HttpStatus.OK).json({
                message: 'Denúncia do motorista removida com sucesso.',
                removedReport
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: 'Denúncia do motorista não encontrada.',
                });
            }
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Erro ao remover denúncia do motorista.',
                error: error.message,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/member/:reportId')
    @ApiOperation({ summary: 'Remover denúncia de um membro' })
    @ApiParam({
        name: 'reportId',
        required: true,
        description: 'ID da denúncia do membro a ser removida',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'Denúncia do membro removida com sucesso.',
        type: ReportResponseDto
    })
    @ApiResponse({ status: 404, description: 'Denúncia não encontrada.' })
    async removeMemberReport(
        @Param('reportId') reportId: string,
        @Res() response
    ): Promise<ReportResponseDto> {
        try {
            const removedReport = await this.reportService.removeMemberReport(reportId);

            return response.status(HttpStatus.OK).json({
                message: 'Denúncia do membro removida com sucesso.',
                removedReport
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: 'Denúncia do membro não encontrada.',
                });
            }
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Erro ao remover denúncia do membro.',
                error: error.message,
            });
        }
    }
}
