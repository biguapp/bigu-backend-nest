import { Controller, Get, Put, Post, Body, Param, Delete, Req, UseGuards, Res, HttpStatus, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CarResponseDto } from './dto/response-car.dto';

@ApiTags('cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um carro' })
  @ApiResponse({
    status: 201,
    description: 'Carro criado com sucesso.',
    type: CarResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Erro no servidor.' })
  async create(@Res() response, @Req() req, @Body() createCarDto: CreateCarDto): Promise<CarResponseDto> {
    try {
      const userId = req.user.sub;
      const newCar = (await this.carService.create(createCarDto, userId)).toDTO();

      return response.status(HttpStatus.CREATED).json({
        message: 'O carro foi criado com sucesso.',
        newCar,
      });
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar adicionar o carro.\nTente novamente mais tarde.',
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retornar todos os carros' })
  @ApiResponse({
    status: 200,
    description: 'Todos os carros retornados com sucesso.',
    type: [CarResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Erro no servidor.' })
  async findAll(@Res() response): Promise<CarResponseDto[]> {
    try {
      const carsModel = await this.carService.findAll();
      const cars = carsModel.map((car) => car.toDTO());

      return response.status(HttpStatus.OK).json({
        message: 'Todos os carros foram retornados com sucesso.',
        cars,
      });
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar retornar todos os carros.',
        error: error.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retornar um carro com base no id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do carro a ser retornado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Carro retornado com sucesso.',
    type: CarResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Carro não encontrado.' })
  async findOne(@Param('id') id: string, @Res() response): Promise<CarResponseDto> {
    try {
      const car = (await this.carService.findOne(id)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O carro foi retornado com sucesso.',
        car,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Carro não encontrado.',
          error: error.message,
        });
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar encontrar o carro.\nTente novamente mais tarde',
        error: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Editar um carro com base no id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do carro a ser editado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Carro editado com sucesso.',
    type: CarResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Carro não encontrado.' })
  @ApiResponse({
    status: 500,
    description: 'O sistema apresentou um erro ao tentar encontrar o carro.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @Res() response
  ): Promise<CarResponseDto> {
    try {
      const carUpdated = (await this.carService.update(id, updateCarDto)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O carro foi editado com sucesso.',
        carUpdated,
      });
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar encontrar o carro.',
        error: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um carro' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do carro a ser deletado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Carro removido com sucesso.',
    type: CarResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Carro não encontrado.' })
  @ApiResponse({
    status: 500,
    description: 'O sistema apresentou um erro ao tentar deletar o carro.',
  })
  async remove(@Param('id') id: string, @Res() response): Promise<CarResponseDto> {
    try {
      const carRemoved = (await this.carService.remove(id)).toDTO();

      return response.json({
        message: 'O carro foi removido com sucesso.',
        carRemoved,
        status: HttpStatus.OK
      });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Carro não encontrado.',
          error: error.message,
        });
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar deletar o carro.\nTente novamente mais tarde',
        error: error.message,
      });
    }
  }

  @Post('clear')
  @ApiOperation({ summary: 'Deletar todos os carros.' })
  @ApiResponse({
    status: 200,
    description: 'Todos os carros removidos com sucesso.',
  })
  @ApiResponse({ status: 500, description: 'Erro no servidor.' })
  async clearAll(@Res() response): Promise<void> {
    try {
      await this.carService.removeAll();

      return response.status(HttpStatus.OK).json({
        message: 'Todos os carros foram removidos com sucesso.',
      });
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar deletar todos os carros.\nTente novamente mais tarde',
        error: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/cars')
  @ApiOperation({ summary: 'Retornar os carros de um usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Carros do usuário retornados com sucesso.',
    type: [CarResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Erro interno ao tentar retornar carros do usuário.' })
  async getUserCars(@Req() req, @Res() response) {
    try {
      const userId = req.user.sub;
      const userCarsModel = await this.carService.getUserCars(userId);
      const userCars = userCarsModel.map((car) => car.toDTO());

      return response.status(HttpStatus.OK).json({
        message: 'Os carros foram encontrados com sucesso.',
        userCars,
      });
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao tentar retornar os carros do usuário.\nTente novamente mais tarde',
        error: error.message,
      });
    }
  }
}
