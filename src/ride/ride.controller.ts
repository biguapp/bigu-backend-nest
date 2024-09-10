import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('rides')
@Controller('ride')
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

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma carona' })
  @ApiResponse({ status: 200, description: 'Carona retornada.' })
  findOne(@Param('id') id: string) {
    return this.rideService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar uma carona' })
  @ApiResponse({ status: 200, description: 'Carona editada.' })
  update(@Param('id') id: string, @Body() updateRideDto: UpdateRideDto) {
    return this.rideService.update(+id, updateRideDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma carona' })
  @ApiResponse({ status: 200, description: 'Carona deletada.' })
  remove(@Param('id') id: string) {
    return this.rideService.remove(+id);
  }
}
