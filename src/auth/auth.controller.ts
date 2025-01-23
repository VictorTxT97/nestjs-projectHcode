import { Controller, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDto } from './dto/auth-forget.dto';
import { AuthResetDto } from './dto/auth-reset.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/guards/auth.guard'; // Importa o guard configurado
import { User } from '../decorators/user.decorator'; // Importa o decorador personalizado

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService, // Serviço de usuários
        private readonly authService: AuthService, // Serviço de autenticação
    ) {}

    // Endpoint para login
    @Post('login')
    async login(@Body() body: AuthLoginDto) {
        return this.authService.login(body.email, body.password);
    }

    // Endpoint para registro
    @Post('register')
    async register(@Body() body: AuthRegisterDTO) {
        return this.authService.register(body);
    }

    // Endpoint para recuperar senha
    @Post('forget')
    async forgot(@Body() body: AuthForgetDto) {
        return this.authService.forget(body.email);
    }

    // Endpoint para redefinir senha
    @Post('reset')
    async reset(@Body() body: AuthResetDto) {
        return this.authService.reset(body.password, body.token);
    }

    // Endpoint protegido para retornar o usuário autenticado ou uma propriedade específica
    @UseGuards(AuthGuard) // Protege a rota com o guard JWT
    @Post('me')
    async me(@User() user, @Query('field') field?: string) {
        if (field) {
            if (user[field]) {
                return { [field]: user[field] }; // Retorna apenas a propriedade solicitada
            } else {
                return { error: `Property '${field}' not found on user` }; // Propriedade inválida
            }
        }

        return { user }; // Retorna o usuário completo se nenhum campo for solicitado
    }
}
