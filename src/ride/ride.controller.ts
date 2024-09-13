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
import { Ride } from './schemas/ride.schema';

@ApiTags('rides')
@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma carona' })
  async create(@Body() createRideDto: CreateRideDto, @Res() response) {
    try{
      const newRide = await this.rideService.create(createRideDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'A carona foi criada com sucesso.',
        newRide
      });
    }catch(error){
      console.log(error)
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retornar todas as caronas.' })
  async findAll(@Res() response) {
    try{

      const rides = await this.rideService.findAll();
      
      return response.status(HttpStatus.OK).json({
        message: 'Todas as caronas foram retornadas com sucesso.',
        rides
      });

    }catch(error){
      console.log(error)
    }
  }

  @Get('/ride/:id')
  @ApiOperation({ summary: 'Retornar uma carona' })
  async findOne(@Param('id') id: string, @Res() response) {
    try{
      const ride = await this.rideService.findOne(id);
      
      return response.status(HttpStatus.OK).json({
        message: 'A carona foi retornada com sucesso.',
        ride
      });

    }catch(error){
      console.log(error)
    }
  }

  @Patch('/ride/:id')
  @ApiOperation({ summary: 'Editar uma carona' })
  async update(@Param('id') id: string, @Body() updateRideDto: UpdateRideDto, @Res() response) {
    try{
      const rideUpdated = await this.rideService.update(id, updateRideDto);
      
      return response.status(HttpStatus.OK).json({
        message: 'A carona foi atualizada com sucesso.',
        rideUpdated
      });

    }catch(error){
      console.log(error)
    }
  }

  @Delete('/ride/:id')
  @ApiOperation({ summary: 'Deletar uma carona' })
  async remove(@Param('id') id: string, @Res() response) {
    try{
      const rideDeleted = await this.rideService.remove(id);
      
      return response.status(HttpStatus.OK).json({
        message: 'A carona foi deletada com sucesso.',
        rideDeleted
      });

    }catch(error){
      console.log(error)
    }
  }

  @Get('/available')
  @ApiOperation({ summary: 'Retorna todas as caronas ativas.' })
  async getRidesAvailable(@Res() response) {
    try{
      const ridesAvailable = await this.rideService.getRidesAvailable();

      console.log(ridesAvailable)
      
      return response.status(HttpStatus.OK).json({
        message: 'Todas as corridas ativas foram retornadas.',
        ridesAvailable
      });

    }catch(error){
      console.log(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/driver/active')
  @ApiOperation({ summary: 'Retorna todas as caronas que o usuário é o motorista.' })
  async getDriverActiveRides(@Req() req, @Res() response) {
    try{
      const userId = req.user.sub;
      const userDriverActivesHistory = await this.rideService.getDriverActiveRides(userId);
      
      return response.status(HttpStatus.OK).json({
        message: 'As corridas que o usuário é motorista e estão ativas.',
        userDriverActivesHistory
      });

    }catch(error){
      console.log(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/member/active')
  @ApiOperation({ summary: 'Retorna todas as caronas que o usuário é membro.' })
  async getMemberActiveRides(@Req() req, @Res() response) {
    try{
      const userId = req.user.sub;
      const userMemberActivesHistory = await this.rideService.getMemberActiveRides(userId);
      
      return response.status(HttpStatus.OK).json({
        message: 'As corridas que o usuário é membro e estão ativas.',
        userMemberActivesHistory
      });

    }catch(error){
      console.log(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/driver/history')
  @ApiOperation({ summary: 'Retorna todas as caronas que o usuário foi motorista.' })
  async getDriverHistory(@Req() req, @Res() response) {
    try{
      const userId = req.user.sub;
      const userDriverHistory = await this.rideService.getDriverHistory(userId);
      
      return response.status(HttpStatus.OK).json({
        message: 'As corridas que o usuário foi motorista foram retornadas.',
        userDriverHistory
      });

    }catch(error){
      console.log(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/member/history')
  @ApiOperation({ summary: 'Retorna todas as caronas que o usuário foi membro.' })
  async getMemberHistory(@Req() req, @Res() response) {
    try{
      const userId = req.user.sub;
      const userMemberHistory = await this.rideService.getMemberHistory(userId);
      
      return response.status(HttpStatus.OK).json({
        message: 'As corridas que o usuário foi membro foram retornadas.',
        userMemberHistory
      });

    }catch(error){
      console.log(error)
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('/user/history')
  @ApiOperation({ summary: 'Retorna todas as caronas que o usuário estava como membro ou motorista.' })
  async getUserHistory(@Req() req, @Res() response) {
    try{
      const userId = req.user.sub;
      const userHistory = await this.rideService.getUserHistory(userId);
      
      return response.status(HttpStatus.OK).json({
        message: 'O histórico do usuário foi retornado com sucesso.',
        userHistory
      });

    }catch(error){
      console.log(error)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Put('/over')
  @ApiOperation({ summary: 'Set ride over.' })
  @ApiResponse({
    status: 200,
    description: 'The ride is complete.',
  })
  async setRideOver(@Req() req, @Param() rideId){
    const userId = req.user.sub;
    return this.rideService.setRideOver(userId, rideId);
  }

}
