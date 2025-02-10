"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_service_1 = require("./user.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entity/user.entity");
const user_repository_mock_1 = require("../testing/user-repository.mock");
const user_entity_list_mock_1 = require("../testing/user-entity-list.mock");
const create_user_dto_mock_1 = require("../testing/create-user-dto.mock");
const update_put_user_dto_mock_1 = require("../testing/update-put-user-dto.mock");
const update_patch_user_dto_mock_1 = require("../testing/update-patch-user-dto.mock");
describe('UserService', () => {
    let userService;
    let userRepository;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                user_service_1.UserService,
                user_repository_mock_1.userRepositoryMock
            ],
        }).compile();
        userService = module.get(user_service_1.UserService);
        userRepository = module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.UserEntity));
    });
    test('validar a definição', () => {
        expect(userService).toBeDefined();
        expect(userRepository).toBeDefined();
    });
    describe('Create', () => {
        test('method creat', async () => {
            jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(false);
            const result = await userService.create(create_user_dto_mock_1.creatUserDto);
            expect(result).toEqual(user_entity_list_mock_1.userEntityList[0]);
        });
    });
    describe('Read', () => {
        test('method list', async () => {
            const result = await userService.list();
            expect(result).toEqual(user_entity_list_mock_1.userEntityList);
        });
        test('method show', async () => {
            const result = await userService.show(1);
            expect(result).toEqual(user_entity_list_mock_1.userEntityList[0]);
        });
    });
    describe('Update', () => {
        test('method update', async () => {
            const result = await userService.update(1, update_put_user_dto_mock_1.updatePutUserDto);
            expect(result).toEqual(user_entity_list_mock_1.userEntityList[0]);
        });
        test('method updatePartial', async () => {
            const result = await userService.updatePartial(1, update_patch_user_dto_mock_1.updatePatchUserDto);
            expect(result).toEqual(user_entity_list_mock_1.userEntityList[0]);
        });
    });
    describe('Delete', () => {
        test('method delete', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user_entity_list_mock_1.userEntityList[0]); // Simula que o usuário existe
            jest.spyOn(userRepository, 'remove').mockResolvedValueOnce(user_entity_list_mock_1.userEntityList[0]); // Retorna o próprio usuário excluído
            const result = await userService.delete(1);
            expect(result).toEqual(user_entity_list_mock_1.userEntityList[0]); // Agora esperamos que retorne o próprio usuário excluído
        });
        test('should throw an error if user does not exist', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null); // Simula usuário inexistente
            await expect(userService.delete(99)).rejects.toThrowError(`O usuário 99 não existe`); // ✅ Corrigido para refletir a mensagem real
        });
    });
});
