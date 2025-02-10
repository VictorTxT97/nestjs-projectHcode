"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
// Define a chave usada para armazenar roles na metadata
exports.ROLES_KEY = 'roles';
// Decorador personalizado para associar roles a uma rota
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
