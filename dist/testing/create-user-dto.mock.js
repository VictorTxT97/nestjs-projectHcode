"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creatUserDto = void 0;
const role_enums_1 = require("../enums/role.enums");
exports.creatUserDto = {
    birthAt: '1995-08-14',
    email: 'victor.t@example.com',
    name: 'Victor Teixeira',
    password: '123456',
    role: role_enums_1.Role.ADMIN
};
