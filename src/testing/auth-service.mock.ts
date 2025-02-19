import { AuthService } from "../auth/auth.service";

export const authServiceMock = {
    provide: AuthService,
    useValue: {
        login: jest.fn().mockResolvedValue({ access_token: "fake_token" }),
        register: jest.fn().mockResolvedValue({ id: 1, email: "test@example.com" }),
        forget: jest.fn().mockResolvedValue({ message: "Email sent" }),
        reset: jest.fn().mockResolvedValue({ message: "Password updated" }),
        me: jest.fn().mockResolvedValue({
            field: { id: 1, email: "test@example.com" },
            request: { url: "/auth/me", method: "GET" },
            tokenPayload: null, // Ajuste conforme necessário
        }),
        
    },
};

