import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/enum';
import { ROLES_KEY } from './roles.decorator';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { constants } from 'buffer';
import { jwtConstants } from '../auth/constants';
import { UserService } from '../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { authorization } = context.switchToHttp().getRequest().headers;

    if (!authorization) {
      return false;
    }

    const token = authorization.startsWith('Bearer ')
      ? authorization.slice(7, authorization.length)
      : authorization;

    let loginPayload;
    try {
      loginPayload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
    } catch (error) {
      return false;
    }

    if (!loginPayload) {
      return false;
    }

    return requiredRoles.includes(loginPayload.role);
  }
}
