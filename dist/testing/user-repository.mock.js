"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepositoryMock = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entity/user.entity");
const user_entity_list_mock_1 = require("./user-entity-list.mock");
exports.userRepositoryMock = {
    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.UserEntity),
    useValue: {
        exist: jest.fn().mockResolvedValue(true),
        create: jest.fn(),
        save: jest.fn().mockResolvedValue(user_entity_list_mock_1.userEntityList[0]),
        find: jest.fn().mockResolvedValue(user_entity_list_mock_1.userEntityList),
        findOne: jest.fn().mockResolvedValue(user_entity_list_mock_1.userEntityList[0]),
        update: jest.fn(),
        updatePartial: jest.fn(),
        delete: jest.fn(),
        remove: jest.fn(),
        count: jest.fn(),
    },
};
