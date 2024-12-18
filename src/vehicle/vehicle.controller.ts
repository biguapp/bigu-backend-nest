import { Controller, Get, Put, Post, Body, Param, Delete, Req, UseGuards, Res, HttpStatus, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VehicleResponseDto } from './dto/response-vehicle.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um veículo' })
  @ApiResponse({
    status: 201,
    description: 'Veículo criado com sucesso.',
    type: VehicleResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Erro no servidor.' })
  async create(@Res() response, @Req() req, @Body() createVehicleDto: CreateVehicleDto): Promise<VehicleResponseDto> {
    try {
      const userId = req.user.sub;
      const newVehicle = (await this.vehicleService.create(createVehicleDto, userId)).toDTO();

      return response.status(HttpStatus.CREATED).json({
        message: 'O veículo foi criado com sucesso.',
        newVehicle,
      });
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar adicionar o veículo.\nTente novamente mais tarde.',
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retornar todos os veículos' })
  @ApiResponse({
    status: 200,
    description: 'Todos os veículos retornados com sucesso.',
    type: [VehicleResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Erro no servidor.' })
  async findAll(@Res() response): Promise<VehicleResponseDto[]> {
    try {
      const vehiclesModel = await this.vehicleService.findAll();
      const vehicles = vehiclesModel.map((vehicle) => vehicle.toDTO());

      return response.status(HttpStatus.OK).json({
        message: 'Todos os veículos foram retornados com sucesso.',
        vehicles,
      });
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar retornar todos os veículos.',
        error: error.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retornar um veículo com base no id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do veículo a ser retornado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Veículo retornado com sucesso.',
    type: VehicleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado.' })
  async findOne(@Param('id') id: string, @Res() response): Promise<VehicleResponseDto> {
    try {
      const vehicle = (await this.vehicleService.findOne(id)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O veículo foi retornado com sucesso.',
        vehicle,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Veículo não encontrado.',
          error: error.message,
        });
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar encontrar o veículo.\nTente novamente mais tarde',
        error: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Editar um veículo com base no id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do veículo a ser editado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Veículo editado com sucesso.',
    type: VehicleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado.' })
  @ApiResponse({
    status: 500,
    description: 'O sistema apresentou um erro ao tentar encontrar o veículo.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Res() response
  ): Promise<VehicleResponseDto> {
    try {
      const vehicleUpdated = (await this.vehicleService.update(id, updateVehicleDto)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O veículo foi editado com sucesso.',
        vehicleUpdated,
      });
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar encontrar o veículo.',
        error: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um veículo' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do veículo a ser deletado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Veículo removido com sucesso.',
    type: VehicleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado.' })
  @ApiResponse({
    status: 500,
    description: 'O sistema apresentou um erro ao tentar deletar o veículo.',
  })
  async remove(@Param('id') id: string, @Res() response): Promise<VehicleResponseDto> {
    try {
      const vehicleRemoved = (await this.vehicleService.remove(id)).toDTO();

      return response.json({
        message: 'O veículo foi removido com sucesso.',
        vehicleRemoved,
        status: HttpStatus.OK
      });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Veículo não encontrado.',
          error: error.message,
        });
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar deletar o veículo.\nTente novamente mais tarde',
        error: error.message,
      });
    }
  }

  @Post('clear')
  @ApiOperation({ summary: 'Deletar todos os veículos.' })
  @ApiResponse({
    status: 200,
    description: 'Todos os veículos removidos com sucesso.',
  })
  @ApiResponse({ status: 500, description: 'Erro no servidor.' })
  async clearAll(@Res() response): Promise<void> {
    try {
      await this.vehicleService.removeAll();

      return response.status(HttpStatus.OK).json({
        message: 'Todos os veículos foram removidos com sucesso.',
      });
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar deletar todos os veículos.\nTente novamente mais tarde',
        error: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/vehicles')
  @ApiOperation({ summary: 'Retornar os veículos de um usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Veículos do usuário retornados com sucesso.',
    type: [VehicleResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Erro interno ao tentar retornar veículos do usuário.' })
  async getUserVehicles(@Req() req, @Res() response) {
    try {
      const userId = req.user.sub;
      const userVehiclesModel = await this.vehicleService.getUserVehicles(userId);
      const userVehicles = userVehiclesModel.map((vehicle) => vehicle.toDTO());

      return response.status(HttpStatus.OK).json({
        message: 'Os veículos foram encontrados com sucesso.',
        userVehicles,
      });
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar retornar os veículos do usuário.\nTente novamente mais tarde',
        error: error.message,
      });
    }
  }
}
