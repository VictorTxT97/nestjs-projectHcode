import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async generateToken(user: any) {
    const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role, // Inclui role no payload
    };

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
      where: { email, password },
    });

    if (!user) {
      throw new UnauthorizedException("Senha ou Email inválidos!");
    }

    return this.generateToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.users.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Email incorreto");
    }

    // TODO: enviar o email com instruções para redefinição de senha...
    return true;
  }

  async reset(password: string, token: string) {
    const payload = this.jwtService.verify(token, {
      issuer: 'login',
    });

    const id = parseInt(payload.sub, 10);

    const user = await this.prisma.users.update({
      where: { id },
      data: { password },
    });

    return this.generateToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.generateToken(user);
  }
}
