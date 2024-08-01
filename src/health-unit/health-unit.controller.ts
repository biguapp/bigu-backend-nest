import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { HealthUnitService } from './health-unit.service';
import { CreateHealthUnitDto } from './dto/create-health-unit.dto';
import { UpdateHealthUnitDto } from './dto/update-health-unit.dto';
import { HealthUnit } from './interfaces/health-unit.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health-units')
@Controller('health-units')
export class HealthUnitController {
  constructor(private readonly healthUnitService: HealthUnitService) {}

  @Post()
  @ApiOperation({summary: 'Create Health Unit'})
  @ApiResponse({ status: 201, description: 'The health unit has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createHealthUnitDto: CreateHealthUnitDto): Promise<HealthUnit> {
    return this.healthUnitService.create(createHealthUnitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all health units' })
  @ApiResponse({ status: 200, description: 'Return all health units.' })
  async findAll(): Promise<HealthUnit[]> {
    return this.healthUnitService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one health unit' })
  @ApiResponse({ status: 200, description: 'Return one health unit.' })
  async findOne(@Param('id') id: string): Promise<HealthUnit> {
    return this.healthUnitService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({summary: 'Edit health unit'})
  @ApiResponse({ status:200, description: 'Health unit edited.'})
  async update(
    @Param('id') id: string,
    @Body() updateHealthUnitDto: UpdateHealthUnitDto
  ): Promise<HealthUnit> {
    return this.healthUnitService.update(id, updateHealthUnitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one health unit'})
  @ApiResponse({ status: 200, description: 'Health unit deleted.'})
  async remove(@Param('id') id: string): Promise<void> {
    return this.healthUnitService.remove(id);
  }
}
