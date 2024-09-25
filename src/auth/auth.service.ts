import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    userResponse: UserResponseDto;
  }> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = this.generateAccessToken(user.id, Role.User);

      const refreshToken = this.generateRefreshToken(user.id);
      const userResponse = user.toDTO();

      return { accessToken, refreshToken, userResponse };
    }
    throw new UnauthorizedException('Credenciais inválidas.');
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      // Valida se o refresh token não está na blacklist
      const isBlacklisted = await this.isTokenBlacklisted(refreshToken);
      if (isBlacklisted) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      // Cria um novo Access Token
      const newAccessToken = this.jwtService.sign(
        { name: payload.name, sub: payload.sub, role: payload.role },
        { expiresIn: '15m' }, // Access Token válido por 15 minutos
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
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
    });

    return repl.body.Messages[0].Status;
  }

  private generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId },
      { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET },
    );
  }

  // Gera um access token com duração mais curta
  private generateAccessToken(userId: string, role: string): string {
    return this.jwtService.sign(
      { sub: userId, role },
      { expiresIn: '15m', secret: process.env.JWT_ACCESS_SECRET },
    );
  }

  async registerUser(createUserDto: CreateUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
    userResponse: UserResponseDto;
  }> {
    const verificationCode = this.generateVerificationCode();
    const user = await this.userService.create(
      { ...createUserDto },
      verificationCode,
    );
    await this.sendVerificationEmail(createUserDto.email, verificationCode);

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    const userResponse = user.toDTO();

    return { accessToken, refreshToken, userResponse };
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

  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const resetCode = this.generateVerificationCode();
    
    // Armazena o código no usuário
    await this.userService.update(user.id, { verificationCode: resetCode });

    // Envia o código por email
    await this.mailjetService.send({
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
          Subject: '[BIGU] Código de recuperação de senha',
          TextPart: `Seu código de recuperação é: ${resetCode}`,
        },
      ],
    });

    return 'Código de recuperação enviado para o email';
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user || user.verificationCode !== code) {
      throw new UnauthorizedException('Código de verificação inválido.');
    }

    // Atualiza a senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.update(user.id, {
      password: hashedPassword,
      verificationCode: null, // Remove o código após o uso
    });

    return 'Senha alterada com sucesso!';
  }

  
}
