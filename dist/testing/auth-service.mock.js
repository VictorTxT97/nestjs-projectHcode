"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServiceMock = void 0;
const auth_service_1 = require("../auth/auth.service");
exports.authServiceMock = {
    provide: auth_service_1.AuthService,
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
