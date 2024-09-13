import { Controller, Get, Put, Post, Body, Param, Delete, Req, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto'
import { Car } from './interfaces/car.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { mapCarToCarResponse } from '@src/utils/Mappers';
import { CarResponseDto } from './dto/response-car.dto';

@ApiTags('cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um carro' })
  async create(@Res() response, @Req() req, @Body() createCarDto: CreateCarDto): Promise<CarResponseDto> {
    try{
      const userId = req.user.sub;
      const newCarModel = await this.carService.create(createCarDto, userId);
      const newCar = mapCarToCarResponse(newCarModel);
      
      return response.status(HttpStatus.CREATED).json({
        message: 'O carro foi criado com sucesso.',
        newCar
      });
    }catch(error){
      console.log(error)
    }
  }
  
  @Get()
  @ApiOperation({ summary: 'Retornar todos os carros' })
  async findAll(@Res() response): Promise<CarResponseDto[]> {
    try{
      const carsModel = await this.carService.findAll();
      const cars = carsModel.map((car) => mapCarToCarResponse(car));
      
      return response.status(HttpStatus.OK).json({
        message: 'Todos os carros foram retornados com sucesso com sucesso.',
        cars
      });
    }catch(error){
      console.log(error)
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retornar um carro com base no id' })
  async findOne(@Param('id') id: string,@Res() response): Promise<CarResponseDto> {
    try{
      const carModel = await this.carService.findOne(id);
      const car = mapCarToCarResponse(carModel);
      
      return response.status(HttpStatus.OK).json({
        message: 'O carro foi retornado com sucesso.',
        car
      });
    }catch(error){
      console.log(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Editar um carro com base no id'})
  async update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @Res() response
  ): Promise<CarResponseDto> {
    try{
      const carUpdatedModel = await this.carService.update(id, updateCarDto);
      const carUpdated = mapCarToCarResponse(carUpdatedModel);
      
      return response.status(HttpStatus.OK).json({
        message: 'O carro foi editado com sucesso.',
        carUpdated
      });
    }catch(error){
      console.log(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um carro'})
  async remove(@Param('id') id: string, @Res() response): Promise<CarResponseDto> {
    try{
      const carRemovedModel = await this.carService.remove(id);
      const carRemoved = mapCarToCarResponse(carRemovedModel);
      
      return response.status(HttpStatus.OK).json({
        message: 'O carro foi removido com sucesso.',
        carRemoved
      });

    }catch(error){
      console.log(error)
    }
  }

  @Post('clear')
  @ApiOperation({ summary: 'Deletar todos os carros.' })
  async clearAll(@Res() response): Promise<void> {
    try{
      await this.carService.removeAll();
      
      return response.status(HttpStatus.OK).json({
        message: 'Todos os carros foram removidos com sucesso'
      });

    }catch(error){
      console.log(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/cars')
  @ApiOperation({ summary: 'Retornar os carros de um usuário.' })
  async getUserCars(@Req() req, @Res() response) {
    try{
      const userId = req.user.sub;
      const userCarsModel = await this.carService.getUserCars(userId);
      
      const userCars = userCarsModel.map((car) => mapCarToCarResponse(car));

      return response.status(HttpStatus.OK).json({
        message: 'Os carro foram encontrados com sucesso.',
        userCars
      });
      
    }catch(error){
      console.log(error)
    }
  }
}
