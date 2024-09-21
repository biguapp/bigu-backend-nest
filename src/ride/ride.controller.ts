import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  Res,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RideResponseDto } from './dto/response-ride.dto';

@ApiTags('rides')
@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma carona' })
  @ApiResponse({
    status: 201,
    description: 'A carona foi criada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Houve um erro ao criar a carona.',
  })
  async create(
    @Body() createRideDto: CreateRideDto,
    @Res() response,
  ): Promise<RideResponseDto> {
    try {
      const newRideModel = await this.rideService.create(createRideDto);
      const newRide = await newRideModel.toDTO();

      return response.status(HttpStatus.CREATED).json({
        message: 'A carona foi criada com sucesso.',
        newRide: newRide,
      });

    } catch (error) {
      console.error('Erro ao criar carona: ', error);

      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Erro ao criar carona.',
        error: error.message || 'Erro interno do servidor',
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retornar todas as caronas.' })
  @ApiResponse({
    status: 200,
    description: 'Todas as caronas foram retornadas com sucesso.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao retornar caronas.',
  })
  async findAll(@Res() response): Promise<RideResponseDto[]> {
    try {
      const ridesModel = await this.rideService.findAll();
      const rides = await Promise.all(ridesModel.map((ride) => ride.toDTO()));

      return response.status(HttpStatus.OK).json({
        message: 'Todas as caronas foram retornadas com sucesso.',
        rides,
      });

    } catch (error) {
      console.error('Erro ao encontrar caronas: ', error);
      
      throw new InternalServerErrorException('Erro ao encontrar caronas.');
    }
  }

  @Get('/ride/:id')
  @ApiOperation({ summary: 'Retornar uma carona' })
  @ApiResponse({
    status: 200,
    description: 'A carona foi retornada com sucesso.',
  })
  async findOne(
    @Param('id') id: string,
    @Res() response,
  ): Promise<RideResponseDto> {
    try {
      const rideModel = await this.rideService.findOne(id);
      const ride = await rideModel.toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'A carona foi retornada com sucesso.',
        ride,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Patch('/ride/:id')
  @ApiOperation({ summary: 'Editar uma carona' })
  @ApiResponse({
    status: 200,
    description: 'A carona foi atualizada com sucesso.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRideDto: UpdateRideDto,
    @Res() response,
  ): Promise<RideResponseDto> {
    try {
      const rideUpdatedModel = await this.rideService.update(id, updateRideDto);
      const rideUpdated = await rideUpdatedModel.toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'A carona foi atualizada com sucesso.',
        rideUpdated,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Delete('/ride/:id')
  @ApiOperation({ summary: 'Deletar uma carona' })
  @ApiResponse({
    status: 200,
    description: 'A carona foi deletada com sucesso.',
  })
  async remove(
    @Param('id') id: string,
    @Res() response,
  ): Promise<RideResponseDto> {
    try {
      const rideDeletedModel = await this.rideService.remove(id);
      const rideDeleted = await rideDeletedModel.toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'A carona foi deletada com sucesso.',
        rideDeleted,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/available')
  @ApiOperation({ summary: 'Retorna todas as caronas ativas.' })
  @ApiResponse({
    status: 200,
    description: 'Todas as caronas ativas foram retornadas.',
  })
  async getRidesAvailable(@Res() response): Promise<RideResponseDto[]> {
    try {
      const ridesAvailableModel = await this.rideService.getRidesAvailable();
      const ridesAvailable = await Promise.all(
        ridesAvailableModel.map((ride) => ride.toDTO()),
      );

      return response.status(HttpStatus.OK).json({
        message: 'Todas as corridas ativas foram retornadas.',
        ridesAvailable,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/toWomen')
  @ApiOperation({ summary: 'Retorna todas as caronas só para mulheres ativas.' })
  @ApiResponse({
    status: 200,
    description: 'Todas as caronas para mulheres ativas foram retornadas.',
  })
  async getRidesAvailableToWomen(@Res() response): Promise<RideResponseDto[]> {
    try {
      const ridesAvailableToWomenModel = await this.rideService.getRidesAvailableToWomen();
      const ridesAvailableToWomen = await Promise.all(
        ridesAvailableToWomenModel.map((ride) => ride.toDTO()),
      );

      return response.status(HttpStatus.OK).json({
        message: 'Todas as caronas para mulheres ativas foram retornadas.',
        ridesAvailableToWomen,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/driver/active')
  @ApiOperation({
    summary: 'Retorna todas as caronas que o usuário é o motorista.',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as corridas que o usuário é motorista foram retornadas.',
  })
  async getDriverActiveRides(
    @Req() req,
    @Res() response,
  ): Promise<RideResponseDto[]> {
    try {
      const userId = req.user.sub;
      const userDriverActivesHistoryModel =
        await this.rideService.getDriverActiveRides(userId);
      const userDriverActivesHistory = await Promise.all(
        userDriverActivesHistoryModel.map((ride) => ride.toDTO()),
      );

      return response.status(HttpStatus.OK).json({
        message: 'As corridas que o usuário é motorista e estão ativas.',
        userDriverActivesHistory,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/member/active')
  @ApiOperation({
    summary: 'Retorna todas as caronas que o usuário é membro.',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as corridas que o usuário é membro foram retornadas.',
  })
  async getMemberActiveRides(
    @Req() req,
    @Res() response,
  ): Promise<RideResponseDto[]> {
    try {
      const userId = req.user.sub;
      const userMemberActivesHistoryModel =
        await this.rideService.getMemberActiveRides(userId);
      const userMemberActivesHistory = await Promise.all(
        userMemberActivesHistoryModel.map((ride) => ride.toDTO()),
      );

      return response.status(HttpStatus.OK).json({
        message: 'As corridas que o usuário é membro e estão ativas.',
        userMemberActivesHistory,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/driver/history')
  @ApiOperation({
    summary: 'Retorna todas as caronas que o usuário foi motorista.',
  })
  @ApiResponse({
    status: 200,
    description: 'O histórico do usuário como motorista foi retornado.',
  })
  async getDriverHistory(
    @Req() req,
    @Res() response,
  ): Promise<RideResponseDto[]> {
    try {
      const userId = req.user.sub;
      const userDriverHistoryModel =
        await this.rideService.getDriverHistory(userId);
      const userDriverHistory = await Promise.all(
        userDriverHistoryModel.map((ride) => ride.toDTO()),
      );

      return response.status(HttpStatus.OK).json({
        message: 'As corridas que o usuário foi motorista foram retornadas.',
        userDriverHistory,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/member/history')
  @ApiOperation({
    summary: 'Retorna todas as caronas que o usuário foi membro.',
  })
  @ApiResponse({
    status: 200,
    description: 'O histórico do usuário como membro foi retornado.',
  })
  async getMemberHistory(
    @Req() req,
    @Res() response,
  ): Promise<RideResponseDto[]> {
    try {
      const userId = req.user.sub;
      const userMemberHistoryModel =
        await this.rideService.getMemberHistory(userId);
      const userMemberHistory = await Promise.all(
        userMemberHistoryModel.map((ride) => ride.toDTO()),
      );

      return response.status(HttpStatus.OK).json({
        message: 'As corridas que o usuário foi membro foram retornadas.',
        userMemberHistory,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/history')
  @ApiOperation({
    summary:
      'Retorna todas as caronas que o usuário estava como membro ou motorista.',
  })
  @ApiResponse({
    status: 200,
    description: 'O histórico completo do usuário foi retornado.',
  })
  async getUserHistory(
    @Req() req,
    @Res() response,
  ): Promise<RideResponseDto[]> {
    try {
      const userId = req.user.sub;
      const userHistoryModel = await this.rideService.getUserHistory(userId);
      const userHistory = await Promise.all(
        userHistoryModel.map((ride) => ride.toDTO()),
      );

      return response.status(HttpStatus.OK).json({
        message: 'O histórico do usuário foi retornado com sucesso.',
        userHistory,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/over')
  @ApiOperation({ summary: 'Marcar carona como concluída.' })
  @ApiResponse({
    status: 200,
    description: 'A carona foi marcada como concluída.',
  })
  async setRideOver(@Req() req, @Param() rideId) {
    const userId = req.user.sub;
    return this.rideService.setRideOver(userId, rideId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/request/:rideId/:addressId')
  @ApiOperation({ summary: 'Solicitar participação em uma carona.' })
  @ApiResponse({
    status: 200,
    description: 'Participação solicitada com sucesso.',
  })
  async requestRide(@Req() req, @Param('rideId') rideId: string, @Param('addressId') addressId: string) {
    const userId = req.user.sub;
    return this.rideService.requestRide(userId, rideId, addressId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/answer/:rideId/candidate/:candidateId')
  @ApiOperation({ summary: 'Recusar ou aceitar candidato para a carona.' })
  @ApiResponse({
    status: 200,
    description: 'Candidato recusado ou aceitado com sucesso.',
  })
  async declineOrAcceptCandidate(@Req() req, @Param('rideId') rideId, @Param('candidateId') candidateId, @Body() body: { status: string}) {
    const userId = req.user.sub;
    return await this.rideService.declineOrAcceptCandidate(userId, rideId, candidateId, body.status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/ride/:rideId/member/:memberId')
  @ApiOperation({ summary: 'Remover membro da carona.' })
  @ApiResponse({
    status: 200,
    description: 'Membro removido da carona com sucesso.',
  })
  async removeMember(@Req() req, @Param('rideId') rideId, @Param('memberId') memberId) {
    const userId = req.user.sub;
    return await this.rideService.removeMember(userId, rideId, memberId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/candidates')
  @ApiOperation({ summary: 'Obter todos os candidatos das caronas do motorista.' })
  @ApiResponse({
    status: 200,
    description: 'Todos os candidatos retornados com sucesso.',
  })
  async getCandidates(@Req() req) {
    const userId = req.user.sub;
    return await this.rideService.getCandidates(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/leave/:rideId')
  @ApiOperation({ summary: 'Deixar de fazer parte de uma carona.' })
  @ApiResponse({
    status: 200,
    description: 'Membro deixou de fazer parte de uma carona.',
  })
  async leaveRide(@Req() req, @Param('rideId') rideId) {
    const userId = req.user.sub;
    return await this.rideService.removeMember(userId, rideId, userId);
  }
}
