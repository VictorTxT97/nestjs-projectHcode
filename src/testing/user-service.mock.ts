import { UserService } from "../user/user.service";
import { Role } from "../enums/role.enums";
import { userEntityList } from "./user-entity-list.mock";

export const userServiceMock = {
    provide: UserService,
    useValue: {
        show: jest.fn().mockResolvedValue(userEntityList[0]),
        create: jest.fn().mockResolvedValue(userEntityList[0]),
        list: jest.fn().mockResolvedValue(userEntityList),
        update: jest.fn().mockResolvedValue(userEntityList[0]),
        updatePartial: jest.fn().mockResolvedValue(userEntityList[0]),
        delete: jest.fn().mockResolvedValue(true),
        exists: jest.fn().mockResolvedValue(true),

        findOne: jest.fn().mockImplementation(({ where }) => {
            // Se o e-mail já existir no banco, retorna um usuário simulado
            if (where?.email === "janira@gmail.com") {
                return Promise.resolve({
                    id: 22,
                    email: "janira@gmail.com",
                    password: "$2b$10$hashedpassword",
                    role: Role.USER,
                });
            }
            
            // Caso contrário, retorna undefined (simulando um e-mail não cadastrado)
            return Promise.resolve(undefined);
        }),

        save: jest.fn().mockImplementation((user) => 
            Promise.resolve({ ...user, id: Date.now() }) // ✅ Simula um usuário salvo com ID único
        ),
    },
};
