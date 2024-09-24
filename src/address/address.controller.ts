import { Controller,Post,Get,Param,Body,Put,Delete,UseGuards,Req,Res,HttpStatus, NotFoundException } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddressResponseDto } from './dto/response-address.dto';

@ApiTags('addresses')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um endereço' })
  @ApiResponse({ 
    status: 201, 
    description: 'Endereço criado com sucesso.', 
    type: AddressResponseDto 
  })
  @ApiResponse({ status: 500, description: 'Erro no servidor.' })
  async create(
    @Req() req, 
    @Body() createAddressDto: CreateAddressDto, 
    @Res() response
  ): Promise<AddressResponseDto> {
    try {
      const userId = req.user.sub;
      const userAddress = (await this.addressService.create(createAddressDto, userId)).toDTO();
      
      return response.status(HttpStatus.CREATED).json({
        message: 'O endereço foi criado com sucesso.',
        userAddress
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retornar todos os endereços' })
  @ApiResponse({ 
    status: 200, 
    description: 'Todos os endereços retornados com sucesso.', 
    type: [AddressResponseDto] 
  })
  @ApiResponse({ status: 500, description: 'Erro no servidor.' })
  async findAll(@Res() response): Promise<AddressResponseDto[]> {
    try {
      const addressesModel = await this.addressService.findAll();
      const addresses = addressesModel.map((address) => address.toDTO());
      
      return response.status(HttpStatus.OK).json({
        message: "Todos os endereços foram retornados.",
        addresses
      });
    } catch (error) {
      console.log(error);
    } 
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retornar um endereço' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do endereço a ser retornado',
    type: String,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Endereço retornado com sucesso.', 
    type: AddressResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado.' })
  async findOne(@Param('id') id: string, @Res() response): Promise<AddressResponseDto> {
    try {
      const address = (await this.addressService.findOne(id)).toDTO();
      
      return response.status(HttpStatus.OK).json({
        message: "O endereço foi retornado com sucesso.",
        address
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Endereço não encontrado.',
        });
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao procurar endereço.',
        error: error.message,
      });
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Editar um endereço' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do endereço a ser atualizado',
    type: String,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Endereço atualizado com sucesso.', 
    type: AddressResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Res() response
  ): Promise<AddressResponseDto> { 
    try {
      const addressUpdated = (await this.addressService.update(id, updateAddressDto)).toDTO();
      
      return response.status(HttpStatus.OK).json({
        message: "O endereço foi atualizado com sucesso.",
        addressUpdated
      });
    } catch (error) {
      console.log(error);
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um endereço' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do endereço a ser removido',
    type: String,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Endereço removido com sucesso.', 
    type: AddressResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado.' })
  async remove(@Res() response, @Param('id') id: string): Promise<AddressResponseDto> {
    try {
      const addressRemoved = (await this.addressService.remove(id)).toDTO();

      return response.status(HttpStatus.OK).json({
        message: "O endereço foi removido com sucesso.",
        addressRemoved
      });
    } catch (error) {
      console.log(error);
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/addresses')
  @ApiOperation({ summary: 'Retornar todos os endereços de um usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Endereços do usuário retornados com sucesso.', 
    type: [AddressResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
  async getUserAddresses(@Res() response, @Req() req): Promise<AddressResponseDto[]> {
    try {
      const userId = req.user.sub;
      const userAddressModel = await this.addressService.getUserAddresses(userId);
      const userAddress = userAddressModel.map((address) => address.toDTO());
      
      return response.status(HttpStatus.OK).json({
        message: 'Os endereços do usuário foram retornados com sucesso.',
        userAddress
      });
    } catch (error) {
      console.log(error);
    }
  }
}
