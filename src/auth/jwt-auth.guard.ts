import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service'; // Serviço que valida o JWT

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (token && (await this.authService.isTokenBlacklisted(token))) {
      throw new UnauthorizedException('Token expirado.');
    }

    if (!token) {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    request.user = user;
    return true;
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}