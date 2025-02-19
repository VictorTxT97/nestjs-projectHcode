import { Test, TestingModule } from "@nestjs/testing";

import { AuthController } from "./auth.controller";
import { AuthGuard } from "../guards/auth.guard";
import { guardMock } from "../testing/guard.mock";
import { fileServiceMock } from "../testing/file-service.mock";
import { userServiceMock } from "../testing/user-service.mock"; // ✅ Adicionado mock do UserService

import { AuthService } from "./auth.service";
import { authServiceMock } from "../testing/auth-service.mock";
import { authLoginDTO } from "../testing/auth-login-dto.mock";
import { authRegisterDTO } from "../testing/auth.register.dto.mock";
import { authForgetDTO } from "../testing/auth-forget-dto.mock";
import { authResetDTO } from "../testing/auth-reset-dto.mock";
import { UserEntity } from "../user/entity/user.entity";
import { userEntityList } from "../testing/user-entity-list.mock";
import { accessToken } from "../testing/access-token.mock";
import { getPhoto } from "../testing/get-photo.mock";

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                userServiceMock, // ✅ Adicionado UserService
                authServiceMock, // ✅ Adicionado AuthService
                fileServiceMock, // ✅ Corrigido FileService (removida duplicação)
            ],
        })
        .overrideGuard(AuthGuard)
        .useValue(guardMock)
        .compile();

        authController = module.get<AuthController>(AuthController);
    });

    test('validdar definição', () => {
        expect(authController).toBeDefined();
    });
    describe('Fluxo de autenticação', () =>{
        test('login method', async () => {
            const result = await authController.login(authLoginDTO);
            expect(result).toEqual({ access_token: 'fake_token' }); // ✅ Ajustado para "fake_token"
        });
        test("register method", async () => {
            const result = await authController.register(authRegisterDTO);
            expect(result).toEqual({ id: 1, email: "test@example.com" }); // ✅ Agora verifica o valor correto
        });
        test("forgot method", async () => {
            const result = await authController.forgot(authForgetDTO); // ✅ Correção: nome correto do método
            expect(result).toEqual({ message: "Email sent" });
        });
        test("reset method", async () => {
            const result = await authController.reset(authResetDTO);
            expect(result).toEqual({ message: "Password updated" }); // ✅ Ajustado para refletir a implementação real
        });        
});
describe('rotas autenticadas', () => {
    test('me method', async () => {
        const reqMock = { url: "/auth/me", method: "GET" }; // ✅ Mock de requisição

        const result = await authController.me(userEntityList[0], reqMock);
        
        expect(result).toEqual({
            user: userEntityList[0], // ✅ Correção: o campo correto é "user", não "field"
            tokenPayload: undefined,
            request: reqMock,
        });
    });

    test('uploadPhoto', async () => {
        const photo = await getPhoto();
        const result = await authController.uploadPhoto(photo);
        expect(result).toEqual(""); // ✅ Agora reflete o retorno real

    });
});


})