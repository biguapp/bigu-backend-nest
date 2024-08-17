import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './schemas/admin.schema';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../enums/enum';

@ApiTags('admin')
@ApiBearerAuth('access-token')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create admin'})
  @ApiResponse({ status: 200, description: 'Admin created.'})
  async create(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<Admin> {
    return this.adminService.create(createAdminDto, Role.Admin);
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'All admins returned.' })
  async findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get one admin' })
  @ApiResponse({ status: 200, description: 'Admin returned.' })
  async findOne(@Param('id') id: string): Promise<Admin> {
    return this.adminService.findOne(id);
  }

  @Get(':email')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get one admin by email' })
  @ApiResponse({ status: 200, description: 'Admin returned.' })
  async findByEmail(@Param('email') email: string): Promise<Admin> {
    return this.adminService.findByEmail(email);
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Edit admin'})
  @ApiResponse({ status: 200, description: 'Admin edited.'})
  async update(
    @Param('id') id: string,
    @Body() UpdateAdminDto: UpdateAdminDto
  ): Promise<Admin> {
    return this.adminService.update(id, UpdateAdminDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete one admin'})
  @ApiResponse({ status: 200, description: 'Admin deleted.'})
  async remove(@Param('id') id: string): Promise<void> {
    return this.adminService.remove(id);
  }
}
