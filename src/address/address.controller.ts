import { Controller, Post, Get, Param, Body, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './interfaces/address.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';

@ApiTags('addresses')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um endereço' })
  @ApiResponse({ status: 200, description: 'Endereço criado.' })
  async create(@Req() req, @Body() createAddressDto: CreateAddressDto): Promise<Address> {
    try{
      const userId = req.user.sub;
      const address = await this.addressService.create(createAddressDto, userId);
      return address;
    }catch(error){
      console.log(error)
    }
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todos os endereços' })
  @ApiResponse({ status: 200, description: 'Endereços retornados.' })
  async findAll(): Promise<Address[]> {
    return this.addressService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um endereço' })
  @ApiResponse({ status: 200, description: 'Endereço retornado.' })
  async findOne(@Param('id') id: string): Promise<Address> {
    return this.addressService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Editar um endereço' })
  @ApiResponse({ status: 200, description: 'Endereço editado.' })
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto
  ): Promise<Address> {
    return this.addressService.update(id, updateAddressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um endereço' })
  @ApiResponse({ status: 200, description: 'Endereço removido.' })
  async remove(@Param('id') id: string): Promise<Address> {
    try{
      return await this.addressService.remove(id);
    }catch(error){
      console.log(error)
    } 
  }

  @Delete()
  @ApiOperation({ summary: 'Remover todos os endereços' })
  @ApiResponse({ status: 200, description: 'Endereços removidos.' })
  async removeAll(): Promise<void> {
    return this.addressService.removeAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/addresses')
  @ApiOperation({ summary: 'Retorna todos os endereços de um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Retorna todos os endereços de um usuário',
  })
  async getUserAddresses(@Req() req): Promise<Address[]> {
    try{
      const userId = req.user.sub;
      const userAddress = await this.addressService.getUserAddresses(userId);
      
      return userAddress; 
      
    }catch(error){

    }
    
  }
}
