import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    
  ) {}

  async create({ email, name, password, birthAt }: CreateUserDTO) {
    // Validação simples para garantir que birthAt é uma string válida
    if (!birthAt || isNaN(new Date(birthAt).getTime())) {
      throw new Error('Invalid birthAt value. Ensure it is in ISO 8601 format.');
    }
  
    return this.prisma.users.create({
      data: {
        name,
        email,
        password,
        birthAt: new Date(birthAt) // Garante que o valor seja convertido para Date
      }
    });
  }
  
  

  async list() {
    return this.prisma.users.findMany();
  }

  async show(id: number) {
    await this.exists(id);
    return this.prisma.users.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async update(id: number, data: CreateUserDTO) {
    return this.prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        birthAt: data.birthAt ? new Date(data.birthAt) : undefined,
        role: data.role, // Adicionado o campo role
      },
    });
  }


  async updatePartial(id: number, { email, name, password, birthAt, role }: UpdatePatchUserDTO) {
    return this.prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(email && { email }),
        ...(name && { name }),
        ...(password && { password }),
        ...(birthAt && { birthAt: new Date(birthAt) }),
        ...(role && { role }), // Adicionado o campo role
      },
    });
  }

  async delete(id: number) {
    return this.prisma.users.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async exists(id: number) {
    if (
      !(await this.prisma.users.count({
        where: { id },
      }))
    ) {
      throw new NotFoundException(`O Usuario ${id} nao existe`);
    }
  }
}
  
