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
  async findAll(@Res() response): Promise<User[]> {
    try{
      const users = this.userService.findAll();
      
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
  async findOneByEmail(@Res() response, @Param('email') email: string): Promise<User> {
    try{
      const user = this.userService.findByMatricula(email);
      
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
  ): Promise<User> {
    try{
      const user = this.userService.findByMatricula(matricula);
      
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
  async findOne(@Res() response, @Param('id') id: string): Promise<User> {
    try{
      const user = this.userService.findOne(id);
      
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
  async remove(@Res() response, @Param('id') id: string): Promise<User> {
    try{
      const userRemoved = this.userService.remove(id);
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
  @ApiResponse({ status: 200, description: 'User returned.' })
  async findSelf(@Res() response, @Req() req): Promise<User> {
    try{
      const userId = req.user.sub;
      const user = await this.userService.findOne(userId);
      return response.status(HttpStatus.OK).json({
        message: 'O usuário foi retornado com sucesso.',
        user
      });
    
    }catch(error){
      console.log(error)
    }
  }
}