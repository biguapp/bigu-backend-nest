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
  @ApiResponse({ status: 200, description: 'Carona deletada.' })
  remove(@Param('id') id: string) {
    return this.rideService.remove(+id);
  }

  @Get("/available")
  @ApiOperation({ summary: 'Get rides available' })
  @ApiResponse({ status: 200, description: 'Get rides available returned' })
  async getRidesAvailable() {
    return await this.rideService.getRidesAvailable();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/driver')
  @ApiOperation({ summary: 'Get rides where the user is Driver' })
  @ApiResponse({
    status: 200,
    description: 'Get rides where the user is Driver',
  })
  async getDriverRides(@Req() req) {
    const userId = req.user.sub; // Pega o userId da requisição
    return this.rideService.getDriverRides(userId);
  }
}
