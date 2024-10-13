import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/enum';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(
    createUserDto: CreateUserDto,
    verificationCode: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const [hasEmail, hasMatricula] = await Promise.all([
      this.verifyEmail(createUserDto.email),
      this.verifyMatricula(createUserDto.matricula),
    ]);

    if (hasEmail) throw new BadRequestException('O email já está em uso.');
    if (hasMatricula)
      throw new BadRequestException('A matrícula já está em uso.');

    try {
      const user = await this.userModel.create({
        ...createUserDto,
        role: 'user',
        password: hashedPassword,
        verificationCode: verificationCode,
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();

    return users;
  }

  async findDrivers(): Promise<User[]> {
    const drivers = await this.userModel.find({ role: Role.Driver });
    if (!drivers || drivers.length === 0) {
      throw new NotFoundException(
        'Nenhum usuário com a role Driver encontrado',
      );
    }
    return drivers;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user || user.email !== email ) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async verifyEmail(email: string): Promise<Boolean> {
    try {
      const user = await this.findByEmail(email);
      if (user.email === email) return true;
      return false;
    } catch (NotFoundException) {
      return false;
    }
  }

  async verifyMatricula(matricula: string): Promise<Boolean> {
    try {
      const user = await this.findByMatricula(matricula);
      if (user.matricula === matricula) return true;
      return false;
    } catch (NotFoundException) {
      return false;
    }
  }

  verifyMinSizePassword(password: string): Boolean {
    if (password.length >= 6) return true;
    return false;
  }

  async findByMatricula(matricula: string): Promise<User> {
    const user = await this.userModel.findOne({ matricula });
    if (!user) {
      throw new NotFoundException('Matrícula não existente.');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async updateScore(userId: string, newRating: number): Promise<void> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const totalRating = user.avgScore * user.ratingCount;
    const newRatingCount = user.ratingCount + 1;
    const newAvgScore = (totalRating + newRating) / newRatingCount;

    const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
      $set: {
        avgScore: newAvgScore,
        ratingCount: newRatingCount,
      }
    })

    if (!updatedUser) {
      throw new InternalServerErrorException('Erro ao atualizar a pontuação do usuário.');
    }
  }

  async remove(id: string): Promise<User> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Usuario não encontrado');
    }
    return result;
  }

  async updateProfilePic(userId: string, imageBuffer: Buffer): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return await this.update(userId, { profileImage: imageBuffer });
  }
}
