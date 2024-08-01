import { Controller, Get, Post, Body } from '@nestjs/common';
import { HealthUnitService } from './health-unit.service';
import { CreateHealthUnitDto } from './dto/create-health-unit.dto';
import { HealthUnit } from './interfaces/health-unit.interface';

@Controller('health-units')
export class HealthUnitController {
  constructor(private readonly healthUnitService: HealthUnitService) {}

  @Post()
  async create(@Body() createHealthUnitDto: CreateHealthUnitDto) {
    await this.healthUnitService.create(createHealthUnitDto);
  }

  @Get()
  async findAll(): Promise<HealthUnit[]> {
    return this.healthUnitService.findAll();
  }
}
