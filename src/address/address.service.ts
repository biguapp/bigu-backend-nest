import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './interfaces/address.interface';
import { Ride } from '@src/ride/interfaces/ride.interface';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel('Address') private addressModel: Model<Address>,
    @InjectModel('Ride') private rideModel: Model<Ride>,
  ) {}

  async create(
    createAddressDto: CreateAddressDto,
    userId: string,
  ): Promise<Address> {
    const newAddress = { ...createAddressDto, user: userId };
    const address = new this.addressModel(newAddress);

    return await address.save();
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
    const exists = await this.rideModel.findOne({ vehicle: id, isOver: false });
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
