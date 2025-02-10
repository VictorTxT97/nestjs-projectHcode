"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_login_dto_1 = require("./dto/auth-login.dto");
const auth_register_dto_1 = require("./dto/auth-register.dto");
const auth_forget_dto_1 = require("./dto/auth-forget.dto");
const auth_reset_dto_1 = require("./dto/auth-reset.dto");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("../user/user.service");
const auth_guard_1 = require("../guards/auth.guard");
const user_decorator_1 = require("../decorators/user.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
const file_service_1 = require("../file/file.service");
const user_entity_1 = require("../user/entity/user.entity");
let AuthController = class AuthController {
    constructor(userService, authService, fileService) {
        this.userService = userService;
        this.authService = authService;
        this.fileService = fileService;
    }
    async login(body) {
        return this.authService.login(body.email, body.password);
    }
    async register(body) {
        return this.authService.register(body);
    }
    async forgot(body) {
        return this.authService.forget(body.email);
    }
    async reset(body) {
        return this.authService.reset(body.password, body.token);
    }
    async me(user, field) {
        if (field) {
            if (user[field]) {
                return { [field]: user[field] };
            }
            else {
                return { error: `Propriedade '${field}' não encontrada no usuário` };
            }
        }
        return { user };
    }
    async uploadPhoto(file) {
        if (!file) {
            throw new common_1.BadRequestException('Arquivo não encontrado');
        }
        const filePath = (0, path_1.join)(__dirname, '../../storage', file.originalname);
        try {
            await this.fileService.upload(file, filePath);
        }
        catch (e) {
            if (e instanceof Error) {
                throw new common_1.BadRequestException(e.message);
            }
            else {
                throw new common_1.BadRequestException('Erro inesperado');
            }
        }
        return await this.fileService.upload(file, filePath);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_login_dto_1.AuthLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_register_dto_1.AuthRegisterDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('forget'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_forget_dto_1.AuthForgetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgot", null);
__decorate([
    (0, common_1.Post)('reset'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_reset_dto_1.AuthResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "reset", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('me'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('field')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('photo'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "uploadPhoto", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService,
        file_service_1.FileService])
], AuthController);
