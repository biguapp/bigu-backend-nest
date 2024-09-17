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
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  // UM USUÁRIO DEVE SER CRIADO EM AUTH.REGISTRO, ESSA ROTA É APENAS PARA TESTES
  // @Post()
  // @ApiOperation({ summary: 'Create User' }) 
  // @ApiResponse({
  //   status: 201,
  //   description: 'The user has been successfully created.',
  // })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return this.userService.create(createUserDto);
  // }

  @Get()
  @ApiOperation({ summary: 'Retorna todos os usuários.' })
  async findAll(@Res() response): Promise<UserResponseDto[]> {
    try{
      const usersModel = await this.userService.findAll();
      const users = usersModel.map((user) => user.toDTO())
      
      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        users
      });
    }catch(error){
      console.log(error)
    }
  }

  @Get(':email')
  @ApiOperation({ summary: 'Retorna um usuário pela email' })
  async findOneByEmail(@Res() response, @Param('email') email: string): Promise<UserResponseDto> {
    try{
      const user = (await this.userService.findByMatricula(email)).toDTO();
      
      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        user
      });
    }catch(error){
      console.log(error)
    }
  }

  @Get(':matricula')
  @ApiOperation({ summary: 'Retorna um usuário pela matrícula' })
  async findOneByMatricula(
    @Res() response, @Param('matricula') matricula: string,
  ): Promise<UserResponseDto> {
    try{
      const user = (await this.userService.findByMatricula(matricula)).toDTO();
      
      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        user
      });
    }catch(error){
      console.log(error)
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um usuário' })
  async findOne(@Res() response, @Param('id') id: string): Promise<UserResponseDto> {
    try{
      const user = (await this.userService.findOne(id)).toDTO();
      
      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        user
      });
    }catch(error){
      console.log(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um usuário.'})
  async remove(@Res() response, @Param('id') id: string): Promise<UserResponseDto> {
    try{
      const userRemoved = (await this.userService.remove(id)).toDTO();
      
      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi removido com sucesso.',
        userRemoved
      });
    }catch(error){
      console.log(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Editar um usuário' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response
  ): Promise<UserResponseDto> { 
    try{
      const userUpdated = (await this.userService.update(id, updateUserDto)).toDTO();
      
      return response.status(HttpStatus.OK).json({
        message: "O usuário foi atualizado com sucesso.",
        userUpdated
      });
    }catch(error){
      console.log(error)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/self')
  @ApiOperation({ summary: 'Get user logged' })
  async findSelf(@Res() response, @Req() req): Promise<UserResponseDto> {
    try{
      const userId = req.user.sub;
      const user = (await this.userService.findOne(userId)).toDTO();
      
      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        user
      });
    }catch(error){
      console.log(error)
    }
  }
}