import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './interfaces/address.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('addresses')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // Criação de um endereço
  @Post()
  @ApiOperation({ summary: 'Criar um endereço' })
  @ApiResponse({ status: 200, description: 'Endereço criado.' })
  async create(@Body() createAddressDto: CreateAddressDto): Promise<Address> {
    return this.addressService.create(createAddressDto);
  }

  // Listar todos os endereços
  @Get()
  @ApiOperation({ summary: 'Buscar todos os endereços' })
  @ApiResponse({ status: 200, description: 'Endereços retornados.' })
  async findAll(): Promise<Address[]> {
    return this.addressService.findAll();
  }

  // Buscar um endereço por ID
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um endereço' })
  @ApiResponse({ status: 200, description: 'Endereço retornado.' })
  async findOne(@Param('id') id: string): Promise<Address> {
    return this.addressService.findOne(id);
  }

  // Atualizar um endereço por ID
  @Put(':id')
  @ApiOperation({ summary: 'Editar um endereço' })
  @ApiResponse({ status: 200, description: 'Endereço editado.' })
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto
  ): Promise<Address> {
    return this.addressService.update(id, updateAddressDto);
  }

  // Remover um endereço por ID
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um endereço' })
  @ApiResponse({ status: 200, description: 'Endereço removido.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.addressService.remove(id);
  }

  // Remover todos os endereços
  @Delete()
  @ApiOperation({ summary: 'Remover todos os endereços' })
  @ApiResponse({ status: 200, description: 'Endereços removidos.' })
  async removeAll(): Promise<void> {
    return this.addressService.removeAll();
  }
}
