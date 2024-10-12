import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Param, Put, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserResponseDto } from '../user/dto/response-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/user')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login efetuado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @ApiResponse({ status: 500, description: 'Erro interno ao autenticar usuário.' })
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res() response: Response) {
    try {
      const { email, password } = loginUserDto;
      const { accessToken, refreshToken, userResponse } =
        await this.authService.loginUser(email, password);
      
      return response.status(HttpStatus.OK).json({
        message: 'Login efetuado com sucesso.',
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: userResponse,
      })
    } catch (error) {
      console.error(error);
      if (error instanceof UnauthorizedException) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message: error.message || 'Operação não autorizada.',
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro do sistema ao autenticar o usuário.\nTente novamente mais tarde.',
        error: error.message || 'Erro interno do servidor',
      });
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token de acesso renovado' })
  @ApiResponse({ status: 401, description: 'Token inválido.' })
  @ApiResponse({ status: 500, description: 'Erro interno ao renovar o token do usuário.' })
  async refreshAccessToken(@Body('refreshToken') refreshToken: string, @Res() response: Response) {
    try {
      const newAccessToken = await this.authService.refreshAccessToken(refreshToken);
      return response.status(HttpStatus.OK).json({
        newAccessToken: newAccessToken,
      })
    } catch (error) {
      console.error(error);
      if (error instanceof UnauthorizedException) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message: error.message || 'Operação não autorizada.',
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro do sistema ao renovar o token do usuário.\nTente novamente mais tarde.',
        error: error.message || 'Erro interno do servidor',
      });
    }
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
  @ApiResponse({ status: 500, description: 'Erro interno ao renovar o token do usuário.' })
  async registerUser(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    try {
      const { accessToken, refreshToken, userResponse } =
        await this.authService.registerUser(createUserDto);
      
    return response.status(HttpStatus.OK).json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      userResponse: userResponse,
    });
    } catch(error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'O sistema apresentou um erro ao efetuar o cadastro.\nTente novamente mais tarde.',
        error: error.message || 'Erro interno do servidor',
      });
    }
    
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

  @Post('request-password-reset/')
  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  @ApiResponse({ status: 200, description: 'Código de verificação enviado.' })
  async requestPasswordReset(@Body() requestResetPasswordDto: RequestResetPasswordDto) {
    return this.authService.requestPasswordReset(requestResetPasswordDto.email);
  }

  @Put('reset-password/:email/:code')
  @ApiOperation({ summary: 'Redefinir senha com código de verificação.' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso.' })
  async resetPassword(
    @Param('email') email: string,
    @Param('code') code: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(email, code, resetPasswordDto.password);
  }


}
