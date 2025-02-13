"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common"); // Importa os decorators e exceções do NestJS
const typeorm_1 = require("@nestjs/typeorm"); // Importa a função para injetar repositórios do TypeORM
const typeorm_2 = require("typeorm"); // Importa a classe Repository do TypeORM para interagir com o banco
const bcrypt = __importStar(require("bcrypt")); // Importa o bcrypt para criptografar senhas
// Importa o enum de roles (admin/user)
const user_entity_1 = require("./entity/user.entity"); // Importa a entidade de usuário
const role_enums_1 = require("../enums/role.enums");
let UserService = class UserService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    // ✅ Criar usuário (corrigido para TypeORM)
    async create({ email, name, password, birthAt, role }) {
        const salt = await bcrypt.genSalt(); // Gera um salt para a senha
        const hashedPassword = await bcrypt.hash(password, salt); // Criptografa a senha usando o salt
        if (!birthAt || isNaN(new Date(birthAt).getTime())) { // Verifica se a data de nascimento é válida
            throw new Error('Invalid birthAt value. Ensure it is in ISO 8601 format.');
        }
        const mappedRole = this.mapRole(role ?? role_enums_1.Role.USER); // ✅ Garante um valor padrão se `role` for undefined
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
    async show(id) {
        const user = await this.usersRepository.findOne({ where: { id } }); // Busca um usuário pelo ID
        if (!user) { // Se o usuário não for encontrado, lança uma exceção
            throw new common_1.NotFoundException(`O usuário ${id} não existe`);
        }
        return user; // Retorna o usuário encontrado
    }
    // ✅ Atualizar usuário (PUT) - Atualiza todos os campos
    async update(id, data) {
        const user = await this.show(id); // Verifica se o usuário existe antes de atualizar
        const salt = await bcrypt.genSalt(); // Gera um novo salt para a senha
        const hashedPassword = await bcrypt.hash(data.password, salt); // Criptografa a nova senha
        const mappedRole = this.mapRole(data.role ?? role_enums_1.Role.USER); // ✅ Garante um valor padrão se `data.role` for undefined
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
    async updatePartial(id, { email, name, password, birthAt, role }) {
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
    async delete(id) {
        const user = await this.show(id); // Verifica se o usuário existe antes de deletar
        return await this.usersRepository.remove(user); // Remove o usuário do banco e retorna
    }
    // ✅ Verifica se um usuário existe no banco
    async exists(id) {
        const count = await this.usersRepository.count({ where: { id } }); // Conta quantos usuários existem com esse ID
        if (count === 0) { // Se o usuário não existir, lança uma exceção
            throw new common_1.NotFoundException(`O usuário ${id} não existe`);
        }
    }
    // ✅ Mapeamento de Role (Administrador ou Usuário)
    mapRole(role) {
        if (typeof role === 'number') { // Se o role for um número
            return role === 2 ? role_enums_1.Role.ADMIN : role_enums_1.Role.USER; // Se for `2`, retorna `ADMIN`, senão `USER`
        }
        return role; // Se já for um Role válido, retorna como está
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)() // Indica que esta classe pode ser injetada em outros serviços do NestJS
    ,
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
