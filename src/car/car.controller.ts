import { Controller, Get, Put, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto'
import { Car } from './interfaces/car.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  // @Roles(Role.Driver)
  @ApiOperation({ summary: 'Create Car' })
  @ApiResponse({ status: 201, description: 'The car has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createCarDto: CreateCarDto): Promise<Car> {
    return this.carService.create(createCarDto);
  }

  @Get()
  // @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all cars' })
  @ApiResponse({ status: 200, description: 'All cars returned.' })
  async findAll(): Promise<Car[]> {
    return this.carService.findAll();
  }

  @Get(':id')
  // @Roles(Role.Car, Role.Admin)
  @ApiOperation({ summary: 'Get one car' })
  @ApiResponse({ status: 200, description: 'Car returned.' })
  async findOne(@Param('id') id: string): Promise<Car> {
    return this.carService.findOne(id);
  }

  @Put(':id')
  // @Roles(Role.Car, Role.Admin)
  @ApiOperation({ summary: 'Edit car'})
  @ApiResponse({ status: 200, description: 'Car edited.'})
  async update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto
  ): Promise<Car> {
    return this.carService.update(id, updateCarDto);
  }

  @Delete(':id')
  // @Roles(Role.Car, Role.Admin)
  @ApiOperation({ summary: 'Delete one car'})
  @ApiResponse({ status: 200, description: 'Car deleted.'})
  async remove(@Param('id') id: string): Promise<void> {
    return this.carService.remove(id);
  }

  @Post('clear')
  // @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete all cars' })
  @ApiResponse({ status: 200, description: 'All cars have been successfully deleted.' })
  async clearAll(): Promise<void> {
    return this.carService.removeAll();
  }
}
