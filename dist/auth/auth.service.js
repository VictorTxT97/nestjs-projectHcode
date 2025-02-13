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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_2 = require("@nestjs/typeorm");
const mailer_1 = require("@nestjs-modules/mailer");
const user_service_1 = require("../user/user.service");
const user_entity_1 = require("../user/entity/user.entity");
let AuthService = class AuthService {
    constructor(jwtService, userService, mailer, usersRepository) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.mailer = mailer;
        this.usersRepository = usersRepository;
    }
    /**
     * Gera um token JWT para o usuário autenticado
     */
    async generateToken(user) {
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
     * Verifica se um token JWT é válido e retorna os dados do usuário.
     */
    checkToken(token) {
        try {
            const data = this.jwtService.verify(token, {
                issuer: 'login',
                audience: 'users',
            });
            return data;
        }
        catch (e) {
            throw new common_1.BadRequestException(e);
        }
    }
    /**
     * Retorna um booleano indicando se um token JWT é válido.
     */
    isValidToken(token) {
        try {
            this.checkToken(token);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Realiza login do usuário e retorna um token JWT
     */
    async login(email, password) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        return { access_token: this.jwtService.sign(payload) };
    }
    /**
     * Registra um novo usuário
     */
    async register(body) {
        const userExists = await this.usersRepository.findOne({ where: { email: body.email } });
        console.log("🚀 Valor retornado por findOne no register:", userExists); // 🔥 Adicionado para depuração
        if (userExists) {
            throw new common_1.BadRequestException('E-mail já cadastrado');
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = this.usersRepository.create({ ...body, password: hashedPassword });
        return await this.usersRepository.save(newUser);
    }
    /**
     * Envia um e-mail para redefinição de senha
     */
    async forget(email) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('E-mail não encontrado');
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
    async reset(password, token) {
        try {
            const payload = this.jwtService.verify(token, { issuer: 'login' });
            const id = parseInt(payload.sub, 10);
            const user = await this.usersRepository.findOne({ where: { id } });
            if (!user) {
                throw new common_1.BadRequestException('Usuário não encontrado.');
            }
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            await this.usersRepository.update(id, { password: hashedPassword });
            return {
                message: 'Senha atualizada com sucesso!',
                token: this.generateToken(user),
            };
        }
        catch (e) {
            if (e instanceof Error) {
                throw new common_1.BadRequestException(e.message || 'Token inválido ou expirado.');
            }
            else {
                throw new common_1.BadRequestException('Erro inesperado');
            }
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_2.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        mailer_1.MailerService,
        typeorm_1.Repository])
], AuthService);
