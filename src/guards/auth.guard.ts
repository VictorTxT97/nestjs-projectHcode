import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard as BaseAuthGuard } from "@nestjs/passport";

@Injectable()
export class AuthGuard extends BaseAuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
        console.error('Erro no AuthGuard:', err || 'Usuário não autenticado');
        throw new UnauthorizedException('Unauthorized access: Invalid token or user not found');
    }

    console.log('Usuário autenticado no AuthGuard:', user);

    const request = context.switchToHttp().getRequest();
    request.user = user; // Adiciona o user ao request para ser acessado pelo decorador

    return user;
}


}
