"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_controller_1 = require("./user.controller");
const user_service_mock_1 = require("../testing/user-service.mock"); // ✅ Importação do mock
describe("UserController", () => {
    let userController;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [user_controller_1.UserController],
            providers: [user_service_mock_1.userServiceMock], // ✅ Adicionado mock corretamente
        }).compile();
        userController = module.get(user_controller_1.UserController);
    });
    test("deve definir o UserController", () => {
        expect(userController).toBeDefined();
    });
    describe("Read", () => {
        test("list methods", async () => {
            const result = await userController.list();
            const expected = await user_service_mock_1.userServiceMock.useValue.list(); // ✅ Correção: Aguardar a promise
            expect(result).toEqual(expected);
        });
        test("show methods", async () => {
            const result = await userController.show(1);
            const expected = await user_service_mock_1.userServiceMock.useValue.show(); // ✅ Correção: Aguardar a promise
            expect(result).toEqual(expected);
        });
    });
    describe("Create", () => {
        test("create method", async () => {
            const createUserDto = { email: "test@example.com", name: "Test User", password: "123456" };
            const result = await userController.create(createUserDto);
            const expected = await user_service_mock_1.userServiceMock.useValue.create(); // ✅ Correção: Aguardar a promise
            expect(result).toEqual(expected);
        });
    });
    describe("Update", () => {
        test("update methods", async () => {
            const updateUserDto = { email: "updated@example.com", name: "Updated User", password: "123456" };
            const result = await userController.update(1, updateUserDto);
            const expected = await user_service_mock_1.userServiceMock.useValue.update(); // ✅ Correção: Aguardar a promise
            expect(result).toEqual(expected);
        });
        test("updatePartial methods", async () => {
            const updatePatchUserDto = { email: "partial@example.com" };
            const result = await userController.updatePartial(1, updatePatchUserDto);
            const expected = await user_service_mock_1.userServiceMock.useValue.updatePartial(); // ✅ Correção: Aguardar a promise
            expect(result).toEqual(expected);
        });
    });
    describe("Delete", () => {
        test("delete method", async () => {
            const result = await userController.delete(1);
            const expected = await user_service_mock_1.userServiceMock.useValue.delete(); // ✅ Correção: Aguardar a promise
            expect(result).toEqual(expected);
        });
    });
});
