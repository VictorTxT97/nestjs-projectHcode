import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { userRepositoryMock } from "../testing/user-repository.mock";
import { jwtServiveMock } from "../testing/jwt-service.mock";
import { userServiceMock } from "../testing/user-service.mock";
import { mailerServiveMock } from "../testing/mailer-service.mock";
import { userEntityList } from "../testing/user-entity-list.mock";
import { accessToken } from "../testing/access-token.mock";
import { jwtPayload } from "../testing/jwt-payload.mock";
import * as bcrypt from 'bcrypt';
import { resetToken } from "../testing/reset-token.mock";
import { UserService } from "../user/user.service";

// ✅ Mockando todo o módulo `bcrypt`
jest.mock('bcrypt', () => ({
    compare: jest.fn().mockResolvedValue(true),
    hashSync: jest.fn().mockReturnValue('$2b$10$hashedpassword'),
    genSalt: jest.fn().mockResolvedValue('$2b$10$saltmocked'),
    hash: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
}));

let authService: AuthService;

describe('AuthService', () => {
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: userServiceMock.useValue,
                },
                userRepositoryMock,
                jwtServiveMock,
                mailerServiveMock,
            ],
        }).compile();
    
        authService = module.get<AuthService>(AuthService);
    });
    
    
    test('validar a definição', () => {
        expect(authService).toBeDefined();
    });

    describe('Token', () => {
        test('createToken method', async () => {
            const result = await authService.generateToken(userEntityList[0]);
            expect(result).toEqual(accessToken);
        });

        test('checkToken method', async () => {
            const token = await authService.generateToken(userEntityList[0]);
            const result = authService.checkToken(token);
            expect(result).toEqual(jwtPayload);
        });

        test('isValidToken method', async () => {
            const token = await authService.generateToken(userEntityList[0]);
            const result = authService.isValidToken(token);
            expect(result).toBe(true);
        });
    });

    describe('Autenticação', () => {
        test('login method', async () => {
            const result = await authService.login('RODRIGO.allen@example.com', '12345678');
            expect(result).toEqual({ access_token: accessToken });
        });

        test('forget method', async () => {
            const result = await authService.forget('RODRIGO.allen@example.com');
            expect(result).toEqual({ message: "E-mail de recuperação enviado!" });
        });

        test('reset method', async () => {
            const result = await authService.reset('654321', resetToken);
            expect(result).toHaveProperty("message", "Senha atualizada com sucesso!");
            expect(result).toHaveProperty("token");
        });

    test('register method', async () => {
    const uniqueEmail = `novo.usuario.${Math.random()}@example.com`;

    // Garantindo que findOne retorne null para simular que o usuário não existe
    userServiceMock.useValue.findOne.mockImplementation(() => Promise.resolve(null));

    console.log("🔥 Mock de findOne chamado no teste, esperando null!");

    const result = await authService.register({
        email: uniqueEmail,
        password: 'senha123',
        name: 'Novo Usuário'
    });

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email', uniqueEmail);

    // Verificando se findOne foi chamado corretamente
    expect(userServiceMock.useValue.findOne).toHaveBeenCalledWith({
        where: { email: uniqueEmail }
    });
});

        
    });
});
