import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { Prisma, Role } from "@prisma/client";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create({ email, name, password, birthAt, role }: CreateUserDTO) {
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    
    if (!birthAt || isNaN(new Date(birthAt).getTime())) {
        throw new Error('Invalid birthAt value. Ensure it is in ISO 8601 format.');
    }

    const mappedRole = this.mapRole(role);

    return this.prisma.users.create({
        data: {
            name,
            email,
            password,
            birthAt: new Date(birthAt),
            role: mappedRole,
            issuer: 'login', // Define o valor padrão para o campo issuer
        },
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
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const mappedRole = this.mapRole(data.role);

    return this.prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        birthAt: data.birthAt ? new Date(data.birthAt) : undefined,
        role: mappedRole,
      },
    });
  }

  async updatePartial(id: number, { email, name, password, birthAt, role }: UpdatePatchUserDTO) {
    const mappedRole = role ? this.mapRole(role) : undefined;
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    return this.prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(email && { email }),
        ...(name && { name }),
        ...(password && { password }),
        ...(birthAt && { birthAt: new Date(birthAt) }),
        ...(role && { role: mappedRole }),
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

  private mapRole(role: number | Role): Role {
    if (typeof role === 'number') {
      return role === 2 ? Role.ADMIN : Role.USER;
    }
    return role;
  }
}
