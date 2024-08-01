import { Controller, Get, Put, Post, Body, Param, Delete } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './interfaces/patient.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Create Patient' })
  @ApiResponse({ status: 201, description: 'The patient has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'All patients returned.' })
  async findAll(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one patient' })
  @ApiResponse({ status: 200, description: 'Patient returned.' })
  async findOne(@Param('id') id: string): Promise<Patient> {
    return this.patientService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit patient'})
  @ApiResponse({ status: 200, description: 'Patient edited.'})
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto
  ): Promise<Patient> {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one patient'})
  @ApiResponse({ status: 200, description: 'Patient deleted.'})
  async remove(@Param('id') id: string): Promise<void> {
    return this.patientService.remove(id);
  }
}
