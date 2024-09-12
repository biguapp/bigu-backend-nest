import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './interfaces/car.interface';
import { Car as CarSchema} from './schemas/car.schema';

@Injectable()
export class CarService {
    constructor(@InjectModel('Car') private carModel: Model<CarSchema>) {}

    async create(createCarDto: CreateCarDto, userId: string): Promise<Car> {
        const newCar = {...createCarDto, user: userId}
        const car = new this.carModel(newCar);
        
        return car.save();
    }

    async findAll(): Promise<Car[]> {
        return await this.carModel.find().exec();
    }

    async findOne(id: string): Promise<Car> {
        const car = await this.carModel.findById(id).exec();
        if (!car) {
            throw new NotFoundException(`Carro com ID ${id} não encontrado`);
        }
        return car;
    }

    async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
        const updatedCar = await this.carModel.findByIdAndUpdate(id, updateCarDto, { new: true }).exec();
        if (!updatedCar) {
            throw new NotFoundException(`Carro com ID ${id} não encontrado`);
        }
        return updatedCar;
    }

    async remove(id: string): Promise<Car> {
        const result = await this.carModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Carro com ID ${id} não encontrado`);
        }
        return result
    }

    async removeAll(): Promise<void> {
        const result = await this.carModel.deleteMany();
    }

    async getUserCars(userId: string): Promise<Car[]> {
        const cars = await this.carModel.find({user: userId}).exec()
        return cars;
    }
}
