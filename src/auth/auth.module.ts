import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // Importa o PassportModule
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy'; // Importa a estratégia JWT
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [
        PassportModule, // Necessário para utilizar estratégias Passport
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY, // Chave secreta usada para assinar os tokens
            signOptions: { expiresIn: '7d' }, // Validade do token
        }),
        forwardRef(() => UserModule),
        PrismaModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService, // Serviço de autenticação
        JwtStrategy, // Estratégia JWT para validação de tokens
    ],
    exports: [AuthService], // Exporta AuthService para outros módulos
})
export class AuthModule {}
