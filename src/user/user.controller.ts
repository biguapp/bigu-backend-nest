import {
  Controller,
  Get,
  Param,
  Delete,
  Req,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './interfaces/user.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from './dto/response-user.dto';
import { mapUserToUserResponse } from '@src/utils/Mappers';

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

      const users = usersModel.map((user) => mapUserToUserResponse(user));
      
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
      const userModel = await this.userService.findByMatricula(email);
      const user = mapUserToUserResponse(userModel);
      
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
      const userModel = await this.userService.findByMatricula(matricula);
      const user = mapUserToUserResponse(userModel);
      
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
      const userModel = await this.userService.findOne(id);
      const user = mapUserToUserResponse(userModel);
      
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
      const userModel = await this.userService.remove(id);
      const userRemoved = mapUserToUserResponse(userModel);
      
      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi removido com sucesso.',
        userRemoved
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
      const userModel = await this.userService.findOne(userId);
      const user = mapUserToUserResponse(userModel);
      
      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        user
      });
    }catch(error){
      console.log(error)
    }
  }
}