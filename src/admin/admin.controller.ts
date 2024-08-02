import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateHealthUnitDto } from '../health-unit/dto/create-health-unit.dto';
import { UpdateHealthUnitDto } from '../health-unit/dto/update-health-unit.dto';
import { HealthUnit } from '../health-unit/interfaces/health-unit.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './schemas/admin.schema';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiTags('admin')
@ApiBearerAuth('access-token')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'All admins returned.' })
  async findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one admin' })
  @ApiResponse({ status: 200, description: 'Admin returned.' })
  async findOne(@Param('id') id: string): Promise<Admin> {
    return this.adminService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit admin'})
  @ApiResponse({ status: 200, description: 'Admin edited.'})
  async update(
    @Param('id') id: string,
    @Body() UpdateAdminDto: UpdateAdminDto
  ): Promise<Admin> {
    return this.adminService.update(id, UpdateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one admin'})
  @ApiResponse({ status: 200, description: 'Admin deleted.'})
  async remove(@Param('id') id: string): Promise<void> {
    return this.adminService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('health-units')
  async createHealthUnit(@Body() createHealthUnitDto: CreateHealthUnitDto): Promise<HealthUnit> {
    return this.adminService.createHealthUnit(createHealthUnitDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('health-units/:id')
  async getHealthUnit(@Param('id') id: string): Promise<HealthUnit> {
    return this.adminService.getHealthUnit(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('health-units/:id')
  async updateHealthUnit(@Param('id') id: string, @Body() updateHealthUnitDto: UpdateHealthUnitDto): Promise<HealthUnit> {
    return this.adminService.updateHealthUnit(id, updateHealthUnitDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('health-units/:id')
  async deleteHealthUnit(@Param('id') id: string): Promise<HealthUnit> {
    return this.adminService.deleteHealthUnit(id);
  }
}
