import { Controller, Post, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginPatientDto } from '../patient/dto/login-patient.dto';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/admin')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Admin logged in' })
  async loginAdmin(@Body() createAdminDto: CreateAdminDto) {
    const { email, password } = createAdminDto;
    const token = await this.authService.loginAdmin(email, password);
    if (!token) {
      throw new BadRequestException('Invalid credentials');
    }
    return { access_token: token };
  }

  @Post('login/patient')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Patient login' })
  @ApiResponse({ status: 200, description: 'Patient logged in' })
  async loginPatient(@Body() loginPatientDto: LoginPatientDto) {
    const { cpf, password } = loginPatientDto;
    const token = await this.authService.loginPatient(cpf, password);
    if (!token) {
      throw new BadRequestException('Invalid credentials');
    }
    return { access_token: token };
  }

  @Post('register/admin')
  @ApiOperation({ summary: 'Register an admin' })
  @ApiResponse({ status: 201, description: 'Admin registered' })
  async registerAdmin(@Body() createAdminDto: CreateAdminDto) {
    const admin = await this.authService.registerAdmin(createAdminDto);
    if (!admin) {
      throw new BadRequestException('Failed to register admin');
    }
    return { message: 'Admin registered successfully' };
  }

  @Post('register/patient')
  @ApiOperation({ summary: 'Register a patient' })
  @ApiResponse({ status: 201, description: 'Patient registered' })
  async registerPatient(@Body() createPatientDto: CreatePatientDto) {
    const patient = await this.authService.registerPatient(createPatientDto);
    if (!patient) {
      throw new BadRequestException('Failed to register patient');
    }
    return { message: 'Patient registered successfully' };
  }
}
