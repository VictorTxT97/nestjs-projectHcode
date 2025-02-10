import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { InjectRepository } from "@nestjs/typeorm";
import { MailerService } from "@nestjs-modules/mailer";

import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthForgetDto } from "./dto/auth-forget.dto";
import { UserEntity } from "src/user/entity/user.entity";
import { UserService } from "src/user/user.service";

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
    async generateToken(user: UserEntity) {
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };

        return this.jwtService.sign(payload, {
            issuer: 'login',
            audience: 'users',
            expiresIn: '7d',
        });
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
      // Aponta para o arquivo Pug (sem .pug) na pasta "src/templates"
      template: './forget',
      // As variáveis que o template usará
      context: {
        token: resetToken,
        userName: user.name, 
        // qualquer outro campo que queira exibir no template
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
