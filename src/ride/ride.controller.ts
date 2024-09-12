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
} from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';

@ApiTags('rides')
@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma carona' })
  @ApiResponse({ status: 200, description: 'Carona criada.' })
  create(@Body() createRideDto: CreateRideDto) {
    return this.rideService.create(createRideDto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todas as caronas.' })
  @ApiResponse({ status: 200, description: 'Caronas retornadas.' })
  findAll() {
    return this.rideService.findAll();
  }

  @Get('/ride/:id')
  @ApiOperation({ summary: 'Buscar uma carona' })
  @ApiResponse({ status: 200, description: 'Carona retornada.' })
  findOne(@Param('id') id: string) {
    return this.rideService.findOne(id);
  }

  @Patch('/ride/:id')
  @ApiOperation({ summary: 'Editar uma carona' })
  @ApiResponse({ status: 200, description: 'Carona editada.' })
  update(@Param('id') id: string, @Body() updateRideDto: UpdateRideDto) {
    return this.rideService.update(id, updateRideDto);
  }

  @Delete('/ride/:id')
  @ApiOperation({ summary: 'Deletar uma carona' })
  @ApiResponse({ status: 204, description: 'Carona deletada.' })
  remove(@Param('id') id: string) {
    return this.rideService.remove(+id);
  }

  @Get('/available')
  @ApiOperation({ summary: 'Get rides available' })
  @ApiResponse({ status: 200, description: 'Get rides available returned' })
  async getRidesAvailable() {
    return await this.rideService.getRidesAvailable();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/driver/active')
  @ApiOperation({ summary: 'Get rides where the user is Driver' })
  @ApiResponse({
    status: 200,
    description: 'Get rides where the user is Driver',
  })
  async getDriverActiveRides(@Req() req) {
    const userId = req.user.sub; // Pega o userId da requisição
    return this.rideService.getDriverActiveRides(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/member/active')
  @ApiOperation({ summary: 'Get rides where the user is Member' })
  @ApiResponse({
    status: 200,
    description: 'Get rides where the user is Driver',
  })
  async getMemberActiveRides(@Req() req) {
    const userId = req.user.sub; // Pega o userId da requisição
    return this.rideService.getMemberActiveRides(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/history/driver')
  @ApiOperation({ summary: 'Get rides where the user was Driver' })
  @ApiResponse({
    status: 200,
    description: 'Get rides where the user is Driver',
  })
  async getDriverHistory(@Req() req) {
    const userId = req.user.sub; // Pega o userId da requisição
    return this.rideService.getDriverHistory(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/history/member')
  @ApiOperation({ summary: 'Get rides where the user was Member' })
  @ApiResponse({
    status: 200,
    description: 'Get rides where the user is Driver',
  })
  async getMemberHistory(@Req() req) {
    const userId = req.user.sub; // Pega o userId da requisição
    return this.rideService.getMemberHistory(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/history/user')
  @ApiOperation({ summary: 'Get rides where the user was Member' })
  @ApiResponse({
    status: 200,
    description: 'Get rides where the user is Driver',
  })
  async getUserHistory(@Req() req) {
    const userId = req.user.sub; // Pega o userId da requisição
    return this.rideService.getUserHistory(userId);
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
