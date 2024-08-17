import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { HealthUnitService } from './health-unit.service';
import { CreateHealthUnitDto } from './dto/create-health-unit.dto';
import { UpdateHealthUnitDto } from './dto/update-health-unit.dto';
import { HealthUnit } from './interfaces/health-unit.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../enums/enum';
import { RolesGuard } from '../roles/roles.guard';

@ApiTags('health-units')
@ApiBearerAuth()
@Controller('health-units')
@UseGuards(RolesGuard)
export class HealthUnitController {
  constructor(private readonly healthUnitService: HealthUnitService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create Health Unit' })
  @ApiResponse({
    status: 201,
    description: 'The health unit has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(
    @Body() createHealthUnitDto: CreateHealthUnitDto,
  ): Promise<HealthUnit> {
    return this.healthUnitService.create(createHealthUnitDto);
  }

  @Get()
  @Roles(Role.Patient, Role.Admin)
  @ApiOperation({ summary: 'Get all health units' })
  @ApiResponse({ status: 200, description: 'Return all health units.' })
  async findAll(): Promise<HealthUnit[]> {
    return this.healthUnitService.findAll();
  }

  @Get(':id')
  @Roles(Role.Patient, Role.Admin)
  @ApiOperation({ summary: 'Get one health unit' })
  @ApiResponse({ status: 200, description: 'Return one health unit.' })
  async findOne(@Param('id') id: string): Promise<HealthUnit> {
    return this.healthUnitService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Edit health unit' })
  @ApiResponse({ status: 200, description: 'Health unit edited.' })
  async update(
    @Param('id') id: string,
    @Body() updateHealthUnitDto: UpdateHealthUnitDto,
  ): Promise<HealthUnit> {
    return this.healthUnitService.update(id, updateHealthUnitDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete one health unit' })
  @ApiResponse({ status: 200, description: 'Health unit deleted.' })
  async remove(@Param('id') id: string): Promise<String> {
    return this.healthUnitService.remove(id);
  }

  @Post('clear')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete all health units' })
  @ApiResponse({ status: 200, description: 'All health units have been successfully deleted.' })
  async clearAll(): Promise<void> {
    return this.healthUnitService.removeAll();
  }
}
