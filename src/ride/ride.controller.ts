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
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RideResponseDto } from './dto/response-ride.dto';
import { Response } from 'express';

@ApiTags('rides')
@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  //refatorado
  @UseGuards(JwtAuthGuard)
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

  //refatorado
  @UseGuards(JwtAuthGuard)
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
      
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao retornar caronas.',
        error: error.message || 'Erro interno do servidor',
      });
    }
  }

  //refatorado
  @UseGuards(JwtAuthGuard)
  @Get('/ride/:id')
  @ApiOperation({ summary: 'Retornar uma carona' })
  @ApiResponse({
    status: 200,
    description: 'A carona foi retornada com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'A carona desejada não foi encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Houve um erro ao procurar pela carona.',
  })
  async findOne(
    @Param('id') id: string,
    @Res() response,
  ): Promise<void> {
    try {
      const ride = await this.rideService.findOne(id);
      if (!ride) {
        return response.status(404).json({
          message: 'Carona não encontrada.',
        });
      }
      
      return response.status(200).json({
        message: 'A carona foi retornada com sucesso.',
        ride: await ride.toDTO(),
      });
    } catch (error) {
      console.error('Erro ao encontrar carona pelo id: ', error);
      
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'A carona não foi encontrada.',
          error: error.message,
        });
      }
  
      // Se for qualquer outro erro (erro interno, etc.)
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao retornar a carona.',
        error: error.message || 'Erro interno do servidor',
      });
    }
  }

  //refatorado
  @UseGuards(JwtAuthGuard)
  @Patch('/ride/:id')
  @ApiOperation({ summary: 'Editar uma carona' })
  @ApiResponse({
    status: 200,
    description: 'A carona foi atualizada com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'A carona não foi encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao encerrar a carona.',
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
      console.error('Erro ao encerrar a carona: ', error);
      
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: error.message || 'A carona não foi encontrada.',
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Erro interno do servidor',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/ride/:id')
  @ApiOperation({ summary: 'Deletar uma carona' })
  @ApiResponse({
    status: 200,
    description: 'A carona foi deletada com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'A carona não foi encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao deletar carona.',
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
      console.error(error);
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: error.message || 'Não encontrado.',
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Erro interno do servidor.',
      });
    }
  }

  //refatorado
  @UseGuards(JwtAuthGuard)
  @Get('/active')
  @ApiOperation({ summary: 'Retorna todas as caronas ativas.' })
  @ApiResponse({
    status: 200,
    description: 'Todas as caronas ativas foram retornadas.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao retornar caronas ativas.',
  })
  async getActiveRides(@Res() response): Promise<RideResponseDto[]> {
    try {
      const activeRidesModel = await this.rideService.findAll({ isOver: false });
      const activeRides = await Promise.all(
        activeRidesModel.map((ride) => ride.toDTO()),
      );

      return response.status(HttpStatus.OK).json({
        message: 'Todas as corridas ativas foram retornadas.',
        activeRides,
      });

    } catch (error) {
      console.error('Erro ao encontrar caronas ativas: ', error);
      
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao retornar caronas ativas.',
        error: error.message || 'Erro interno do servidor',
      });
    }
  }

  //refatorado
  @UseGuards(JwtAuthGuard)
  @Get('/available')
  @ApiOperation({ summary: 'Retorna todas as caronas disponíveis.' })
  @ApiResponse({
    status: 200,
    description: 'Todas as caronas disponíveis foram retornadas.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao retornar caronas disponíveis.',
  })
  async getAvailableRides(@Res() response): Promise<RideResponseDto[]> {
    try {
      const availableRidesModel = await this.rideService.findAll({ isOver: false, $expr: { $gt: ['$numSeats', { $size: '$members' }] } });
      const availableRides = await Promise.all(
        availableRidesModel.map((ride) => ride.toDTO()),
      );

      return response.status(HttpStatus.OK).json({
        message: 'Todas as caronas disponíveis foram retornadas.',
        availableRides,
      });

    } catch (error) {
      console.error('Erro ao encontrar caronas disponíveis: ', error);
      
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao retornar caronas disponíveis.',
        error: error.message || 'Erro interno do servidor',
      });
    }
  }


  //refatorado
  @UseGuards(JwtAuthGuard)
  @Get('/active/toWomen')
  @ApiOperation({ summary: 'Retorna todas as caronas só para mulheres ativas.' })
  @ApiResponse({
    status: 200,
    description: 'Todas as caronas para mulheres ativas foram retornadas.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao retornar caronas ativas para mulheres.',
  })
  async getActiveRidesToWomen(@Res() response): Promise<RideResponseDto[]> {
    try {
      const activeRidesToWomenModel = await this.rideService.findAll({ isOver: false, toWomen: true });
      const activeRidesToWomen = await Promise.all(
        activeRidesToWomenModel.map((ride) => ride.toDTO()),
      );

      return response.status(HttpStatus.OK).json({
        message: 'Todas as caronas para mulheres ativas foram retornadas.',
        activeRidesToWomen,
      });
    } catch (error) {
      console.log('Erro ao encontrar caronas ativas para mulheres', error);

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao retornar caronas ativas.',
        error: error.message || 'Erro interno do servidor',
      });
    }
  }

  //refatorado
  @UseGuards(JwtAuthGuard)
  @Get('/available/toWomen')
  @ApiOperation({ summary: 'Retorna todas as caronas só para mulheres disponíveis.' })
  @ApiResponse({
    status: 200,
    description: 'Todas as caronas para mulheres disponíveis foram retornadas.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao retornar caronas disponíveis para mulheres.',
  })
  async getRidesAvailableToWomen(@Res() response): Promise<RideResponseDto[]> {
    try {
      const ridesAvailableToWomenModel = await this.rideService.findAll({
         isOver: false, 
         toWomen: true, 
         $expr: { $gt: ['$numSeats', { $size: '$members' }] }
        });
      const ridesAvailableToWomen = await Promise.all(
        ridesAvailableToWomenModel.map((ride) => ride.toDTO()),
      );

      return response.status(HttpStatus.OK).json({
        message: 'Todas as caronas para mulheres disponíveis foram retornadas.',
        ridesAvailableToWomen,
      });
    } catch (error) {
      console.error('Erro ao encontrar caronas disponíveis para mulheres', error);

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao retornar caronas disponíveis para mulheres.',
        error: error.message || 'Erro interno do servidor',
      });
    }
  }


  @UseGuards(JwtAuthGuard)
  @Get('/driver/active')
  @ApiOperation({
    summary: 'Retorna todas as caronas que o usuário é o motorista.',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as corridas em que o usuário é motorista foram retornadas.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao retornar as corridas em que o usuário é motorista.',
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
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao retornar as corridas em que o usuário é motorista.',
        error: error.message || 'Erro interno do servidor',
      });
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
  @ApiResponse({
    status: 500,
    description: 'Erro ao retornar as corridas em que o usuário é membro.',
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
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao retornar as corridas em que o usuário é membro.',
        error: error.message || 'Erro interno do servidor',
      });
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
  @ApiResponse({
    status: 500,
    description: 'Erro ao retornar o histórico do usuário como motorista.',
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
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao retornar o histórico do usuário como motorista.',
        error: error.message || 'Erro interno do servidor',
      });
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
  @ApiResponse({
    status: 500,
    description: 'Erro ao retornar o histórico do usuário como membro.',
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
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao retornar o histórico do usuário como membro.',
        error: error.message || 'Erro interno do servidor',
      });
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
  @ApiResponse({
    status: 500,
    description: 'Erro ao retornar o histórico do usuário como membro ou motorista.',
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
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao retornar o histórico do usuário como membro ou motorista.',
        error: error.message || 'Erro interno do servidor',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/over/:rideId')
  @ApiOperation({ summary: 'Marcar carona como concluída.' })
  @ApiResponse({
    status: 200,
    description: 'A carona foi marcada como concluída.',
  })
  @ApiResponse({
    status: 404,
    description: 'A carona não foi encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao encerrar a carona.',
  })
  async setRideOver(@Req() req, @Res() response, @Param('rideId') rideId: string) {
    try {
      const userId = req.user.sub;
      const updatedRide = await this.rideService.setRideOver(userId, rideId);
      
      return response.status(HttpStatus.OK).json({
        message: 'A carona foi encerrada.',
        updatedRide,
      });
    } catch (error) {
      console.error('Erro ao encerrar a carona: ', error);
      
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'A carona não foi encontrada.',
          error: error.message,
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno ao encerrar a carona.',
        error: error.message || 'Erro interno do servidor',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/request/:rideId/:addressId')
  @ApiOperation({ summary: 'Solicitar participação em uma carona.' })
  @ApiResponse({
    status: 200,
    description: 'Participação solicitada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'O usuário não pode se candidatar a esta carona.',
  })
  @ApiResponse({
    status: 404,
    description: 'A carona e/ou o endereço não foi encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao solicitar participação na carona.',
  })
  async requestRide(@Req() req, @Res() response: Response, @Param('rideId') rideId: string, @Param('addressId') addressId: string) {
    try {
      const userId = req.user.sub;
      const updatedRide = await this.rideService.requestRide(userId, rideId, addressId);

      return response.status(HttpStatus.OK).json({
        message: 'O usuário agora é um candidato à carona.',
        updatedRide,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: error.message || 'Não encontrado.',
        });
      }

      if (error instanceof BadRequestException) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: error.message || 'O usuário não pode se candidatar à carona.',
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Erro interno do servidor.',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/answer/:rideId/candidate/:candidateId')
  @ApiOperation({ summary: 'Recusar ou aceitar candidato para a carona.' })
  @ApiResponse({
    status: 200,
    description: 'Candidato recusado ou aceitado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'A carona e/ou o candidato não foi encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao responder à solicitação do candidato.',
  })
  async declineOrAcceptCandidate(@Req() req, @Res() response: Response, @Param('rideId') rideId, @Param('candidateId') candidateId, @Body() body: { status: string}) {
    try {
      const userId = req.user.sub;
      const updatedRide = await this.rideService.declineOrAcceptCandidate(userId, rideId, candidateId, body.status);
      return response.status(HttpStatus.OK).json({
        message: 'A solicitação foi respondida com sucesso.',
        updatedRide,
      });
    } catch (error) {
      console.error('Erro ao responder à solicitação do candidato: ', error);
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: error.message || 'Não encontrado.',
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Erro interno do servidor.',
      });
    }
    
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/ride/:rideId/member/:memberId')
  @ApiOperation({ summary: 'Remover membro da carona.' })
  @ApiResponse({
    status: 200,
    description: 'Membro removido da carona com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'A carona e/ou o membro não foi encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao remover candidato.',
  })
  async removeMember(@Req() req, @Res() response: Response, @Param('rideId') rideId, @Param('memberId') memberId) {
    try {
      const userId = req.user.sub;
      const updatedRide = await this.rideService.removeMember(userId, rideId, memberId);

      return response.status(HttpStatus.OK).json({
        message: 'O usuário não é mais um participante da carona.',
        updatedRide,
      });
    } catch (error) {
      console.error('Erro ao remover membro: ', error);

      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: error.message || 'Não encontrado.',
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Erro interno do servidor.',
      });
    }
    
  }

  @UseGuards(JwtAuthGuard)
  @Get('/candidates')
  @ApiOperation({ summary: 'Obter todos os candidatos das caronas do motorista.' })
  @ApiResponse({
    status: 200,
    description: 'Todos os candidatos retornados com sucesso.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao recuperar candidatos.',
  })
  async getCandidates(@Req() req, @Res() response: Response) {
    try {
      const userId = req.user.sub;
      const candidates = await this.rideService.getCandidates(userId);

      return response.status(HttpStatus.OK).json({
        message: 'Os candidatos das caronas do motorista foram retornados com sucesso.',
        candidates,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Erro interno do servidor.',
      });
    }
    
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/leave/:rideId')
  @ApiOperation({ summary: 'Deixar de fazer parte de uma carona.' })
  @ApiResponse({
    status: 200,
    description: 'Membro deixou de fazer parte de uma carona.',
  })
  @ApiResponse({
    status: 404,
    description: 'A carona não foi encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao deixar carona.',
  })
  async leaveRide(@Req() req, @Res() response: Response, @Param('rideId') rideId) {
    try {
      const userId = req.user.sub;
      const updatedRide = await this.rideService.removeMember(userId, rideId, userId);

      return response.status(HttpStatus.OK).json({
        message: 'O usuário deixou a carona.',
        updatedRide,
      });
    } catch (error) {
      console.error('Erro ao deixar carona: ', error);

      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: error.message || 'Não encontrado.',
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Erro interno do servidor.',
      });
    }
    
  }
}
