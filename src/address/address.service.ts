import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './interfaces/address.interface';
import { Address as AddressSchema } from './schemas/address.schema';

@Injectable()
export class AddressService {
  constructor(@InjectModel('Address') private addressModel: Model<AddressSchema>) {}

  // Criação de um endereço
  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const newAddress = new this.addressModel(createAddressDto);
    return await newAddress.save();
  }

  // Listar todos os endereços
  async findAll(): Promise<Address[]> {
    return await this.addressModel.find().exec();
  }

  // Buscar um endereço por ID
  async findOne(id: string): Promise<Address> {
    const address = await this.addressModel.findById(id).exec();
    if (!address) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
    }
    return address;
  }

  // Atualizar um endereço por ID
  async update(id: string, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const updatedAddress = await this.addressModel.findByIdAndUpdate(id, updateAddressDto, { new: true }).exec();
    if (!updatedAddress) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
    }
    return updatedAddress;
  }

  // Remover um endereço por ID
  async remove(id: string): Promise<void> {
    const result = await this.addressModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
    }
  }

  // Remover todos os endereços
  async removeAll(): Promise<void> {
    await this.addressModel.deleteMany().exec();
  }
}
