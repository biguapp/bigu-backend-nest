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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAddressDto } from '../address/dto/create-address.dto';
import { CreateCarDto } from '../car/dto/create-car.dto';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':userId/address')
  @ApiOperation({ summary: 'Add address to user.' })
  @ApiResponse({
    status: 201,
    description: 'The address has been successfully added.',
  })
  async addAddress(
    @Param('userId') userId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.userService.addAddressToUser(userId, createAddressDto);
  }

  @Post(':userId/car')
  @ApiOperation({ summary: 'Add car to user.' })
  @ApiResponse({
    status: 201,
    description: 'The car has been successfully added.',
  })
  async addCar(
    @Param('userId') userId: string,
    @Body() createCarDto: CreateCarDto,
  ) {
    return this.userService.addCarToUser(userId, createCarDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('car')
  @ApiOperation({ summary: 'Get user cars' })
  @ApiResponse({
    status: 200,
    description: 'All cars from user returned',
  })
  async getUserCars(@Req() req) {
    const userId = req.user.sub;  // Pega o userId da requisição
    return this.userService.getUserCars(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All users returned.' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get()
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, description: 'User returned.' })
  async findOneByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }

  @Get(':id')
  // @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Get one user' })
  @ApiResponse({ status: 200, description: 'User returned.' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  // @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Edit user' })
  @ApiResponse({ status: 200, description: 'User edited.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  // @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Delete one user' })
  @ApiResponse({ status: 200, description: 'User deleted.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }

  @Delete('clear')
  // @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete all users' })
  @ApiResponse({
    status: 200,
    description: 'All users have been successfully deleted.',
  })
  async clearAll(): Promise<void> {
    return this.userService.removeAll();
  }
}
