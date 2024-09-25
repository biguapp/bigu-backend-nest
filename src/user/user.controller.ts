import {
  Controller,
  Get,
  Param,
  Delete,
  Req,
  UseGuards,
  Res,
  HttpStatus,
  Put,
  Body,
  NotFoundException,
  Post,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as sharp from 'sharp';
import * as path from 'path';
import { Express } from 'express';
import * as fs from 'fs';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Usuários retornados com sucesso.',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao retornar todos os usuários.',
  })
  async findAll(@Res() response): Promise<UserResponseDto[]> {
    try {
      const usersModel = await this.userService.findAll();
      let users: UserResponseDto[] = [];

      if (usersModel) {
        users = usersModel.map((user) => user.toDTO());
      }

      return response.status(HttpStatus.OK).json({
        message: 'Os usuários foram retornados com sucesso.',
        users,
      });

    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno ao retornar todos os usuários.',
        error: error.message,
      });
    }
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Retorna um usuário pelo email' })
  @ApiParam({
    name: 'email',
    required: true,
    description: 'Email do usuário a ser retornado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário retornado com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findOneByEmail(
    @Res() response,
    @Param('email') email: string,
  ): Promise<UserResponseDto> {
    try {
      const user = (await this.userService.findByEmail(email)).toDTO();
      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        user,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado.',
        });
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao procurar usuário.',
        error: error.message,
      });
    }
  }

  @Get('matricula/:matricula')
  @ApiOperation({ summary: 'Retorna um usuário pela matrícula' })
  @ApiParam({
    name: 'matricula',
    required: true,
    description: 'Matrícula do usuário a ser retornado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário retornado com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findOneByMatricula(
    @Res() response,
    @Param('matricula') matricula: string,
  ): Promise<UserResponseDto> {
    try {
      const user = (await this.userService.findByMatricula(matricula)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        user,
      });
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('id/:id')
  @ApiOperation({ summary: 'Retorna um usuário pelo ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do usuário a ser retornado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário retornado com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findOne(
    @Res() response,
    @Param('id') id: string,
  ): Promise<UserResponseDto> {
    try {
      const user = (await this.userService.findOne(id)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        user,
      });
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um usuário' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do usuário a ser deletado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário removido com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async remove(@Res() response, @Req() req): Promise<UserResponseDto> {
    try {
      const userId = req.user.sub;
      const userRemoved = (await this.userService.remove(userId)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi removido com sucesso.',
        userRemoved,
      });
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um usuário' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do usuário a ser atualizado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response,
  ): Promise<UserResponseDto> {
    try {
      const userId = req.user.sub;
      const userUpdated = (
        await this.userService.update(userId, updateUserDto)
      ).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi atualizado com sucesso.',
        userUpdated,
      });
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  @ApiOperation({ summary: 'Retorna o usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Usuário autenticado retornado com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
  async findSelf(@Res() response, @Req() req): Promise<UserResponseDto> {
    try {
      const userId = req.user.sub;
      const user = (await this.userService.findOne(userId)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        user,
      });
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1 * 1024 * 1024 }, // Limite de tamanho: 1MB
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Somente imagens JPEG ou PNG são permitidas!',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }
    // Compressão usando sharp
    const compressedImageBuffer = await sharp(file.buffer)
      .resize(300, 300)
      .jpeg({ quality: 80 })
      .toBuffer(); // Gera o buffer da imagem comprimida

    // Atualiza a imagem binária no documento do usuário no MongoDB
    const userId = req.user.sub;
    await this.userService.updateProfilePic(userId, compressedImageBuffer);

    return {
      message: 'Imagem enviada e atribuída com sucesso.',
      path: 'Imagem salva diretamente no banco de dados.',
    };
  }
}
