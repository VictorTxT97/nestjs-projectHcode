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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_patch_user_dto_1 = require("./dto/update-patch-user.dto");
const roles_decorator_1 = require("../decorators/roles.decorator");
const role_enums_1 = require("../enums/role.enums");
const auth_guard_1 = require("../guards/auth.guard");
const role_guard_1 = require("../guards/role.guard");
const log_interceptor_1 = require("../interceptors/log.interceptor");
const param_is_decorator_1 = require("../decorators/param-is.decorator");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    // CREATE
    async create(body) {
        try {
            const user = await this.userService.create(body);
            return user;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    // LIST ALL
    async list() {
        return await this.userService.list();
    }
    // SHOW (FIND BY ID)
    async show(id) {
        const user = await this.userService.show(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found.`);
        }
        return user;
    }
    // UPDATE (PUT)
    async update(id, body) {
        try {
            const updatedUser = await this.userService.update(id, body);
            if (!updatedUser) {
                throw new common_1.NotFoundException(`User with ID ${id} not found.`);
            }
            return updatedUser;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    // PARTIAL UPDATE (PATCH)
    async updatePartial(id, body) {
        try {
            const updatedUser = await this.userService.updatePartial(id, body);
            if (!updatedUser) {
                throw new common_1.NotFoundException(`User with ID ${id} not found.`);
            }
            return updatedUser;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    // DELETE
    async delete(id) {
        try {
            const result = await this.userService.delete(id);
            return result; // Retornará vazio devido ao HTTP 204
        }
        catch (error) {
            throw new common_1.NotFoundException(`User with ID ${id} not found.`);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, param_is_decorator_1.ParamId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "show", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, param_is_decorator_1.ParamId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_user_dto_1.CreateUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, param_is_decorator_1.ParamId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_patch_user_dto_1.UpdatePatchUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePartial", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, param_is_decorator_1.ParamId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
exports.UserController = UserController = __decorate([
    (0, roles_decorator_1.Roles)(role_enums_1.Role.ADMIN),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)(log_interceptor_1.LogInterceptor),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
