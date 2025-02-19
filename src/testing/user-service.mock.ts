import { UserService } from "../user/user.service";

export const userServiceMock = {
    provide: UserService,
    useValue: {
        list: jest.fn().mockResolvedValue([
            { id: 1, email: "test@example.com", name: "Test User", role: "USER" },
        ]), // ✅ Corrigido: list() agora retorna um array

        show: jest.fn().mockResolvedValue({
            id: 1, email: "test@example.com", name: "Test User", role: "USER",
        }), // ✅ Corrigido: show() agora retorna um usuário válido

        create: jest.fn().mockResolvedValue({
            id: 1, email: "test@example.com", name: "Test User", password: "123456",
        }), // ✅ Corrigido: create() agora retorna um usuário

        update: jest.fn().mockResolvedValue({
            id: 1, email: "updated@example.com", name: "Updated User",
        }), // ✅ Corrigido: update() agora retorna o usuário atualizado

        updatePartial: jest.fn().mockResolvedValue({
            id: 1, email: "partial@example.com", name: "Partial Updated User",
        }), // ✅ Corrigido: updatePartial() agora está presente

        delete: jest.fn().mockResolvedValue(true), // ✅ Corrigido: delete() agora está presente

        findOne: jest.fn().mockImplementation(({ where }) => {
            // Simulação de busca por e-mail
            if (where?.email === "test@example.com") {
                return Promise.resolve({
                    id: 1, email: "test@example.com", password: "hashedpassword",
                });
            }
            return Promise.resolve(undefined);
        }),
    },
};
