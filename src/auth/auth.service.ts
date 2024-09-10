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

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(UserSchema.name) private readonly userModel: Model<User>,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { name: user.name, sub: user._id, role: Role.User };
    }
    throw new UnauthorizedException('Invalid credentials 1');
  }

  async loginUser(email: string, password: string): Promise<string> {
    const validated = await this.validateUser(email, password);
    return this.jwtService.sign(validated);
  }

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create({ ...createUserDto });
  }

}
