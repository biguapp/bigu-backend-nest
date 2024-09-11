import { Controller, Post, Body, BadRequestException, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserResponseDto } from '@src/user/dto/response-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/user')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in' })
  @HttpCode(200)
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const { token, userResponse } = await this.authService.loginUser(email, password);
    return { token: token, user: userResponse };
  }

  @Post('register/user')
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({ status: 201, description: 'User registered' })
  @HttpCode(201)
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.registerUser(createUserDto);
    //retornar token no registro 
    return { message: 'User registered successfully' };
  }
}
