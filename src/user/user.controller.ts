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
  InternalServerErrorException,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import * as sharp from 'sharp';
import { Express } from 'express';


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
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado.' 
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao retornar todos os usuários.',
  })
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
      console.error(error);
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado.',
          error: error.message,
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
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado.' 
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao tentar encontrar o usuário.',
  })
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

      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado.',
          error: error.message,
        });
      }

      throw new InternalServerErrorException({
        message: 'Erro ao retornar usuário.',
        error: error.message || 'Erro interno do servidor',
      });
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
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado.' 
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao tentar encontrar o usuário.',
  })
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
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado.',
          error: error.message,
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao procurar usuário.',
        error: error.message,
      });
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
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado.' 
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao tentar remover o usuário.',
  })
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

      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado.',
          error: error.message,
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao deletar usuário.',
        error: error.message,
      });
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
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado.' 
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao tentar atualizar o usuário.',
  })
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

      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado.',
          error: error.message,
        });
      }
      
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao atualizar usuário.',
        error: error.message,
      });
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
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao tentar retornar o usuário.',
  })
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

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno ao tentar retornar o usuário.',
        error: error.message,
      });
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
    const compressedImageBuffer = await sharp(file.buffer)
      .resize(300, 300)
      .jpeg({ quality: 80 })
      .toBuffer(); 

    const userId = req.user.sub;
    await this.userService.updateProfilePic(userId, compressedImageBuffer);

    return {
      message: 'Imagem enviada e atribuída com sucesso.',
      path: 'Imagem salva diretamente no banco de dados.',
    };
  }

@UseGuards(JwtAuthGuard)
@Post('upload-id-photo')
@UseInterceptors(
  FileInterceptor('file', {
    limits: { fileSize: 2 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
          new BadRequestException(
            'Only JPEG or PNG images are allowed!',
          ),
          false,
        );
      }
      cb(null, true);
    },
  }),
)
async uploadIdPhoto(
  @UploadedFile() file: Express.Multer.File,
  @Req() req,
): Promise<{ message: string; status: string }> {
  if (!file) {
    throw new BadRequestException('No file uploaded.');
  }

  const compressedImageBuffer = await sharp(file.buffer)
    .resize(800, 600) 
    .jpeg({ quality: 80 }) 
    .toBuffer();

  const userId = req.user.sub;
  await this.userService.updateIdPhoto(userId, compressedImageBuffer);
  await this.userService.notifyAdminForIdVerification(userId);

  return {
    message: 'ID photo uploaded successfully and sent for admin review.',
    status: 'success',
  };

}
@UseGuards(JwtAuthGuard)
@Get('id-photo')
@ApiOperation({ summary: 'Retorna a foto de ID do usuário autenticado' })
@ApiResponse({
  status: 200,
  description: 'Foto de ID retornada com sucesso.',
})
@ApiResponse({
  status: 404,
  description: 'Foto de ID não encontrada.',
})
@ApiResponse({
  status: 500,
  description: 'Erro interno ao tentar retornar a foto de ID.',
})
async getIdPhoto(@Res() response, @Req() req): Promise<void> {
  try {
    const userId = req.user.sub;
    const user = await this.userService.findOne(userId);

    if (!user || !user.idPhoto) {
      throw new NotFoundException('Foto de ID não encontrada.');
    }

    response.set({
      'Content-Type': 'image/jpeg', 
      'Content-Disposition': 'attachment; filename="id-photo.jpg"',
    });

    return response.send(user.idPhoto);
  } catch (error) {
    console.error(error);

    if (error instanceof NotFoundException) {
      return response.status(HttpStatus.NOT_FOUND).json({
        message: 'Foto de ID não encontrada.',
        error: error.message,
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Erro ao tentar retornar a foto de ID.',
      error: error.message,
    });
  }
}

@UseGuards(JwtAuthGuard)
@Put('evaluate-document/:id')
@ApiOperation({ summary: 'Avaliar o documento de um usuário' })
@ApiParam({
  name: 'id',
  required: true,
  description: 'ID do usuário cujo documento está sendo avaliado',
  type: String,
})
@ApiResponse({
  status: 200,
  description: 'Documento avaliado com sucesso.',
  type: UserResponseDto,
})
@ApiResponse({
  status: 400,
  description: 'Entrada inválida ou falha ao avaliar o documento.',
})
@ApiResponse({
  status: 404,
  description: 'Usuário não encontrado.',
})
@ApiResponse({
  status: 500,
  description: 'Erro interno do servidor.',
})
async evaluateUserDocument(
  @Req() req,
  @Param('id') id: string,
  @Body() evaluateDocumentDto: { isApproved: boolean; reason?: string },
  @Res() response
): Promise<UserResponseDto> {
  try {
    const userToEvaluate = await this.userService.findOne(id);
    if (!userToEvaluate) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const updatedUser = await this.userService.verifyUserDocument(id, evaluateDocumentDto.isApproved, evaluateDocumentDto.reason);

    return response.status(HttpStatus.OK).json({
      message: 'Avaliação do documento concluída com sucesso.',
      user: updatedUser.toDTO(),
    });
  } catch (error) {
    console.error(error);

    if (error instanceof NotFoundException) {
      return response.status(HttpStatus.NOT_FOUND).json({
        message: 'Usuário não encontrado.',
        error: error.message,
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Falha ao avaliar documento.',
      error: error.message,
    });
  }
}
}