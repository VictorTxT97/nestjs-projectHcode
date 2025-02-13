"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const user_repository_mock_1 = require("../testing/user-repository.mock");
const jwt_service_mock_1 = require("../testing/jwt-service.mock");
const user_service_mock_1 = require("../testing/user-service.mock");
const mailer_service_mock_1 = require("../testing/mailer-service.mock");
const user_entity_list_mock_1 = require("../testing/user-entity-list.mock");
const access_token_mock_1 = require("../testing/access-token.mock");
const jwt_payload_mock_1 = require("../testing/jwt-payload.mock");
const reset_token_mock_1 = require("../testing/reset-token.mock");
const user_service_1 = require("../user/user.service");
// ✅ Mockando todo o módulo `bcrypt`
jest.mock('bcrypt', () => ({
    compare: jest.fn().mockResolvedValue(true),
    hashSync: jest.fn().mockReturnValue('$2b$10$hashedpassword'),
    genSalt: jest.fn().mockResolvedValue('$2b$10$saltmocked'),
    hash: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
}));
let authService;
describe('AuthService', () => {
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: user_service_1.UserService,
                    useValue: {
                        findOne: jest.fn().mockResolvedValue(undefined), // 🔥 Mock aplicado direto aqui
                        save: jest.fn().mockImplementation((user) => Promise.resolve({ ...user, id: Date.now() })),
                    },
                },
                user_repository_mock_1.userRepositoryMock,
                jwt_service_mock_1.jwtServiveMock,
                mailer_service_mock_1.mailerServiveMock,
            ],
        }).compile();
        authService = module.get(auth_service_1.AuthService);
    });
    test('validar a definição', () => {
        expect(authService).toBeDefined();
    });
    describe('Token', () => {
        test('createToken method', async () => {
            const result = await authService.generateToken(user_entity_list_mock_1.userEntityList[0]);
            expect(result).toEqual(access_token_mock_1.accessToken);
        });
        test('checkToken method', async () => {
            const token = await authService.generateToken(user_entity_list_mock_1.userEntityList[0]);
            const result = authService.checkToken(token);
            expect(result).toEqual(jwt_payload_mock_1.jwtPayload);
        });
        test('isValidToken method', async () => {
            const token = await authService.generateToken(user_entity_list_mock_1.userEntityList[0]);
            const result = authService.isValidToken(token);
            expect(result).toBe(true);
        });
    });
    describe('Autenticação', () => {
        test('login method', async () => {
            const result = await authService.login('RODRIGO.allen@example.com', '12345678');
            expect(result).toEqual({ access_token: access_token_mock_1.accessToken });
        });
        test('forget method', async () => {
            const result = await authService.forget('RODRIGO.allen@example.com');
            expect(result).toEqual({ message: "E-mail de recuperação enviado!" });
        });
        test('reset method', async () => {
            const result = await authService.reset('654321', reset_token_mock_1.resetToken);
            expect(result).toHaveProperty("message", "Senha atualizada com sucesso!");
            expect(result).toHaveProperty("token");
        });
        test('register method', async () => {
            const uniqueEmail = `novo.usuario.${Math.random()}@example.com`;
            // 🔥 Resetando e forçando findOne para retornar undefined
            user_service_mock_1.userServiceMock.useValue.findOne.mockReset();
            user_service_mock_1.userServiceMock.useValue.findOne.mockResolvedValue(undefined);
            console.log("🔥 Mock de findOne chamado no teste, esperando undefined!");
            const result = await authService.register({
                email: uniqueEmail,
                password: 'senha123',
                name: 'Novo Usuário'
            });
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('email', uniqueEmail);
            // ✅ Verificando se findOne foi chamado corretamente
            expect(user_service_mock_1.userServiceMock.useValue.findOne).toHaveBeenCalledWith({
                where: { email: uniqueEmail }
            });
        });
    });
});
