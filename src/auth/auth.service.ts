import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Role } from '../enums/enum';
import { UserResponseDto } from '../user/dto/response-user.dto';
import { BlacklistedToken } from './schemas/token.schema';
import { MailjetService } from 'nest-mailjet';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('BlacklistedToken')
    private readonly blacklistedTokenModel: Model<BlacklistedToken>,
    private readonly userService: UserService,
    private readonly mailjetService: MailjetService,
  ) {}

  async blacklistToken(token: string, expiresAt: Date): Promise<void> {
    const blacklistedToken = new this.blacklistedTokenModel({
      token,
      expiresAt,
    });
    await blacklistedToken.save();
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const tokenInBlacklist = await this.blacklistedTokenModel
      .findOne({ token })
      .exec();
    return !!tokenInBlacklist;
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<{ token: string; userResponse: UserResponseDto }> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = this.jwtService.sign({
        name: user.name,
        sub: user.id,
        role: Role.User,
      });
      const userResponse = user.toDTO();

      return { token, userResponse };
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  async logout(token: string): Promise<void> {
    const decoded = this.jwtService.decode(token) as any; // Decodifica o token
    const expiresAt = new Date(decoded.exp * 1000); // Converte a data de expiração do token

    // Adiciona o token à blacklist
    const blacklistedToken = new this.blacklistedTokenModel({
      token,
      expiresAt,
    });
    await blacklistedToken.save();
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendVerificationEmail(
    email: string,
    code: string,
  ): Promise<string> {
    const repl = await this.mailjetService.send({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL,
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: '[BIGU] Código de verificação',
          TextPart: `Seu código de verificação é: ${code}`,
        },
      ],
    })

    return repl.body.Messages[0].Status;
  }

  async registerUser(
    createUserDto: CreateUserDto,
  ): Promise<{ token: string; userResponse: UserResponseDto }> {
    const verificationCode = this.generateVerificationCode();
    const user = await this.userService.create(
      { ...createUserDto },
      verificationCode,
    );
    await this.sendVerificationEmail(createUserDto.email, verificationCode);

    const token = this.jwtService.sign({
      name: user.name,
      sub: user.id,
      role: Role.User,
    });

    const userResponse = user.toDTO();

    return { token, userResponse };
  }

  async confirmRegistration(userId: string, code: string): Promise<string> {
    const user = await this.userService.findOne(userId); // Método para encontrar o usuário pelo ID
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    if (user.verificationCode !== code) {
      throw new UnauthorizedException('Código de verificação inválido.');
    } else {
      (await this.userService.update(userId, { isVerified: true })).save();
      return 'Conta confirmada!';
    }
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
