import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Param,
  Body,
  Res,
  Req,
  UseGuards,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { ReportResponseDto } from './dto/report-response.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Denunciar um usuário' })
  @ApiResponse({
    status: 201,
    description: 'Denúncia do usuário criada com sucesso.',
    type: ReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'O usuário não pode realizar esta denúncia.',
  })
  @ApiResponse({
    status: 404,
    description: 'O usuário não foi encontrada.',
  })
  @ApiResponse({ status: 500, description: 'Erro no servidor.' })
  async create(
    @Req() req,
    @Body() createReportDto: CreateReportDto,
    @Res() response,
  ): Promise<ReportResponseDto> {
    try {
      const reporterId = req.user.sub;
      const report = await this.reportService.create(
        createReportDto,
        reporterId,
      );

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

  @UseGuards(JwtAuthGuard)
  @Put(':reportId')
  @ApiOperation({ summary: 'Editar uma denúncia' })
  @ApiParam({
    name: 'reportId',
    required: true,
    description: 'ID da denúncia a ser atualizada',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Denúncia editada com sucesso.',
    type: ReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'O usuário não pode editar esta denúncia.',
  })
  @ApiResponse({
    status: 404,
    description: 'O usuário não foi encontrada.',
  })
  @ApiResponse({ status: 500, description: 'Erro no servidor.' })
  async update(
    @Param('reportId') reportId: string,
    @Body() updateReportDto: UpdateReportDto,
    @Res() response,
  ): Promise<ReportResponseDto> {
    try {
      const report = await this.reportService.update(updateReportDto, reportId);

      return response.status(HttpStatus.OK).json({
        message: 'A denúncia foi editada com sucesso.',
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
        message: 'Erro ao editar denúncia.',
        error: error.message,
      });
    }
  }

  @Get('/:reportId')
  @ApiOperation({ summary: 'Obter uma denúncia em especifíco' })
  @ApiParam({
    name: 'reportId',
    required: true,
    description: 'ID da denúncia',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Denúncia do usuário retornada com sucesso.',
    type: [ReportResponseDto],
  })
  @ApiResponse({
    status: 204,
    description: 'Não há denúncias para esse usuário.',
  })
  @ApiResponse({ status: 404, description: 'Denúncia não encontrada.' })
  async getReport(
    @Param('reportId') reportId: string,
    @Res() response,
  ): Promise<ReportResponseDto[]> {
    try {
      const report = await this.reportService.findOne(reportId);

      if (!report) {
        return response.status(HttpStatus.NO_CONTENT).json({
          message: 'Nenhuma denúncia encontrada para este usuário.',
        });
      }

      return response.status(HttpStatus.OK).json({
        message: 'Denúncia retornada com sucesso.',
        report,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao buscar denúncia.',
        error: error.message,
      });
    }
  }

  @Get('/received/user/:userId')
  @ApiOperation({ summary: 'Obter todas as denúncias que um usuário recebeu' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID do usuário',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Denúncias do usuário retornadas com sucesso.',
    type: [ReportResponseDto],
  })
  @ApiResponse({
    status: 204,
    description: 'Não há denúncias para esse usuário.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async getReceivedReports(
    @Param('userId') userId: string,
    @Res() response,
  ): Promise<ReportResponseDto[]> {
    try {
      const reports = await this.reportService.getReceivedReports(userId);

      if (!reports.length) {
        return response.status(HttpStatus.NO_CONTENT).json({
          message: 'Nenhuma denúncia encontrada para este usuário.',
        });
      }

      return response.status(HttpStatus.OK).json({
        message: 'Denúncias do usuário retornadas com sucesso.',
        reports,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao buscar denúncias do usuário.',
        error: error.message,
      });
    }
  }

  @Get('/submitted/user/:userId')
  @ApiOperation({ summary: 'Obter todas as denúncias que um usuário recebeu' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID do usuário',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Denúncias do usuário retornadas com sucesso.',
    type: [ReportResponseDto],
  })
  @ApiResponse({
    status: 204,
    description: 'Não há denúncias para esse usuário.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async getSubmittedReports(
    @Param('userId') userId: string,
    @Res() response,
  ): Promise<ReportResponseDto[]> {
    try {
      const reports = await this.reportService.getSubmittedReports(userId);

      if (!reports.length) {
        return response.status(HttpStatus.NO_CONTENT).json({
          message: 'Nenhuma denúncia encontrada para este usuário.',
        });
      }

      return response.status(HttpStatus.OK).json({
        message: 'Denúncias do usuário retornadas com sucesso.',
        reports,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao buscar denúncias do usuário.',
        error: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @ApiOperation({ summary: 'Remover denúncia' })
  @ApiParam({
    name: 'reportId',
    required: true,
    description: 'ID da denúncia a ser removida',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Denúncia removida com sucesso.',
    type: ReportResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Denúncia não encontrada.' })
  async removeReport(
    @Param('id') reportId: string,
    @Res() response,
  ): Promise<ReportResponseDto> {
    try {
      const removedReport = await this.reportService.removeReport(reportId);

      return response.status(HttpStatus.OK).json({
        message: 'Denúncia removida com sucesso.',
        removedReport,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Denúncia não encontrada.',
        });
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao remover denúncia.',
        error: error.message,
      });
    }
  }
}
