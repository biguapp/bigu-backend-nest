import { Controller, Post, Get, Param, Body, Put, Delete, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { AddressResponseDto } from './dto/response-address.dto';
import { mapAddressToAddressResponse } from '@src/utils/Mappers';

@ApiTags('addresses')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um endereço' })
  @ApiResponse({ status: 200, description: 'Endereço criado.' })
  async create(@Req() req, @Body() createAddressDto: CreateAddressDto, @Res() response): Promise<AddressResponseDto> {
    try{
      const userId = req.user.sub;
      const userAddressModel = await this.addressService.create(createAddressDto, userId);

      const userAddress = mapAddressToAddressResponse(userAddressModel);
      
      return response.status(HttpStatus.CREATED).json({
        message: 'O endereço foi criado com sucesso.',
        userAddress
      });

    }catch(error){
      console.log(error)
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retornar todos os endereços' })
  async findAll(@Res() response): Promise<AddressResponseDto[]> {
    try{
      const addressesModel = await this.addressService.findAll();
      const addresses = addressesModel.map((address) => mapAddressToAddressResponse(address));
      
      return response.status(HttpStatus.OK).json({
        message: "Todos os endereços foram retornados.",
        addresses
      });
    }catch(error){
      console.log(error)
    } 
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retornar um endereço' })
  async findOne(@Param('id') id: string, @Res() response): Promise<AddressResponseDto> {
    try{
      const addressModel = await this.addressService.findOne(id);
      const address = mapAddressToAddressResponse(addressModel);
      
      return response.status(HttpStatus.OK).json({
        message: "O endereço foi retornado com sucesso.",
        address
      });
    }catch(error){
      console.log(error)
    } 

  }

  @Put(':id')
  @ApiOperation({ summary: 'Editar um endereço' })
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Res() response
  ): Promise<AddressResponseDto> { 
    try{
      const addressUpdatedModel = await this.addressService.update(id, updateAddressDto);
      const addressUpdated = mapAddressToAddressResponse(addressUpdatedModel);
      
      return response.status(HttpStatus.OK).json({
        message: "O endereço foi atualizado com sucesso.",
        addressUpdated
      });
    }catch(error){
      console.log(error)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um endereço' })
  async remove(@Res() response, @Param('id') id: string): Promise<AddressResponseDto> {
    try{
      const addressRemovedModel = await this.addressService.remove(id);
      const addressRemoved = mapAddressToAddressResponse(addressRemovedModel);

      return response.status(HttpStatus.OK).json({
        message: "O endereço foi removido com sucesso.",
        addressRemoved
      });
    }catch(error){
      console.log(error)
    } 
  }

  @Delete()
  @ApiOperation({ summary: 'Remover todos os endereços' })
  async removeAll(@Res() response): Promise<void> {
    try{
      await this.addressService.removeAll();
      
      return response.status(HttpStatus.OK).json({
        message: 'Todos os endereços foram removidos com sucesso.'
      });
      
    }catch(error){
      console.log(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/addresses')
  @ApiOperation({ summary: 'Retorna todos os endereços de um usuário' })
  async getUserAddresses(@Res() response, @Req() req): Promise<AddressResponseDto[]> {
    try{
      const userId = req.user.sub;
      const userAddressModel = await this.addressService.getUserAddresses(userId);
      const userAddress = userAddressModel.map((address) => mapAddressToAddressResponse(address));
      
      return response.status(HttpStatus.OK).json({
        message: 'Os endereços do usuário foram retornados com sucesso.',
        userAddress
      });
      
    }catch(error){
      console.log(error)
    }
    
  }
}
