import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY,
        });
    }

    /**
     * Busca o usuário no banco pelo ID do payload JWT e retorna um UserEntity completo.
     */
    async validate(payload: any): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({ where: { id: payload.sub } });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return user;
    }
}


