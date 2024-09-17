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
  Body 
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
  @ApiResponse({ status: 500, description: 'Erro no servidor.' })
  async findAll(@Res() response): Promise<UserResponseDto[]> {
    try {
      const usersModel = await this.userService.findAll();
      const users = usersModel.map((user) => user.toDTO());

      return response.status(HttpStatus.OK).json({
        message: 'Os usuários foram retornados com sucesso.',
        users,
      });
    } catch (error) {
      console.log(error);
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
    @Param('email') email: string
  ): Promise<UserResponseDto> {
    try {
      const user = (await this.userService.findByEmail(email)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        user,
      });
    } catch (error) {
      console.log(error);
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
    @Param('matricula') matricula: string
  ): Promise<UserResponseDto> {
    try {
      const user = (await this.userService.findByMatricula(matricula)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        user,
      });
    } catch (error) {
      console.log(error);
    }
  }

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
  async findOne(@Res() response, @Param('id') id: string): Promise<UserResponseDto> {
    try {
      const user = (await this.userService.findOne(id)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        user,
      });
    } catch (error) {
      console.log(error);
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
  async remove(@Res() response, @Param('id') id: string): Promise<UserResponseDto> {
    try {
      const userRemoved = (await this.userService.remove(id)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi removido com sucesso.',
        userRemoved,
      });
    } catch (error) {
      console.log(error);
    }
  }

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
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response
  ): Promise<UserResponseDto> {
    try {
      const userUpdated = (await this.userService.update(id, updateUserDto)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi atualizado com sucesso.',
        userUpdated,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/self')
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
      console.log(error);
    }
  }
}
