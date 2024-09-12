import { Controller, Get, Put, Post, Body, Param, Delete, Req, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto'
import { Car } from './interfaces/car.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';

@ApiTags('cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um carro' })
  @ApiResponse({ status: 201, description: 'O carro foi criado com sucesso.' })
  async create(@Req() req, @Body() createCarDto: CreateCarDto): Promise<Car> {
    try{
      const userId = req.user.sub;
      const newCar = await this.carService.create(createCarDto, userId);
      return newCar
    }catch(error){
      console.log(error)
    }
  }
  
  @Get()
  @ApiOperation({ summary: 'Retornar todos os carros' })
  @ApiResponse({ status: 200, description: 'Todos os carros foram retornados.' })
  async findAll(): Promise<Car[]> {
    return this.carService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retornar um carro com base no id' })
  @ApiResponse({ status: 200, description: 'O carro foi retornado' })
  async findOne(@Param('id') id: string): Promise<Car> {
    return this.carService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Editar um carro com base no id'})
  @ApiResponse({ status: 200, description: 'Carro foi editado.'})
  async update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto
  ): Promise<Car> {
    return this.carService.update(id, updateCarDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um carro'})
  @ApiResponse({ status: 200, description: 'O carro foi deletado'})
  async remove(@Param('id') id: string): Promise<Car> {
    try{
      return this.carService.remove(id);
    }catch(error){
      console.log(error)
    }
  }

  @Post('clear')
  @ApiOperation({ summary: 'Deletar todos os carros.' })
  @ApiResponse({ status: 200, description: 'All cars have been successfully deleted.' })
  async clearAll(): Promise<void> {
    return this.carService.removeAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/cars')
  @ApiOperation({ summary: 'Retornar os carros de um usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Todos os carros do usuário serão retornados',
  })
  async getUserCars(@Req() req, @Res() response) {
    try{
      const userId = req.user.sub;
      const userCars = this.carService.getUserCars(userId);

      return response.status(HttpStatus.OK).json({
        message: 'Os carro foram encontrados com sucesso.',
        userCars
      });
      
    }catch(error){
      console.log(error)
    }
  }
}
