import { Controller, Post, Body, ValidationPipe,  } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDto } from './dto/auth-forget.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthResetDto } from './dto/auth-reset.dto';
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

}
