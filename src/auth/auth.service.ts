import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt'
import { MailerService } from "@nestjs-modules/mailer";
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailer: MailerService
  ) {}

  async generateToken(user: any) {
    const payload = {
        sub: user.id,        // ID do usuário
        email: user.email,   // Email do usuário
        name: user.name,     // Nome do usuário
        role: user.role,     // Inclui role no payload
    };

    console.log('Payload do token JWT:', payload); // Log para depuração

    return this.jwtService.sign(payload, {
        issuer: 'login',
        audience: 'users',
        expiresIn: '7d',
    });
}



  checkToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        issuer: 'login', // Deve coincidir com o valor usado na geração
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.users.findFirst({
        where: { email },
        select: {                  // Inclui os campos necessários
            id: true,
            email: true,
            name: true,
            role: true,           // Inclui role no retorno
            password: true,       // Inclui password no retorno
        },
    });

    console.log('Usuário retornado pelo banco:', user); // Log para depuração

    if (!user) {
        throw new UnauthorizedException("Senha ou Email inválidos!");}
      if (!await bcrypt.compare(password, user.password)) {
        throw new UnauthorizedException("Senha ou Email inválidos!");
      }
    return this.generateToken(user); // Gera o token com o campo role incluído
  }
    



  async forget(email: string) {
    const user = await this.prisma.users.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Email incorreto");
    }
    const token = this.jwtService.sign(
      { id: user.id },
      {
        expiresIn: '7 days',
        subject: String(user.id),
        issuer: 'login', // Valor inline
        audience: 'users', // Valor inline
      }
    );
    
    await this.mailer.sendMail({
      subject: 'Reset your password',
      to: 'victor@nestjs.com',
      template: 'forget',
      context:{
        name: user.name,
        token
      }
    });
    return true;
  }

  async reset(password: string, token: string) {
    try {
      // Verificar e decodificar o token
      const payload = this.jwtService.verify(token, {
        issuer: 'login', // Garantir que o issuer seja 'login'
      });
  
      const id = parseInt(payload.sub, 10);
  
      // Verificar se o usuário existe
      const user = await this.prisma.users.findUnique({
        where: { id },
      });
  
      if (!user) {
        throw new BadRequestException('Usuário não encontrado.');
      }
  
      // Atualizar a senha e a data de modificação no banco de dados
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: {
          password,
          passwordModified: new Date(), // Atualiza o campo com a data/hora atual
        },
      });
  
      // Retornar mensagem de sucesso e um novo token
      return {
        message: 'Senha atualizada com sucesso!',
        token: this.generateToken(updatedUser),
      };
    } catch (e) {
      // Retornar erro se o token for inválido ou expirado
      throw new BadRequestException(e.message || 'Token inválido ou expirado.');
    }
  }
  
  
  

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.generateToken(user);
  }
}
