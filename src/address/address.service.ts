import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './interfaces/address.interface';
import { Ride } from '@src/ride/interfaces/ride.interface';
import axios from 'axios';

@Injectable()
export class AddressService {
  private readonly googleApiKey = process.env.GOOGLE_API_KEY;
  private readonly googleApiUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';

  constructor(
    @InjectModel('Address') private addressModel: Model<Address>,
    @InjectModel('Ride') private rideModel: Model<Ride>,
  ) {}

  async create(
    createAddressDto: CreateAddressDto,
    userId: string,
  ): Promise<Address> {
    if (!this.googleApiKey) {
      throw new InternalServerErrorException(
        'A chave da API do Google não está configurada.',
      );
    }
    
    const distance = await this.calculateDistance(createAddressDto);
    const newAddress = { ...createAddressDto, user: userId, distance: distance };
    const address = new this.addressModel(newAddress);

    return await address.save();
  }

  async calculateDistance(addressDto: CreateAddressDto): Promise<number> {
    const origin = `${addressDto.rua}, ${addressDto.numero}, ${addressDto.bairro}, ${addressDto.cidade}, ${addressDto.estado}`
    const destination = 'Rua Aprígio Veloso, 882, Universitário, Campina Grande, PB'
    
    const response = await axios.get(this.googleApiUrl, {
      params: {
        origins: origin,
        destinations: destination,
        key: this.googleApiKey,
      },
    });

    const rows = response.data.rows[0];
    if (!rows.elements || rows.elements[0].status != 'OK') {
      throw new InternalServerErrorException('Erro ao calcular a distância.');
    }

    return rows.elements[0].distance.value / 1000;
  }

  async getDistance(id: string) {
    const address = await this.findOne(id);
    return address.distance;
  }

  async findAll(): Promise<Address[]> {
    return await this.addressModel.find().exec();
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressModel.findById(id).exec();
    if (!address) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
    }
    return address;
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const updatedAddress = await this.addressModel
      .findByIdAndUpdate(id, updateAddressDto, { new: true })
      .exec();
    if (!updatedAddress) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
    }
    return updatedAddress;
  }

  async remove(id: string): Promise<Address> {
    const exists = await this.rideModel.findOne({ car: id, isOver: false });
    if (exists)
      throw new BadRequestException(
        'O endereço está sendo utilizado em uma carona e não pode ser removido.',
      );
    const result = await this.addressModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
    }
    return result;
  }

  async removeAll(): Promise<void> {
    await this.addressModel.deleteMany().exec();
  }

  async getUserAddresses(userId: string): Promise<Address[]> {
    const userAddress = await this.addressModel.find({ user: userId }).exec();
    return userAddress;
  }
}
