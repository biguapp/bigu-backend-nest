import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(login: string, password: string): Promise<any> {
    let user;
    if (login.includes("@")){
      user = await this.authService.validateAdmin(login, password);
    } else {
      user = await this.authService.validatePatient(login, password);
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
