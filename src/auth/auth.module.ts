import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../user/schemas/user.schema';
import { JwtAuthGuard } from './jwt-auth.guard';
import { jwtConstants } from './constants';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { BlacklistedTokenSchema } from './schemas/token.schema';
import { MailjetModule } from 'nest-mailjet';

@Module({
  imports: [
    MailjetModule.registerAsync({
      useFactory: () => ({
        apiKey: process.env.MAILJET_API_KEY,
        apiSecret: process.env.MAILJET_API_SECRET,
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: 'BlacklistedToken', schema: BlacklistedTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    UserService,
    LocalStrategy,
  ],
  exports: [AuthService, JwtAuthGuard, UserService],
})
export class AuthModule {}
