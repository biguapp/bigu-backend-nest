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
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAddressDto } from '../address/dto/create-address.dto';
import { CreateCarDto } from '../car/dto/create-car.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/user/self/address')
  @ApiOperation({ summary: 'Add address to user.' })
  @ApiResponse({
    status: 201,
    description: 'The address has been successfully added.',
  })
  async addAddress(
    @Req() req,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    const userId = req.user.sub; // Pega o userId da requisição
    return this.userService.addAddressToUser(userId, createAddressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/user/self/car')
  @ApiOperation({ summary: 'Add car to user.' })
  @ApiResponse({
    status: 201,
    description: 'The car has been successfully added.',
  })
  async addCar(
    @Req() req,
    @Body() createCarDto: CreateCarDto,
  ) {
    const userId = req.user.sub; // Pega o userId da requisição
    return this.userService.addCarToUser(userId, createCarDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/self/car')
  @ApiOperation({ summary: 'Get user cars' })
  @ApiResponse({
    status: 200,
    description: 'All cars from user returned',
  })
  async getUserCars(@Req() req) {
    const userId = req.user.sub; // Pega o userId da requisição
    return this.userService.getUserCars(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/self/address')
  @ApiOperation({ summary: 'Get user addresses' })
  @ApiResponse({
    status: 200,
    description: 'All address from user returned',
  })
  async getUserAddresses(@Req() req) {
    const userId = req.user.sub; // Pega o userId da requisição
    return this.userService.getUserAddresses(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/self/history')
  @ApiOperation({ summary: 'Get user history' })
  @ApiResponse({
    status: 200,
    description: 'All history from user returned',
  })
  async getUserHistory(@Req() req) {
    const userId = req.user.sub; // Pega o userId da requisição
    return this.userService.getUserHistory(userId);
  }


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

  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All users returned.' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, description: 'User returned.' })
  async findOneByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }

  @Get(':matricula')
  @ApiOperation({ summary: 'Get user by matricula' })
  @ApiResponse({ status: 200, description: 'User returned.' })
  async findOneByMatricula(
    @Param('matricula') matricula: string,
  ): Promise<User> {
    return this.userService.findByMatricula(matricula);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one user' })
  @ApiResponse({ status: 200, description: 'User returned.' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/self')
  @ApiOperation({ summary: 'Get user logged' })
  @ApiResponse({ status: 200, description: 'User returned.' })
  async findSelf(@Req() req): Promise<User> {
    const userId = req.user.sub;
    return this.userService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/user/self')
  @ApiOperation({ summary: 'Edit self' })
  @ApiResponse({ status: 200, description: 'User edited.' })
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const userId = req.user.sub;
    return this.userService.update(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/user/self')
  @ApiOperation({ summary: 'Delete self account' })
  @ApiResponse({ status: 200, description: 'User deleted.' })
  async remove(@Req() req): Promise<void> {
    const userId = req.user.sub;
    return this.userService.remove(userId);
  }
}
