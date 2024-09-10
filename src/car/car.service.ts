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

    // Criação de um carro
    async create(createCarDto: CreateCarDto): Promise<Car> {
        const newCar = new this.carModel(createCarDto);
        return await newCar.save();
    }

    // Listar todos os carros
    async findAll(): Promise<Car[]> {
        return await this.carModel.find().exec();
    }

    // Buscar um carro por ID
    async findOne(id: string): Promise<Car> {
        const car = await this.carModel.findById(id).exec();
        if (!car) {
            throw new NotFoundException(`Carro com ID ${id} não encontrado`);
        }
        return car;
    }

    // Atualizar um carro por ID
    async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
        const updatedCar = await this.carModel.findByIdAndUpdate(id, updateCarDto, { new: true }).exec();
        if (!updatedCar) {
            throw new NotFoundException(`Carro com ID ${id} não encontrado`);
        }
        return updatedCar;
    }

    // Remover um carro por ID
    async remove(id: string): Promise<void> {
        const result = await this.carModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Carro com ID ${id} não encontrado`);
        }
    }

    async removeAll(): Promise<void> {
        const result = await this.carModel.deleteMany();
    }
}
