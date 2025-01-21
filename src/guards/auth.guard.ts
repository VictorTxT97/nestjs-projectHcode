import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> { // Alterado para async
        const { authorization } = context.switchToHttp().getRequest().headers;

        console.log(authorization);

        // Valida o token de forma assíncrona
        const isTokenValid = await this.authService.isValidToken(authorization);

        return isTokenValid; // Retorna o resultado da validação
    }
}
