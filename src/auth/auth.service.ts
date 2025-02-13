import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { InjectRepository } from "@nestjs/typeorm";
import { MailerService } from "@nestjs-modules/mailer";

import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/entity/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly mailer: MailerService,

        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) {}

    /**
     * Gera um token JWT para o usuário autenticado
     */
    async generateToken(user: UserEntity): Promise<string> { // ✅ Agora garantimos que retorna uma string
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    
        return this.jwtService.sign(payload, { // ✅ Retornando explicitamente
            issuer: 'login',
            audience: 'users',
            expiresIn: '7d',
        });
    }
    

    /**
     * Verifica se um token JWT é válido e retorna os dados do usuário.
     */
    checkToken(token: string) {
        try {
            const data = this.jwtService.verify(token, {
                issuer: 'login',
                audience: 'users',
            });

            return data;
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    /**
     * Retorna um booleano indicando se um token JWT é válido.
     */
    isValidToken(token: string) {
        try {
            this.checkToken(token);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Realiza login do usuário e retorna um token JWT
     */
    async login(email: string, password: string): Promise<{ access_token: string }> {
        const user = await this.usersRepository.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        return { access_token: this.jwtService.sign(payload) };
    }

    /**
     * Registra um novo usuário
     */
    async register(body: AuthRegisterDTO): Promise<UserEntity> {
        const userExists = await this.usersRepository.findOne({ where: { email: body.email } });
    
        console.log("🚀 Valor retornado por findOne no register:", userExists); // 🔥 Adicionado para depuração
    
        if (userExists) {
            throw new BadRequestException('E-mail já cadastrado');
        }
    
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = this.usersRepository.create({ ...body, password: hashedPassword });
    
        return await this.usersRepository.save(newUser);
    }
    

    /**
     * Envia um e-mail para redefinição de senha
     */
    async forget(email: string): Promise<{ message: string }> {
        const user = await this.usersRepository.findOne({ where: { email } });

        if (!user) {
            throw new NotFoundException('E-mail não encontrado');
        }

        // Gera um token de redefinição que vale por 1 hora
        const resetToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '1h' });
        

        await this.mailer.sendMail({
            to: email,
            subject: 'Recuperação de Senha',
            template: './forget',
            context: {
                token: resetToken,
                userName: user.name,
            },
        });

        return { message: 'E-mail de recuperação enviado!' };
    }

    /**
     * Reseta a senha do usuário utilizando um token JWT
     */
    async reset(password: string, token: string) {
        try {
            const payload = this.jwtService.verify(token, { issuer: 'login' });
            const id = parseInt(payload.sub, 10);

            const user = await this.usersRepository.findOne({ where: { id } });

            if (!user) {
                throw new BadRequestException('Usuário não encontrado.');
            }

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            await this.usersRepository.update(id, { password: hashedPassword });

            return {
                message: 'Senha atualizada com sucesso!',
                token: this.generateToken(user),
            };
        } catch (e) {
            if (e instanceof Error) {
                throw new BadRequestException(e.message || 'Token inválido ou expirado.');
            } else {
                throw new BadRequestException('Erro inesperado');
            }
        }
    }
}
