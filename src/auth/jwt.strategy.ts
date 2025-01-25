import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // Respeita a validade do token
            secretOrKey: 'M7LjCDQwUD67QPiw62yN9RVt', // Chave secreta do JwtModule
        });
    }

    async validate(payload: any) {
        // Retorna o payload do token como o usuário autenticado
        return { userId: payload.sub, email: payload.email, name: payload.name, role: payload.role,};
    }
}
