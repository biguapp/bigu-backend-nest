import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from '../user/interfaces/user.interface';
import { User as UserSchema } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Role } from '../enums/enum';
import { UserResponseDto } from '@src/user/dto/response-user.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(UserSchema.name) private readonly userModel: Model<User>,
    private readonly userService: UserService,
  ) {}
  
  async loginUser(email: string, password: string): Promise<{ token: string; userResponse: UserResponseDto }> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const userResponse: UserResponseDto = {
        name: user.name,
        sex: user.sex,
        email: user.email,
        phoneNumber: user.phoneNumber,
        matricula: user.matricula,
        userId: user._id
      }
      const token = this.jwtService.sign({ name: user.name, sub: user._id, role: Role.User })
      return {token, userResponse};
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  async registerUser(createUserDto: CreateUserDto): Promise<{ token: string; userResponse: UserResponseDto }> {
    
    const user = await this.userService.create({ ...createUserDto });
    
    const userResponse: UserResponseDto = {
      name: user.name,
      sex: user.sex,
      email: user.email,
      phoneNumber: user.phoneNumber,
      matricula: user.matricula,
      userId: user._id
    }

    const token = this.jwtService.sign({ name: user.name, sub: user._id, role: Role.User })
    
    return {token, userResponse}
  }

}
