"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userEntityList = void 0;
const role_enums_1 = require("../enums/role.enums");
exports.userEntityList = [{
        name: "rodrigo alvarenGA",
        email: "RODRIGO.allen@example.com",
        password: "$2b$10$vjPcar4tgrGd20euC5KRvu.ftbrWYUc5J8mVc0uCp/lI6YcCr6SXO",
        birthAt: new Date('1990-07-14'),
        id: 12,
        role: role_enums_1.Role.USER,
        createdAt: new Date(),
        updatedAt: new Date()
    }, {
        name: "serena williys",
        email: "serena@example.com",
        password: "$2b$10$uRVNGgVjQMqeITG1Dvd7Ju8f9D39.hgJZe3h1Qu/RWR.tl3QnrIxe",
        birthAt: new Date('1977-05-18'),
        id: 18,
        role: role_enums_1.Role.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date()
    }, {
        name: "Roblox gay",
        email: "roblox@example.com",
        password: "$2b$10$u3narFiRQ.UpDlzzpCKaY.Bsol4vDiJzuWAjFc7en8jRTZ7dCEEka",
        birthAt: new Date('1955-03-30'),
        id: 17,
        role: role_enums_1.Role.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date()
    }];
