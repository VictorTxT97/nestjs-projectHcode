import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<number[]>('roles', context.getHandler());

    if (!requiredRoles) {
      return true; // Se nenhuma role foi exigida, permite o acesso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('Usuário no RolesGuard:', user); // Log para depuração
    console.log('Roles exigidas:', requiredRoles);

    if (!user || !user.role) {
      throw new ForbiddenException('Acesso negado. Role do usuário não encontrada.');
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException('Acesso negado. Role insuficiente.');
    }

    return hasRole;
  }
}
