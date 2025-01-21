import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { users } from "@prisma/client";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
constructor(private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService
) {}

async generateToken(user: any) {
    const payload = {
      sub: user.id, // Identificador do usuário
      email: user.email,
      name: user.name,
    };
  
    return this.jwtService.sign(payload, {
      issuer: 'login', // Defina 'issuer' como 'login'
      audience: 'users', // Público-alvo (opcional)
      expiresIn: '7d', // Validade do token
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
    try{
        this.checkToken(token);
        return true;
    }catch(e){
        return false;
    }
  }

async login(email: string, password: string) {
    const users = await this.prisma.users.findFirst({
        where: { email, password },
    });
    if (!users) {
        throw new UnauthorizedException("Senha ou Email invalidos!");
    }
    return this.generateToken(users);
}

async forget(email: string, password: string) {
    const users = await this.prisma.users.findFirst({
        where: { email},
    });
    if (!users) {
        throw new UnauthorizedException("Email incorreto");
    }
    //to do: enviar o email...
    return true;
}
async reset(password: string, token: string) {
    // TODO: Validar o token e recuperar o ID do usuário
    const payload = this.jwtService.verify(token, {
      secret: 'M7LjCDQwUD67QPiw62yN9RVt', // Certifique-se de usar a mesma chave secreta do `generateToken`
    });
  
    const id = parseInt(payload.sub, 10); // Recupera o ID do usuário a partir do token
  
    // Atualiza a senha do usuário
    const user = await this.prisma.users.update({
      where: { id },
      data: { password },
    });
  
    // Gera um novo token para o usuário
    return this.generateToken(user);
  }
  

  async register(data:AuthRegisterDTO) {
    const users = await  this.userService.create(data);
    return this.generateToken(users);
  }
}