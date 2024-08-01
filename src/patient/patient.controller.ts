import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './interfaces/patient.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Create patient' })
  @ApiResponse({ status: 201, description: 'The patient has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'Return all patients.' })
  async findAll(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one patient' })
  @ApiResponse({ status: 200, description: 'Return one patient.' })
  async findOne(@Param('id') id: string): Promise<Patient> {
    return this.patientService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.patientService.remove(id);
  }
}
