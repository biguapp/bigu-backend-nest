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
} from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { RideResponseDto } from './dto/response-ride.dto';
import { UserResponseDto } from '@src/user/dto/response-user.dto';

@ApiTags('rides')
@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma carona' })
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
      console.log(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retornar todas as caronas.' })
  async findAll(@Res() response): Promise<RideResponseDto[]> {
    try {
      const ridesModel = await this.rideService.findAll();
      const rides = await Promise.all(ridesModel.map((ride) => ride.toDTO()));

      return response.status(HttpStatus.OK).json({
        message: 'Todas as caronas foram retornadas com sucesso.',
        rides,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/ride/:id')
  @ApiOperation({ summary: 'Retornar uma carona' })
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
  @Get('/driver/active')
  @ApiOperation({
    summary: 'Retorna todas as caronas que o usuário é o motorista.',
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
  @ApiOperation({ summary: 'Retorna todas as caronas que o usuário é membro.' })
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
  @ApiOperation({ summary: 'Set ride over.' })
  @ApiResponse({
    status: 200,
    description: 'The ride is complete.',
  })
  async setRideOver(@Req() req, @Param() rideId) {
    const userId = req.user.sub;
    return this.rideService.setRideOver(userId, rideId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/request')
  @ApiOperation({ summary: 'Request join in ride.' })
  @ApiResponse({
    status: 200,
    description: 'Request join in ride.',
  })
  async requestRide(@Req() req, @Param() rideId) {
    const userId = req.user.sub;
    return this.rideService.requestRide(userId, rideId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/accept/candidate')
  @ApiOperation({ summary: 'Accept candidate in ride.' })
  @ApiResponse({
    status: 200,
    description: 'Candidate accepted.',
  })
  async acceptCandidate(@Req() req, @Param() rideId, @Param() candidateId) {
    const userId = req.user.sub;
    return await this.rideService.acceptCandidate(userId, rideId, candidateId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/decline/candidate')
  @ApiOperation({ summary: 'Decline candidate in ride.' })
  @ApiResponse({
    status: 200,
    description: 'Candidate declined.',
  })
  async declineCandidate(@Req() req, @Param() rideId, @Param() candidateId) {
    const userId = req.user.sub;
    return await this.rideService.declineCandidate(userId, rideId, candidateId);
  }


}
