import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
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
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All users returned.' })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, description: 'User returned.' })
  async findOneByEmail(@Param('email') email: string): Promise<User> {
    return await this.userService.findByEmail(email);
  }

  @Get(':matricula')
  @ApiOperation({ summary: 'Get user by matricula' })
  @ApiResponse({ status: 200, description: 'User returned.' })
  async findOneByMatricula(
    @Param('matricula') matricula: string,
  ): Promise<User> {
    return await this.userService.findByMatricula(matricula);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one user' })
  @ApiResponse({ status: 200, description: 'User returned.' })
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um usuário.'})
  @ApiResponse({ status: 200, description: 'O usuário foi deletado'})
  async remove(@Param('id') id: string): Promise<User> {
    try{
      return this.userService.remove(id);
    }catch(error){
      console.log(error)
    }
  }
}
