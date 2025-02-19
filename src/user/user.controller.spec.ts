import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";

import { userServiceMock } from "../testing/user-service.mock"; // ✅ Importação do mock

describe("UserController", () => {
    let userController: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [userServiceMock], // ✅ Adicionado mock corretamente
        }).compile();

        userController = module.get<UserController>(UserController);
    });

    test("deve definir o UserController", () => {
        expect(userController).toBeDefined();
    });

    describe("Read", () => {
        test("list methods", async () => {
            const result = await userController.list();
            const expected = await userServiceMock.useValue.list(); // ✅ Correção: Aguardar a promise
            expect(result).toEqual(expected);
        });

        test("show methods", async () => {
            const result = await userController.show(1);
            const expected = await userServiceMock.useValue.show(); // ✅ Correção: Aguardar a promise
            expect(result).toEqual(expected);
        });
    });

    describe("Create", () => {
        test("create method", async () => {
            const createUserDto = { email: "test@example.com", name: "Test User", password: "123456" };
            const result = await userController.create(createUserDto);
            const expected = await userServiceMock.useValue.create(); // ✅ Correção: Aguardar a promise
            expect(result).toEqual(expected);
        });
    });

    describe("Update", () => {
        test("update methods", async () => {
            const updateUserDto = { email: "updated@example.com", name: "Updated User", password: "123456" };
            const result = await userController.update(1, updateUserDto);
            const expected = await userServiceMock.useValue.update(); // ✅ Correção: Aguardar a promise
            expect(result).toEqual(expected);
        });

        test("updatePartial methods", async () => {
            const updatePatchUserDto = { email: "partial@example.com" };
            const result = await userController.updatePartial(1, updatePatchUserDto);
            const expected = await userServiceMock.useValue.updatePartial(); // ✅ Correção: Aguardar a promise
            expect(result).toEqual(expected);
        });
    });

    describe("Delete", () => {
        test("delete method", async () => {
            const result = await userController.delete(1);
            const expected = await userServiceMock.useValue.delete(); // ✅ Correção: Aguardar a promise
            expect(result).toEqual(expected);
        });
    });
});

