import { Controller, Post, Body, HttpCode, UseGuards, Req, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserResponseDto } from '../user/dto/response-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';

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
    const { accessToken, refreshToken, userResponse } =
      await this.authService.loginUser(email, password);
    return { accessToken, refreshToken, user: userResponse };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Access token refreshed' })
  @HttpCode(200)
  async refreshAccessToken(@Body('refreshToken') refreshToken: string) {
    return await this.authService.refreshAccessToken(refreshToken);
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
    const { accessToken, refreshToken, userResponse } =
      await this.authService.registerUser(createUserDto);
    return { user: userResponse, accessToken, refreshToken };
  }

  @UseGuards(JwtAuthGuard)
  @Put('confirm/user/:code')
  @ApiOperation({ summary: 'Confirm account.' })
  @ApiResponse({ status: 200, description: 'Account verified.' })
  @HttpCode(200)
  async confirmAccount(@Req() req, @Param('code') code: string) {
    const userId = req.user.sub;
    return await this.authService.confirmRegistration(userId, code);
  }

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  @ApiResponse({ status: 200, description: 'Código de verificação enviado.' })
  async requestPasswordReset(@Body() requestResetPasswordDto: RequestResetPasswordDto) {
    return this.authService.requestPasswordReset(requestResetPasswordDto.email);
  }

  @Put('reset-password/:code')
  @ApiOperation({ summary: 'Redefinir senha com código de verificação.' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso.' })
  async resetPassword(
    @Param('code') code: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(code, resetPasswordDto.password);
  }


}
