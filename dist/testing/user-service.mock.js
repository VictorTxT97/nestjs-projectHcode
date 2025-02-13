"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServiceMock = void 0;
const user_service_1 = require("../user/user.service");
const role_enums_1 = require("../enums/role.enums");
const user_entity_list_mock_1 = require("./user-entity-list.mock");
exports.userServiceMock = {
    provide: user_service_1.UserService,
    useValue: {
        show: jest.fn().mockResolvedValue(user_entity_list_mock_1.userEntityList[0]),
        create: jest.fn().mockResolvedValue(user_entity_list_mock_1.userEntityList[0]),
        list: jest.fn().mockResolvedValue(user_entity_list_mock_1.userEntityList),
        update: jest.fn().mockResolvedValue(user_entity_list_mock_1.userEntityList[0]),
        updatePartial: jest.fn().mockResolvedValue(user_entity_list_mock_1.userEntityList[0]),
        delete: jest.fn().mockResolvedValue(true),
        exists: jest.fn().mockResolvedValue(true),
        findOne: jest.fn().mockImplementation(({ where }) => {
            // Se o e-mail for novo, retorna undefined
            if (where?.email) {
                return Promise.resolve(undefined);
            }
            return Promise.resolve({
                id: 22,
                email: 'janira@gmail.com',
                password: '$2b$10$hashedpassword',
                role: role_enums_1.Role.USER,
            });
        }),
        save: jest.fn().mockImplementation((user) => Promise.resolve({ ...user, id: Date.now() }) // ✅ Simula um usuário salvo com ID único
        ),
    },
};
