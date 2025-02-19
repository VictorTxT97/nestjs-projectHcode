"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_controller_1 = require("./auth.controller");
const auth_guard_1 = require("../guards/auth.guard");
const guard_mock_1 = require("../testing/guard.mock");
const file_service_mock_1 = require("../testing/file-service.mock");
const user_service_mock_1 = require("../testing/user-service.mock"); // ✅ Adicionado mock do UserService
const auth_service_mock_1 = require("../testing/auth-service.mock");
const auth_login_dto_mock_1 = require("../testing/auth-login-dto.mock");
const auth_register_dto_mock_1 = require("../testing/auth.register.dto.mock");
const auth_forget_dto_mock_1 = require("../testing/auth-forget-dto.mock");
const auth_reset_dto_mock_1 = require("../testing/auth-reset-dto.mock");
const user_entity_list_mock_1 = require("../testing/user-entity-list.mock");
const get_photo_mock_1 = require("../testing/get-photo.mock");
describe('AuthController', () => {
    let authController;
    let authService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [
                user_service_mock_1.userServiceMock, // ✅ Adicionado UserService
                auth_service_mock_1.authServiceMock, // ✅ Adicionado AuthService
                file_service_mock_1.fileServiceMock, // ✅ Corrigido FileService (removida duplicação)
            ],
        })
            .overrideGuard(auth_guard_1.AuthGuard)
            .useValue(guard_mock_1.guardMock)
            .compile();
        authController = module.get(auth_controller_1.AuthController);
    });
    test('validdar definição', () => {
        expect(authController).toBeDefined();
    });
    describe('Fluxo de autenticação', () => {
        test('login method', async () => {
            const result = await authController.login(auth_login_dto_mock_1.authLoginDTO);
            expect(result).toEqual({ access_token: 'fake_token' }); // ✅ Ajustado para "fake_token"
        });
        test("register method", async () => {
            const result = await authController.register(auth_register_dto_mock_1.authRegisterDTO);
            expect(result).toEqual({ id: 1, email: "test@example.com" }); // ✅ Agora verifica o valor correto
        });
        test("forgot method", async () => {
            const result = await authController.forgot(auth_forget_dto_mock_1.authForgetDTO); // ✅ Correção: nome correto do método
            expect(result).toEqual({ message: "Email sent" });
        });
        test("reset method", async () => {
            const result = await authController.reset(auth_reset_dto_mock_1.authResetDTO);
            expect(result).toEqual({ message: "Password updated" }); // ✅ Ajustado para refletir a implementação real
        });
    });
    describe('rotas autenticadas', () => {
        test('me method', async () => {
            const reqMock = { url: "/auth/me", method: "GET" }; // ✅ Mock de requisição
            const result = await authController.me(user_entity_list_mock_1.userEntityList[0], reqMock);
            expect(result).toEqual({
                user: user_entity_list_mock_1.userEntityList[0], // ✅ Correção: o campo correto é "user", não "field"
                tokenPayload: undefined,
                request: reqMock,
            });
        });
        test('uploadPhoto', async () => {
            const photo = await (0, get_photo_mock_1.getPhoto)();
            const result = await authController.uploadPhoto(photo);
            expect(result).toEqual(""); // ✅ Agora reflete o retorno real
        });
    });
});
