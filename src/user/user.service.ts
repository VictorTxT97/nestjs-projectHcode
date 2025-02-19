import { Injectable, NotFoundException } from "@nestjs/common"; // Importa os decorators e exceções do NestJS
import { InjectRepository } from "@nestjs/typeorm"; // Importa a função para injetar repositórios do TypeORM
import { Repository } from "typeorm"; // Importa a classe Repository do TypeORM para interagir com o banco
import * as bcrypt from 'bcrypt'; // Importa o bcrypt para criptografar senhas
import { CreateUserDTO } from "./dto/create-user.dto"; // Importa o DTO para criação de usuário
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto'; // Importa o DTO para atualização parcial de usuário
 // Importa o enum de roles (admin/user)
import { UserEntity } from "./entity/user.entity"; // Importa a entidade de usuário
import { Role } from "../enums/role.enums";

@Injectable() // Indica que esta classe pode ser injetada em outros serviços do NestJS
export class UserService {
  findOne: jest.Mock<any, any, any>;
  constructor(
    @InjectRepository(UserEntity) // Injeta o repositório do TypeORM para a entidade UserEntity
    private usersRepository: Repository<UserEntity>, // Define a propriedade que interage com o banco
  ) {}

  // ✅ Criar usuário (corrigido para TypeORM)
  async create({ email, name, password, birthAt, role }: CreateUserDTO) {
    const salt = await bcrypt.genSalt(); // Gera um salt para a senha
    const hashedPassword = await bcrypt.hash(password, salt); // Criptografa a senha usando o salt

    if (!birthAt || isNaN(new Date(birthAt).getTime())) { // Verifica se a data de nascimento é válida
      throw new Error('Invalid birthAt value. Ensure it is in ISO 8601 format.');
    }

    const mappedRole = this.mapRole(role ?? Role.USER); // ✅ Garante um valor padrão se `role` for undefined
 

    // Cria um novo usuário com os dados fornecidos
    const newUser = this.usersRepository.create({
      email,
      name,
      password: hashedPassword, // Armazena a senha criptografada
      birthAt: new Date(birthAt), // Converte a string para um objeto Date
      role: mappedRole, // Define o role corretamente
    });

    return await this.usersRepository.save(newUser); // Salva o usuário no banco e retorna
  }

  // ✅ Listar todos os usuários
  async list() {
    return this.usersRepository.find(); // Retorna todos os usuários cadastrados no banco
  }

  // ✅ Buscar um usuário pelo ID
  async show(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } }); // Busca um usuário pelo ID
    if (!user) { // Se o usuário não for encontrado, lança uma exceção
      throw new NotFoundException(`O usuário ${id} não existe`);
    }
    return user; // Retorna o usuário encontrado
  }

  // ✅ Atualizar usuário (PUT) - Atualiza todos os campos
  async update(id: number, data: CreateUserDTO) {
    const user = await this.show(id); // Verifica se o usuário existe antes de atualizar

    const salt = await bcrypt.genSalt(); // Gera um novo salt para a senha
    const hashedPassword = await bcrypt.hash(data.password, salt); // Criptografa a nova senha
    const mappedRole = this.mapRole(data.role ?? Role.USER); // ✅ Garante um valor padrão se `data.role` for undefined


    // Atualiza os dados do usuário com os novos valores
    Object.assign(user, {
      name: data.name,
      email: data.email,
      password: hashedPassword, // Substitui a senha antiga pela nova criptografada
      birthAt: data.birthAt ? new Date(data.birthAt) : user.birthAt, // Atualiza a data de nascimento se fornecida
      role: mappedRole, // Define o novo role
    });

    return await this.usersRepository.save(user); // Salva as alterações no banco e retorna o usuário atualizado
  }

  // ✅ Atualização parcial (PATCH) - Apenas os campos enviados são atualizados
  async updatePartial(id: number, { email, name, password, birthAt, role }: UpdatePatchUserDTO) {
    const user = await this.show(id); // Busca o usuário pelo ID antes de atualizar

    const salt = await bcrypt.genSalt(); // Gera um novo salt
    const hashedPassword = password ? await bcrypt.hash(password, salt) : user.password; // Se a senha foi fornecida, criptografa, senão mantém a antiga
    const mappedRole = role ? this.mapRole(role) : user.role; // Se o role foi fornecido, converte, senão mantém o antigo

    // Atualiza apenas os campos enviados no request
    Object.assign(user, {
      ...(email && { email }), // Se `email` foi fornecido, atualiza
      ...(name && { name }), // Se `name` foi fornecido, atualiza
      ...(password && { password: hashedPassword }), // Se `password` foi fornecido, atualiza com a senha criptografada
      ...(birthAt && { birthAt: new Date(birthAt) }), // Se `birthAt` foi fornecido, atualiza como Date
      ...(role && { role: mappedRole }), // Se `role` foi fornecido, atualiza
    });

    return await this.usersRepository.save(user); // Salva as mudanças no banco e retorna o usuário atualizado
  }

  // ✅ Deletar usuário
  async delete(id: number) {
    const user = await this.show(id); // Verifica se o usuário existe antes de deletar
    return await this.usersRepository.remove(user); // Remove o usuário do banco e retorna
    
  }

  // ✅ Verifica se um usuário existe no banco
  async exists(id: number) {
    const count = await this.usersRepository.count({ where: { id } }); // Conta quantos usuários existem com esse ID
    if (count === 0) { // Se o usuário não existir, lança uma exceção
      throw new NotFoundException(`O usuário ${id} não existe`);
    }
  }

  // ✅ Mapeamento de Role (Administrador ou Usuário)
  private mapRole(role: number | Role): Role {
    if (typeof role === 'number') { // Se o role for um número
      return role === 2 ? Role.ADMIN : Role.USER; // Se for `2`, retorna `ADMIN`, senão `USER`
    }
    return role; // Se já for um Role válido, retorna como está
  }
}
