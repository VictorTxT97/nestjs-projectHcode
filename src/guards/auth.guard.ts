import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard as BaseAuthGuard } from "@nestjs/passport";

@Injectable()
export class AuthGuard extends BaseAuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('Unauthorized access: Invalid token or user not found');
    }

    console.log('Usuário autenticado no AuthGuard:', user); // Log para depuração

    const request = context.switchToHttp().getRequest();
    request.user = user; // Certifique-se de que o objeto user contém role

    return user;
  }
}
