import { Controller, Post, Body, UseGuards,  } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDto } from './dto/auth-forget.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthResetDto } from './dto/auth-reset.dto';
import { Headers } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')

export class AuthController {
    
    constructor(private readonly userService: UserService,
        private readonly authService: AuthService,
        
        
    ) {}
    @Post('login')
    async login(@Body() body: AuthLoginDto) {
        return this.authService.login(body.email, body.password);
    }
    @Post('register')
    async register(@Body() body: AuthRegisterDTO) {
        return this.authService.register(body);
        
    }

    @Post('forget')
    async forgot(@Body() body: AuthForgetDto) {
        return this.authService.forget(body.email, body.password);
    }
    @Post('reset')
    async reset(@Body() body: AuthResetDto) {
        return this.authService.reset(body.password, body.token);
    }
    @UseGuards(AuthGuard)
    @Post('me')
    async me(@Headers('authorization') authHeader: string) {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Token must be provided');
      }
  
      const token = authHeader.split(' ')[1]; // Extrai o token do cabeçalho Authorization
      return this.authService.checkToken(token); // Verifica o token e retorna o resultado
    }
  }


