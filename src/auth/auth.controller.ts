import { Controller, Post, Body, HttpCode, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserResponseDto } from '@src/user/dto/response-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

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
    const { token, userResponse } = await this.authService.loginUser(
      email,
      password,
    );
    return { token: token, user: userResponse };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 204, description: 'User logged out' })
  @HttpCode(204)
  async logout(@Req() req): Promise<void> {
    const token = req.headers.authorization.split(' ')[1]; // Pega o token do header
    await this.authService.logout(token); // Chama o método logout do AuthService
  }

  @Post('register/user')
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({ status: 201, description: 'User registered' })
  @HttpCode(201)
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const { token, userResponse } =
      await this.authService.registerUser(createUserDto);
    return { user: userResponse, token: token };
  }
}
